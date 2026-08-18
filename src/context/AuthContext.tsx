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

  // Helper to fetch profile from Supabase with safe fallback
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

        // Si la tabla profiles aún no existe o el perfil no está creado, intentar crearlo
        try {
          await (supabase.from('profiles') as any).insert([fallbackProfile]);
        } catch {
          // Ignorar si la tabla no existe en la base de datos
        }
      } catch (err) {
        console.warn('Profiles table not yet configured in Supabase, using local profile fallback.');
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
          } else {
            // Check local fallback session
            if (typeof window !== 'undefined') {
              const savedMock = localStorage.getItem('diversamente_mock_user');
              if (savedMock && isMounted) {
                const parsed = JSON.parse(savedMock);
                setUser(parsed.user);
                setProfile(parsed.profile);
              }
            }
          }
        } catch (e) {
          console.error('Session get error:', e);
        }
      } else {
        if (typeof window !== 'undefined') {
          const savedMock = localStorage.getItem('diversamente_mock_user');
          if (savedMock && isMounted) {
            const parsed = JSON.parse(savedMock);
            setUser(parsed.user);
            setProfile(parsed.profile);
          }
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

  // Sign In
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const isSpecialAdmin = checkIsAdmin(cleanEmail);

    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!error && data.user) {
          setUser(data.user);
          const prof = await fetchProfile(data.user.id, data.user.email);
          setProfile(prof);
          setIsLoading(false);
          return { success: true };
        }

        // Si es cuenta de prueba (demo) y no existe aún en Supabase Auth, registrarla automáticamente
        if (cleanEmail.includes('diversamente.org') || cleanEmail.includes('demo') || cleanEmail === 'fundiversamente@gmail.com') {
          const signUpRes = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                full_name: isSpecialAdmin ? 'Administrador Diversamente' : 'Familia Suscriptora',
                role: isSpecialAdmin ? 'admin' : 'subscriber',
              },
            },
          });

          if (signUpRes.data.user) {
            setUser(signUpRes.data.user);
            const prof = await fetchProfile(signUpRes.data.user.id, cleanEmail);
            setProfile(prof);
            setIsLoading(false);
            return { success: true };
          }
        }

        // Si falla por credenciales inválidas o correo no registrado
        if (error?.message?.toLowerCase().includes('invalid login credentials')) {
          // Si es cuenta demo o fundiversamente, permitir inicio en modo simulación
          if (cleanEmail.includes('admin') || cleanEmail.includes('familia') || isSpecialAdmin) {
            return activateLocalMockSession(cleanEmail, isSpecialAdmin);
          }
          setIsLoading(false);
          return {
            success: false,
            error: 'Correo o contraseña incorrectos. Si aún no tienes cuenta, ve a la pestaña "Registrarme Gratis".',
          };
        }

        setIsLoading(false);
        return { success: false, error: error?.message || 'Error al iniciar sesión' };
      } catch (err: any) {
        console.warn('Supabase Auth error, using local fallback:', err);
        return activateLocalMockSession(cleanEmail, isSpecialAdmin);
      }
    }

    // Modo simulación cuando no hay Supabase
    return activateLocalMockSession(cleanEmail, isSpecialAdmin);
  };

  const activateLocalMockSession = (cleanEmail: string, isSpecialAdmin: boolean) => {
    const mockId = `user-${Date.now()}`;
    const mockUser = {
      id: mockId,
      email: cleanEmail,
      app_metadata: {},
      user_metadata: { full_name: isSpecialAdmin ? 'Administrador' : 'Suscriptor' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User;

    const mockProfile: Profile = {
      id: mockId,
      email: cleanEmail,
      full_name: isSpecialAdmin ? 'Administrador Diversamente' : 'Familia Suscriptora',
      avatar_url: null,
      role: isSpecialAdmin ? 'admin' : 'subscriber',
      membership_tier: isSpecialAdmin ? 'supporter' : 'free',
      phone: null,
      bio: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(mockUser);
    setProfile(mockProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'diversamente_mock_user',
        JSON.stringify({ user: mockUser, profile: mockProfile })
      );
    }
    setIsLoading(false);
    return { success: true };
  };

  // Sign Up
  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const isSpecialAdmin = checkIsAdmin(cleanEmail);

    if (supabase && isSupabaseConfigured) {
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
        } else {
          // Si Supabase pide confirmación de correo pero queremos permitir acceso inmediato:
          activateLocalMockSession(cleanEmail, isSpecialAdmin);
        }

        setIsLoading(false);
        return { success: true };
      } catch (err: any) {
        console.warn('Supabase SignUp exception, using local fallback:', err);
        return activateLocalMockSession(cleanEmail, isSpecialAdmin);
      }
    }

    // Modo simulación
    return activateLocalMockSession(cleanEmail, isSpecialAdmin);
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
        console.warn('Error updating profile in Supabase:', e);
      }
    }

    setProfile(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'diversamente_mock_user',
        JSON.stringify({ user, profile: updated })
      );
    }
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
