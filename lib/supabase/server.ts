// lib/supabase/server.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseServerInstance: SupabaseClient | null = null;

function initSupabaseServer(): SupabaseClient {
  if (supabaseServerInstance) {
    return supabaseServerInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    // Return a dummy client for build time
    if (process.env.NODE_ENV === 'production' && !supabaseUrl) {
      return createClient('https://placeholder.supabase.co', 'placeholder_key', {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
    throw new Error('Missing Supabase credentials');
  }

  supabaseServerInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseServerInstance;
}

// Lazy export - don't initialize on import
export const supabaseServer = new Proxy({} as any, {
  get: (_target, prop) => {
    const instance = initSupabaseServer();
    return (instance as any)[prop];
  },
});
