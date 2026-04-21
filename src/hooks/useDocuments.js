import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabaseClient } from '@/config/supabaseClient';

const defaultDocuments = [
  {
    id: 'passport',
    name: 'Passport',
    description: 'Valid passport or national ID card',
    ready: false,
    notes: '',
  },
  {
    id: 'rental-contract',
    name: 'Rental Contract',
    description: 'Signed rental agreement (Mietvertrag)',
    ready: false,
    notes: '',
  },
  {
    id: 'wohnungsgeber',
    name: 'Wohnungsgeberbestätigung',
    description: 'Landlord confirmation for Anmeldung',
    ready: false,
    notes: '',
  },
  {
    id: 'employment-contract',
    name: 'Employment Contract',
    description: 'Signed work contract or job offer letter',
    ready: false,
    notes: '',
  },
  {
    id: 'insurance-policy',
    name: 'Health Insurance Policy',
    description: 'Proof of health insurance coverage',
    ready: false,
    notes: '',
  },
];

const documentsLocalKey = (userId) => `documents_${userId}`;

const readLocalDocuments = (userId) => {
  try {
    const stored = window.localStorage.getItem(documentsLocalKey(userId));
    return stored ? JSON.parse(stored) : defaultDocuments;
  } catch {
    return defaultDocuments;
  }
};

const mergeDocuments = (rows = []) =>
  defaultDocuments.map((document) => {
    const match = rows.find((row) => row.document_id === document.id);
    return match
      ? {
          ...document,
          name: match.name || document.name,
          description: match.description || document.description,
          ready: Boolean(match.ready),
          notes: match.notes || '',
        }
      : document;
  });

export const useDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState(defaultDocuments);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(null);
  const userId = user?.id;

  const persistDocuments = useCallback(async (updatedDocuments) => {
    if (!userId) return;

    window.localStorage.setItem(documentsLocalKey(userId), JSON.stringify(updatedDocuments));

    const rows = updatedDocuments.map((document) => ({
      user_id: userId,
      document_id: document.id,
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
        .eq('user_id', userId);

      if (error) throw error;

      if (data && data.length > 0) {
        const merged = mergeDocuments(data);
        setDocuments(merged);
        window.localStorage.setItem(documentsLocalKey(userId), JSON.stringify(merged));
      } else if (localDocuments.some((document) => document.ready || document.notes)) {
        await persistDocuments(localDocuments);
      }
    } catch (error) {
      console.warn('Document checklist sync failed; using local fallback.', error);
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

    window.localStorage.setItem(documentsLocalKey(userId), JSON.stringify(updatedDocuments));
    persistDocuments(updatedDocuments)
      .then(() => setSyncError(null))
      .catch((error) => {
        console.warn('Could not sync document checklist.', error);
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

  const getReadyCount = () => documents.filter((document) => document.ready).length;

  return {
    documents,
    loading,
    syncError,
    updateDocument,
    toggleDocumentReady,
    getReadyCount,
    refresh: loadDocuments,
  };
};
