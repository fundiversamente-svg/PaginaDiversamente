'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Heart, Send, Lock } from 'lucide-react';
import { useToast } from './Toast';
import { safeInsert } from '@/lib/supabaseClient';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Por favor ingresa un correo electrónico válido', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await safeInsert('newsletter_subscribers', {
        email: email.trim().toLowerCase(),
        is_active: true,
      });

      if (res.success) {
        showToast('¡Gracias por unirte a nuestro boletín comunitario!', 'success');
        setEmail('');
      } else {
        showToast('Ya estás registrado o hubo un error temporal', 'info');
      }
    } catch {
      showToast('Error al suscribir. Inténtalo de nuevo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full bg-surface-container-low dark:bg-surface-container-lowest border-t border-border/40 transition-colors duration-300">
      {/* Top newsletter banner */}
      <div className="border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-surface rounded-2xl p-8 sm:p-10 border border-border shadow-ambient-1 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary bg-secondary-container px-3 py-1 rounded-full mb-3">
                Boletín Comunitario
              </span>
              <h3 className="text-2xl font-headline font-semibold text-primary mb-2">
                Recibe guías, eventos y artículos sobre neurodiversidad
              </h3>
              <p className="text-sm font-body text-on-surface-variant">
                Enviamos contenido reflexivo y herramientas prácticas. Cero spam, solo valor para tu familia.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-shrink-0 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.com"
                required
                className="w-full sm:w-72 px-4 py-3 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all shadow-sm"
              >
                <span>{loading ? 'Enviando...' : 'Suscribirme'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="text-2xl font-headline font-semibold text-primary tracking-tight">
              Diversamente
            </Link>
            <p className="text-sm font-body text-on-surface-variant max-w-sm leading-relaxed">
              Alianza de Inclusión Familiar. Brindando espacios de contención y herramientas prácticas para amar, aceptar y avanzar juntos en la neurodiversidad.
            </p>
            <div className="flex flex-col gap-2.5 text-sm text-on-surface-variant mt-2 font-body">
              <a
                href="mailto:fundiversamente@gmail.com"
                className="flex items-center gap-2.5 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>fundiversamente@gmail.com</span>
              </a>
              <a
                href="tel:+573185713991"
                className="flex items-center gap-2.5 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+57 315 048 84 57</span>
              </a>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Bogotá, Colombia</span>
              </div>
            </div>
          </div>

          {/* Column: Navegación */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-label font-bold uppercase tracking-wider text-primary">
              Institucional
            </h4>
            <ul className="space-y-2 text-sm text-on-surface-variant font-body">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-primary transition-colors">Sobre Nosotros</Link>
              </li>
              <li>
                <Link href="/nosotros#equipo" className="hover:text-primary transition-colors">Nuestro Equipo</Link>
              </li>
              <li>
                <Link href="/voluntariado" className="hover:text-primary transition-colors">Sé Voluntario</Link>
              </li>
              <li>
                <Link href="/donar" className="hover:text-primary transition-colors font-medium text-primary">Donar al Proyecto</Link>
              </li>
            </ul>
          </div>

          {/* Column: Programas */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-label font-bold uppercase tracking-wider text-primary">
              Programas
            </h4>
            <ul className="space-y-2 text-sm text-on-surface-variant font-body">
              <li>
                <Link href="/programas#redes-de-apoyo" className="hover:text-primary transition-colors">Redes de Apoyo Familiar</Link>
              </li>
              <li>
                <Link href="/programas#terapia-individual" className="hover:text-primary transition-colors">Terapia Individual</Link>
              </li>
              <li>
                <Link href="/programas#talleres-educativos" className="hover:text-primary transition-colors">Talleres para Docentes</Link>
              </li>
              <li>
                <Link href="/programas#coaching-familiar" className="hover:text-primary transition-colors">Coaching Familiar</Link>
              </li>
              <li>
                <Link href="/programas#grupos-comunitarios" className="hover:text-primary transition-colors">Grupos de Encuentro</Link>
              </li>
            </ul>
          </div>

          {/* Column: Recursos & Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-label font-bold uppercase tracking-wider text-primary">
              Recursos & Ayuda
            </h4>
            <ul className="space-y-2 text-sm text-on-surface-variant font-body">
              <li>
                <Link href="/recursos" className="hover:text-primary transition-colors">Guías Descargables</Link>
              </li>
              <li>
                <Link href="/recursos#directorio" className="hover:text-primary transition-colors">Directorio de Especialistas</Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-primary transition-colors">Canales de Contacto</Link>
              </li>
              <li>
                <Link href="/admin" className="inline-flex items-center gap-1 text-xs opacity-70 hover:opacity-100 hover:text-primary transition-opacity">
                  <Lock className="w-3 h-3" />
                  <span>Portal Administrativo</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant/70 font-body">
          <p>
            © {new Date().getFullYear()} Diversamente - Alianza de Inclusión Familiar. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-primary fill-current" />
            <span>para una comunidad neuroinclusiva</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
