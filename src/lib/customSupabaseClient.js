import { supabaseClient } from '@/config/supabaseClient';

const customSupabaseClient = supabaseClient;

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
