'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import type { Database, UserRole, MembershipTier } from '@/types/database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: UserRole;
  membershipTier: MembershipTier;
  isLoading: boolean;
  isSupabaseLive: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function checkIsAdmin(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return (
    clean === 'fundiversamente@gmail.com' ||
    clean.includes('fundiversamente') ||
    clean.includes('admin')
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch profile from Supabase
  const fetchProfile = useCallback(async (userId: string, userEmail?: string): Promise<Profile> => {
    const isSpecialAdmin = checkIsAdmin(userEmail);
    const defaultRole: UserRole = isSpecialAdmin ? 'admin' : 'subscriber';

    const fallbackProfile: Profile = {
      id: userId,
      email: userEmail || '',
      full_name: userEmail ? (isSpecialAdmin ? 'Administrador Diversamente' : userEmail.split('@')[0]) : 'Usuario',
      avatar_url: null,
      role: defaultRole,
      membership_tier: isSpecialAdmin ? 'supporter' : 'free',
      phone: null,
      bio: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error && data) {
          return data as unknown as Profile;
        }

        // Si el perfil no existe en public.profiles, crearlo en Supabase
        try {
          const { data: created, error: upsertError } = await (supabase.from('profiles') as any)
            .upsert([fallbackProfile])
            .select()
            .single();

          if (!upsertError && created) {
            return created as unknown as Profile;
          }
        } catch (insertErr) {
          console.warn('[Profiles]: Error al insertar perfil:', insertErr);
        }
      } catch (err) {
        console.warn('Error al consultar profiles en Supabase:', err);
      }
    }

    return fallbackProfile;
  }, []);

  // Initial Auth listener
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      if (supabase && isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            setUser(session.user);
            const prof = await fetchProfile(session.user.id, session.user.email);
            if (isMounted) setProfile(prof);
          }
        } catch (e) {
          console.error('Session get error:', e);
        }
      }
      if (isMounted) setIsLoading(false);
    }

    initAuth();

    let authListener: any = null;
    if (supabase && isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const prof = await fetchProfile(session.user.id, session.user.email);
          setProfile(prof);
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      });
      authListener = data.subscription;
    }

    return () => {
      isMounted = false;
      if (authListener) authListener.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign In - Autenticación estricta con Supabase
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    if (!supabase || !isSupabaseConfigured) {
      setIsLoading(false);
      return { success: false, error: 'Supabase no está configurado en el servidor.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setIsLoading(false);
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          return { success: false, error: 'Correo o contraseña incorrectos. Verifica tus datos.' };
        }
        if (error.message.toLowerCase().includes('email not confirmed')) {
          return { success: false, error: 'Por favor confirma tu correo electrónico antes de ingresar.' };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        const prof = await fetchProfile(data.user.id, data.user.email);
        setProfile(prof);
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'No se pudo iniciar sesión.' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Error de conexión con Supabase.' };
    }
  };

  // Sign Up - Registro de nuevos usuarios en Supabase
  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const isSpecialAdmin = checkIsAdmin(cleanEmail);

    if (!supabase || !isSupabaseConfigured) {
      setIsLoading(false);
      return { success: false, error: 'Supabase no está configurado en el servidor.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: isSpecialAdmin ? 'admin' : 'subscriber',
          },
        },
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        const prof = await fetchProfile(data.user.id, data.user.email);
        setProfile(prof);
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Error al registrar la cuenta.' };
    }
  };

  // Sign Out
  const signOut = async () => {
    setIsLoading(true);
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('SignOut error:', e);
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('diversamente_mock_user');
      localStorage.removeItem('diversamente_admin_unlocked');
    }
    setUser(null);
    setProfile(null);
    setIsLoading(false);
  };

  // Update Profile
  const updateProfile = async (data: Partial<Profile>): Promise<{ success: boolean; error?: string }> => {
    if (!profile) return { success: false, error: 'No hay sesión activa' };

    const updated = {
      ...profile,
      ...data,
      updated_at: new Date().toISOString(),
    };

    if (supabase && isSupabaseConfigured) {
      try {
        await (supabase.from('profiles') as any)
          .update(data)
          .eq('id', profile.id);
      } catch (e: any) {
        console.warn('Error actualizando perfil en Supabase:', e);
      }
    }

    setProfile(updated);
    return { success: true };
  };

  const role: UserRole = profile?.role || 'visitor';
  const membershipTier: MembershipTier = profile?.membership_tier || 'free';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        membershipTier,
        isLoading,
        isSupabaseLive: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
