import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabaseClient } from '@/config/supabaseClient';

const storageKey = (userId) => `creator-records:${userId}`;
const emptyState = { profile: null, records: [], evidence: [] };

export const useCreatorRecords = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [state, setState] = useState(emptyState);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(null);

  const saveLocal = useCallback((next) => {
    setState(next);
    if (userId) window.localStorage.setItem(storageKey(userId), JSON.stringify(next));
  }, [userId]);

  const sync = useCallback(async (next) => {
    if (!userId) return;
    const profile = next.profile ? { ...next.profile, user_id: userId, updated_at: new Date().toISOString() } : null;
    const records = next.records.map((record) => ({ ...record, user_id: userId, updated_at: new Date().toISOString() }));
    const evidence = next.evidence.map((item) => ({ ...item, user_id: userId }));
    const calls = [];
    if (profile) calls.push(supabaseClient.from('creator_profiles').upsert(profile, { onConflict: 'user_id' }));
    if (records.length) calls.push(supabaseClient.from('creator_records').upsert(records, { onConflict: 'id' }));
    if (evidence.length) calls.push(supabaseClient.from('creator_evidence').upsert(evidence, { onConflict: 'id' }));
    const results = await Promise.all(calls);
    const failed = results.find(({ error }) => error);
    if (failed?.error) throw failed.error;
  }, [userId]);

  const persist = useCallback((next) => {
    saveLocal(next);
    sync(next).then(() => setSyncError(null)).catch((error) => { console.warn('Creator records sync failed.', error); setSyncError(error); });
  }, [saveLocal, sync]);

  const load = useCallback(async () => {
    if (!userId) { setState(emptyState); setLoading(false); return; }
    setLoading(true);
    const local = (() => { try { return JSON.parse(window.localStorage.getItem(storageKey(userId))) || emptyState; } catch { return emptyState; } })();
    setState(local);
    try {
      const [profileResult, recordsResult, evidenceResult] = await Promise.all([
        supabaseClient.from('creator_profiles').select('*').eq('user_id', userId).maybeSingle(),
        supabaseClient.from('creator_records').select('*').eq('user_id', userId).order('received_date', { ascending: false }),
        supabaseClient.from('creator_evidence').select('*').eq('user_id', userId),
      ]);
      const error = profileResult.error || recordsResult.error || evidenceResult.error;
      if (error) throw error;
      const remote = { profile: profileResult.data, records: recordsResult.data || [], evidence: evidenceResult.data || [] };
      const next = remote.records.length || remote.profile ? remote : local;
      saveLocal(next);
    } catch (error) { setSyncError(error); } finally { setLoading(false); }
  }, [saveLocal, userId]);

  useEffect(() => { load(); }, [load]);
  const updateProfile = (profile) => persist({ ...state, profile: { ...state.profile, ...profile } });
  const saveRecord = (record) => persist({ ...state, records: [record, ...state.records.filter((item) => item.id !== record.id)] });
  const importRecords = (records) => persist({ ...state, records: [...records, ...state.records] });
  const removeRecord = (id) => {
    persist({ ...state, records: state.records.filter((item) => item.id !== id), evidence: state.evidence.filter((item) => item.creator_record_id !== id) });
    if (userId) {
      supabaseClient.from('creator_records').delete().eq('id', id).eq('user_id', userId)
        .then(({ error }) => { if (error) setSyncError(error); });
    }
  };
  const addEvidence = async ({ recordId, file }) => {
    const id = crypto.randomUUID();
    const extension = file.name.split('.').pop()?.toLowerCase() || 'file';
    const storagePath = `${userId}/${recordId}/${id}.${extension}`;
    const item = { id, creator_record_id: recordId, file_name: file.name, file_type: file.type, file_size: file.size, storage_path: storagePath, uploaded_at: new Date().toISOString() };
    try {
      const { error } = await supabaseClient.storage.from('creator-evidence').upload(storagePath, file, { upsert: false });
      if (error) throw error;
      persist({ ...state, evidence: [item, ...state.evidence] });
    } catch (error) { setSyncError(error); throw error; }
  };
  return { ...state, loading, syncError, updateProfile, saveRecord, importRecords, removeRecord, addEvidence, refresh: load };
};
