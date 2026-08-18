import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Cliente singleton para el navegador
export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Función auxiliar segura para registrar datos con fallback a consola/localStorage
 * si Supabase aún no tiene llaves válidas en .env.local
 */
export async function safeInsert<T extends keyof Database['public']['Tables']>(
  table: T,
  record: Database['public']['Tables'][T]['Insert']
): Promise<{ success: boolean; data?: any; error?: string; isMock?: boolean }> {
  if (supabase) {
    try {
      const { data, error } = await (supabase.from(table) as any).insert([record]).select().single();
      if (error) {
        console.error(`[Supabase Error en ${table}]:`, error);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err: any) {
      console.error(`[Supabase Exception en ${table}]:`, err);
      return { success: false, error: err.message || 'Error desconocido de conexión' };
    }
  }

  // Fallback seguro cuando no está configurado Supabase
  console.info(`[Modo Simulación] Registro en ${table}:`, record);
  try {
    if (typeof window !== 'undefined') {
      const localKey = `diversamente_local_${table}`;
      const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
      const newEntry = {
        ...record,
        id: crypto.randomUUID ? crypto.randomUUID() : `mock-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      existing.unshift(newEntry);
      localStorage.setItem(localKey, JSON.stringify(existing));
    }
  } catch {
    // Ignorar si localStorage falla
  }

  return {
    success: true,
    isMock: true,
    data: { id: `mock-${Date.now()}`, ...record, created_at: new Date().toISOString() },
  };
}
