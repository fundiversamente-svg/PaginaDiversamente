import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
  (supabaseServiceRoleKey || supabaseAnonKey) &&
  !supabaseUrl.includes('your-project')
);

// Cliente de servidor para Next.js Route Handlers
export function createServerClient() {
  if (!isServerSupabaseConfigured) {
    return null;
  }
  // Usar service role key si está disponible para operaciones administrativas, o anon key
  const key = supabaseServiceRoleKey || supabaseAnonKey;
  return createClient<Database>(supabaseUrl, key, {
    auth: {
      persistSession: false,
    },
  });
}
