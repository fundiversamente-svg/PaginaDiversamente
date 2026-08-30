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
 * Función auxiliar para registrar datos directamente en Supabase.
 * IMPORTANTE: No ejecuta .select() al insertar para permitir que usuarios anónimos
 * guarden registros en tablas con RLS donde solo tienen permiso de INSERT.
 */
export async function safeInsert<T extends keyof Database['public']['Tables']>(
  table: T,
  record: Database['public']['Tables'][T]['Insert']
): Promise<{ success: boolean; data?: any; error?: string; isMock?: boolean; warning?: string }> {
  if (supabase && isSupabaseConfigured) {
    try {
      // Inserción directa limpia sin .select() para evitar conflictos de RLS SELECT con roles anon
      const { data, error } = await (supabase.from(table) as any).insert([record]);
      
      if (!error) {
        return { success: true, data: data || record };
      }

      console.error(`[Supabase Error en tabla ${table}]:`, error.message, error);
      return { success: false, error: error.message };
    } catch (err: any) {
      console.error(`[Supabase Excepción en tabla ${table}]:`, err);
      return { success: false, error: err.message || 'Error al conectar con la base de datos' };
    }
  }

  // Fallback seguro cuando no está configurado Supabase
  const localSaved = saveToLocal(table, record);
  return {
    success: true,
    isMock: true,
    data: localSaved,
  };
}

function saveToLocal(table: string, record: any) {
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
      return newEntry;
    }
  } catch {
    // Ignorar si falla localStorage
  }
  return { id: `mock-${Date.now()}`, ...record, created_at: new Date().toISOString() };
}
