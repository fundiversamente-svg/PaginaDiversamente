'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Mail, KeyRound, User, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';

export default function RegistroPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      showToast('Por favor completa todos los campos requeridos', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await signUp(email, password, fullName);

    if (res.success) {
      showToast('¡Cuenta creada con éxito! Bienvenido a nuestra comunidad.', 'success');
      router.push('/suscriptores');
    } else {
      showToast(res.error || 'Error al crear la cuenta', 'error');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-surface rounded-3xl border border-border shadow-ambient-2 overflow-hidden">
        {/* Left: Benefits banner (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-low p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-label uppercase tracking-widest text-primary font-bold">
              Comunidad Diversamente
            </span>
            <h2 className="text-2xl sm:text-3xl font-headline font-semibold text-on-surface mt-1 mb-4">
              Únete a un espacio pensado para tu familia
            </h2>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed mb-6">
              Al registrarte como suscriptor gratuito obtienes acceso ilimitado al contenido exclusivo preparado por nuestros especialistas.
            </p>

            <ul className="space-y-3 text-xs font-body text-on-surface">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span>Webinars y grabaciones de talleres clínicos.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span>Kits sensoriales y pictogramas imprimibles en alta resolución.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span>Invitaciones prioritarias a círculos de encuentro quincenales.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span>Guías confidenciales de duelo parental y adaptación escolar.</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-border/60 text-[11px] text-on-surface-variant font-body">
            100% libre de costo. Respetamos tu privacidad y nunca compartiremos tus datos.
          </div>
        </div>

        {/* Right: Register Form (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-headline font-semibold text-on-surface mb-1">
              Crear Cuenta de Suscriptor
            </h1>
            <p className="text-xs font-body text-on-surface-variant">
              Completa el formulario para acceder al portal exclusivo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                Nombre Completo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre y apellido"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                Correo Electrónico *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.correo@ejemplo.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Contraseña *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label text-sm font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all shadow-sm"
              >
                <span>{isSubmitting ? 'Creando cuenta...' : 'Completar Registro'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs font-body text-on-surface-variant">
            ¿Ya tienes una cuenta registrada?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
