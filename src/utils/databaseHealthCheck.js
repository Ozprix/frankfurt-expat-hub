
import { supabaseClient } from '@/config/supabaseClient';

/**
 * Checks the health of the Supabase database connection
 * @returns {Promise<{isHealthy: boolean, errors: string[], timestamp: Date, details: object}>}
 */
export const checkDatabaseHealth = async () => {
  const errors = [];
  const details = {
    connection: 'unknown',
    tables: {},
    latency: 0
  };
  
  const start = Date.now();

  try {
    // 1. Test basic connectivity via a public table or a known table
    // We use public.users because auth.users is not exposed via PostgREST API
    // A 401/403/404 response actually means the DB IS reachable, just restricted.
    // A network error means it's unreachable.
    const { data: tableData, error: tableError } = await supabaseClient
      .from('users')
      .select('count', { count: 'exact', head: true })
      .limit(1);

    if (tableError) {
      // If code is strictly network related or 5xx, it's unhealthy.
      // Permission denied (PGRST301, 401, 403) means DB is UP.
      if (tableError.code && (tableError.code.startsWith('5') || tableError.message.includes('fetch'))) {
        errors.push(`Table access failed: ${tableError.message}`);
        details.connection = 'failed';
        details.tables.users = 'unreachable';
      } else {
        // Permissions error means connected but restricted - which is "Healthy" for infrastructure
        details.connection = 'connected';
        details.tables.users = 'restricted';
      }
    } else {
      details.connection = 'connected';
      details.tables.users = 'accessible';
    }

    // 2. Test RPC availability (optional, checks if PostgREST is handling functions)
    // We try a simple system function or just check if the endpoint responds
    try {
      const { error: rpcError } = await supabaseClient.rpc('get_health_check_dummy_function'); // Likely doesn't exist
      
      // If we get "function not found" (PGRST202), the DB is responsive!
      // If we get "fetch failed", it's down.
      if (rpcError && rpcError.message && (rpcError.message.includes('fetch') || rpcError.message.includes('Failed to fetch'))) {
         errors.push(`RPC check failed: ${rpcError.message}`);
      }
    } catch (e) {
      if (e.message.includes('fetch')) {
         errors.push('RPC Endpoint unreachable');
      }
    }

  } catch (err) {
    errors.push(`Unexpected connection error: ${err.message}`);
    details.connection = 'failed';
  }

  const end = Date.now();
  details.latency = end - start;

  const isHealthy = errors.length === 0;

  return {
    isHealthy,
    errors,
    timestamp: new Date(),
    details
  };
};
