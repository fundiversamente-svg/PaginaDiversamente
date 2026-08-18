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
 * Función auxiliar segura y ultra-resiliente para registrar datos.
 * Si Supabase está conectado pero aún no se han creado las tablas o políticas RLS en el SQL Editor,
 * guarda de respaldo localmente sin romper la experiencia del usuario.
 */
export async function safeInsert<T extends keyof Database['public']['Tables']>(
  table: T,
  record: Database['public']['Tables'][T]['Insert']
): Promise<{ success: boolean; data?: any; error?: string; isMock?: boolean; warning?: string }> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await (supabase.from(table) as any).insert([record]).select().single();
      
      if (!error) {
        return { success: true, data };
      }

      console.warn(`[Supabase Aviso en ${table}]:`, error.message);
      
      // Si la tabla no existe (42P01) o falta política RLS (42501), guardar en respaldo local
      if (error.code === '42P01' || error.code === '42501' || error.message?.includes('relation') || error.message?.includes('policy')) {
        console.info(`[Fallback Local Activado para ${table}] debido a que falta ejecutar el script SQL en Supabase.`);
        const localSaved = saveToLocal(table, record);
        return {
          success: true,
          isMock: true,
          data: localSaved,
          warning: 'Registro guardado localmente. Recuerda ejecutar supabase/schema.sql en tu panel de Supabase.',
        };
      }

      return { success: false, error: error.message };
    } catch (err: any) {
      console.error(`[Supabase Exception en ${table}]:`, err);
      const localSaved = saveToLocal(table, record);
      return { success: true, isMock: true, data: localSaved };
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
