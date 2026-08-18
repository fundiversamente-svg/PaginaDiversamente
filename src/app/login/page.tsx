'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ArrowRight, ShieldCheck, Sparkles, UserCheck, KeyRound, X, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'subscriber' | 'admin'>('admin');

  // Password reset modal state
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const { signIn, user, role } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  useEffect(() => {
    if (user) {
      if (redirectPath) {
        router.push(redirectPath);
      } else if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/suscriptores');
      }
    }
  }, [user, role, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await signIn(email, password);

    if (res.success) {
      showToast('¡Bienvenido a Diversamente!', 'success');
      if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('fundiversamente') || role === 'admin') {
        router.push('/admin');
      } else {
        router.push(redirectPath || '/suscriptores');
      }
    } else {
      showToast(res.error || 'Credenciales incorrectas', 'error');
    }
    setIsSubmitting(false);
  };

  const handleQuickDemo = (demoType: 'admin' | 'subscriber') => {
    if (demoType === 'admin') {
      setEmail('fundiversamente@gmail.com');
      setPassword('admin123');
      setActiveTab('admin');
    } else {
      setEmail('familia@diversamente.org');
      setPassword('familia123');
      setActiveTab('subscriber');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      showToast('Por favor ingresa tu correo electrónico', 'error');
      return;
    }

    setResetLoading(true);
    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim().toLowerCase(), {
          redirectTo: `${window.location.origin}/login?reset=true`,
        });
        if (error) {
          showToast(error.message, 'error');
        } else {
          showToast('Enlace de restablecimiento enviado a tu correo.', 'success');
          setResetModalOpen(false);
        }
      } catch (err: any) {
        showToast('Error al enviar solicitud: ' + err.message, 'error');
      }
    } else {
      showToast(`Enlace de restablecimiento simulado enviado a ${resetEmail}`, 'success');
      setResetModalOpen(false);
    }
    setResetLoading(false);
  };

  return (
    <div className="max-w-md w-full bg-surface rounded-3xl p-8 sm:p-10 border border-border shadow-ambient-2">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          {activeTab === 'admin' ? <ShieldCheck className="w-7 h-7" /> : <Sparkles className="w-7 h-7" />}
        </div>
        <h1 className="text-2xl sm:text-3xl font-headline font-semibold text-on-surface">
          {activeTab === 'admin' ? 'Acceso de Administrador' : 'Portal de Suscriptores'}
        </h1>
        <p className="text-xs font-body text-on-surface-variant mt-1.5">
          {activeTab === 'admin'
            ? 'Panel para editar programas, recursos y gestionar la plataforma.'
            : 'Ingresa para disfrutar de webinars, kits sensoriales y guías exclusivas.'}
        </p>
      </div>

      {/* Role Tabs */}
      <div className="flex bg-surface-container-low p-1 rounded-xl border border-border mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('admin')}
          className={`flex-1 py-2 text-xs font-label font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'admin'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Administrador</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('subscriber')}
          className={`flex-1 py-2 text-xs font-label font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'subscriber'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Suscriptor / Familia</span>
        </button>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu.correo@ejemplo.com"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-label font-bold uppercase tracking-wider text-on-surface">
              Contraseña
            </label>
            <button
              type="button"
              onClick={() => {
                setResetEmail(email || '');
                setResetModalOpen(true);
              }}
              className="text-[11px] text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label text-sm font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all shadow-sm mt-2"
        >
          <span>{isSubmitting ? 'Iniciando sesión...' : 'Entrar a mi Cuenta'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Demo Fast Access Pill */}
      <div className="mt-6 pt-6 border-t border-border text-center">
        <p className="text-[11px] font-body text-on-surface-variant mb-2 font-medium">
          Acceso de Administrador Principal:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            className="text-[11px] px-3.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full border border-primary/30 font-label font-bold flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>fundiversamente@gmail.com</span>
          </button>
        </div>
      </div>

      {/* Register CTA */}
      <div className="mt-6 text-center text-xs font-body text-on-surface-variant">
        ¿Eres un nuevo usuario o quieres crear tu contraseña?{' '}
        <Link href="/registro" className="text-primary font-semibold hover:underline">
          Crear cuenta aquí
        </Link>
      </div>

      {/* Password Reset Modal */}
      {resetModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dim/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-border">
            <button
              onClick={() => setResetModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-semibold text-on-surface">
                Restablecer o Crear Contraseña
              </h3>
              <p className="text-xs font-body text-on-surface-variant mt-1">
                Ingresa tu correo y te enviaremos un enlace seguro para que definas tu contraseña.
              </p>
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Correo Registrado
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="fundiversamente@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-xs font-label font-semibold text-on-surface hover:bg-surface-container-low"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-on-primary py-2.5 rounded-xl text-xs font-label font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{resetLoading ? 'Enviando...' : 'Enviar Enlace'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="p-8 text-center text-xs font-body text-on-surface-variant">Cargando formulario...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
