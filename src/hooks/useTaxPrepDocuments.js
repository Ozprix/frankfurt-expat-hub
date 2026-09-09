import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabaseClient } from '@/config/supabaseClient';
import {
  mergeTaxPrepDocuments,
  namespaceTaxPrepDocumentId,
  taxPrepDocuments,
  taxPrepStorageKey,
} from '@/utils/taxPrep';

const defaultDocuments = taxPrepDocuments.map((document) => ({
  ...document,
  ready: false,
  notes: '',
}));

const readLocalDocuments = (userId) => {
  try {
    const stored = window.localStorage.getItem(taxPrepStorageKey(userId));
    return stored ? mergeTaxPrepDocuments(JSON.parse(stored)) : defaultDocuments;
  } catch {
    return defaultDocuments;
  }
};

export const useTaxPrepDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState(defaultDocuments);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(null);
  const userId = user?.id;

  const persistDocuments = useCallback(async (updatedDocuments) => {
    if (!userId) return;

    window.localStorage.setItem(taxPrepStorageKey(userId), JSON.stringify(updatedDocuments));

    const rows = updatedDocuments.map((document) => ({
      user_id: userId,
      document_id: namespaceTaxPrepDocumentId(document.id),
      name: document.name,
      description: document.description,
      ready: Boolean(document.ready),
      notes: document.notes || '',
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabaseClient
      .from('user_document_checklist')
      .upsert(rows, { onConflict: 'user_id,document_id' });

    if (error) throw error;
  }, [userId]);

  const loadDocuments = useCallback(async () => {
    if (!userId) {
      setDocuments(defaultDocuments);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSyncError(null);

    const localDocuments = readLocalDocuments(userId);
    setDocuments(localDocuments);

    try {
      const { data, error } = await supabaseClient
        .from('user_document_checklist')
        .select('document_id, name, description, ready, notes')
        .eq('user_id', userId)
        .like('document_id', 'taxprep-%');

      if (error) throw error;

      if (data && data.length > 0) {
        const merged = mergeTaxPrepDocuments(data);
        setDocuments(merged);
        window.localStorage.setItem(taxPrepStorageKey(userId), JSON.stringify(merged));
      } else if (localDocuments.some((document) => document.ready || document.notes)) {
        await persistDocuments(localDocuments);
      }
    } catch (error) {
      console.warn('Tax prep checklist sync failed; using local fallback.', error);
      setSyncError(error);
      setDocuments(localDocuments);
    } finally {
      setLoading(false);
    }
  }, [persistDocuments, userId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const saveDocuments = (updatedDocuments) => {
    setDocuments(updatedDocuments);
    if (!userId) return;

    window.localStorage.setItem(taxPrepStorageKey(userId), JSON.stringify(updatedDocuments));
    persistDocuments(updatedDocuments)
      .then(() => setSyncError(null))
      .catch((error) => {
        console.warn('Could not sync tax prep checklist.', error);
        setSyncError(error);
      });
  };

  const updateDocument = (documentId, updates) => {
    saveDocuments(documents.map((document) =>
      document.id === documentId ? { ...document, ...updates } : document
    ));
  };

  const toggleDocumentReady = (documentId) => {
    const document = documents.find((candidate) => candidate.id === documentId);
    if (document) updateDocument(documentId, { ready: !document.ready });
  };

  return {
    documents,
    loading,
    syncError,
    updateDocument,
    toggleDocumentReady,
    refresh: loadDocuments,
  };
};
