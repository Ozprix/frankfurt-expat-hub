import { createClient } from '@supabase/supabase-js';

const fallbackSupabaseUrl = 'https://gvxnqqyaegfamcnjloqp.supabase.co';
const fallbackSupabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2eG5xcXlhZWdmYW1jbmpsb3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MTg0NDYsImV4cCI6MjA4NjI5NDQ0Nn0.HX4LD-EU91Iz5Xi7N1yRm5OQcpXBbVPMyYbwZwo42Hk';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || fallbackSupabaseUrl;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || fallbackSupabaseAnonKey;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables. Supabase features are disabled until configured.');
}

// Create a single supabase client for interacting with your database
export const supabaseClient = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Helper for error logging
export const logSupabaseError = (error, context = 'Supabase Action') => {
  if (error) {
    console.error(`[${context}] Error:`, error.message || error);
  }
};
