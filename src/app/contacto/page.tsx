'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, MessageSquare, Heart, Instagram, Sparkles, ExternalLink } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export default function ContactoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 pb-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1 rounded-full mb-3">
          Estamos para Acompañarte
        </span>
        <h1 className="text-4xl sm:text-5xl font-headline font-bold text-on-surface mb-3">
          Contacto y Orientación
        </h1>
        <p className="text-base sm:text-lg font-body text-on-surface-variant leading-relaxed">
          Tanto si tienes dudas sobre nuestros programas, necesitas orientación inicial o deseas colaborar con la fundación, estamos listos para escucharte.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Form (8 cols) */}
        <div className="lg:col-span-8">
          <ContactForm />
        </div>

        {/* Right: Direct Info & Quick Support (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Direct Info Card */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-ambient-1">
            <h3 className="text-xl font-headline font-semibold text-primary mb-4">
              Contacto Directo
            </h3>
            
            <ul className="space-y-4 text-sm font-body text-on-surface">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-label font-bold text-xs uppercase text-on-surface-variant">Correo Electrónico</div>
                  <a href="mailto:fundiversamente@gmail.com" className="hover:text-primary transition-colors">
                    fundiversamente@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-label font-bold text-xs uppercase text-on-surface-variant">Instagram Oficial</div>
                  <a
                    href="https://www.instagram.com/somos_diversamente?utm_source=qr&igsi=MWY0YmN6cnI5ODRhZw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-bold hover:underline flex items-center gap-1"
                  >
                    <span>@somos_diversamente</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-label font-bold text-xs uppercase text-on-surface-variant">Teléfono / WhatsApp</div>
                  <a href="tel:+573185713991" className="hover:text-primary transition-colors">
                    +57 315 048 84 57
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-label font-bold text-xs uppercase text-on-surface-variant">Sede Principal</div>
                  <span>Bogotá, Colombia</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-label font-bold text-xs uppercase text-on-surface-variant">Horario de Atención</div>
                  <span>Lunes a Viernes: 8:00 AM - 6:00 PM</span>
                  <br />
                  <span>Sábados: 9:00 AM - 1:00 PM</span>
                </div>
              </li>
            </ul>

            {/* Direct WhatsApp CTA */}
            <div className="mt-6 pt-6 border-t border-border flex flex-col gap-2.5">
              <a
                href="https://wa.me/573150488457?text=Hola,%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20los%20programas%20de%20Diversamente"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-label text-sm font-semibold py-3 rounded-xl shadow-sm transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Escribir por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Dedicated Instagram Community Card */}
          <div className="bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-amber-500/10 rounded-2xl p-6 sm:p-7 border border-pink-500/30 shadow-ambient-1 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-headline font-bold text-on-surface">Comunidad en Instagram</h4>
                <p className="text-xs text-primary font-bold">@somos_diversamente</p>
              </div>
            </div>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed mb-4">
              Sigue nuestras cápsulas psicoeducativas, historias diarias, consejos prácticos para padres y anuncios de talleres gratuitos.
            </p>
            <a
              href="https://www.instagram.com/somos_diversamente?utm_source=qr&igsi=MWY0YmN6cnI5ODRhZw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-label text-xs font-semibold py-2.5 rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Instagram className="w-4 h-4" />
              <span>Seguir en Instagram</span>
            </a>
          </div>

          {/* Donate Promo Card */}
          <div className="bg-primary-container text-on-primary-container rounded-2xl p-6 sm:p-8 shadow-ambient-1 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <h4 className="text-xl font-headline font-semibold mb-2">
                Apoya Nuestra Misión
              </h4>
              <p className="text-xs font-body text-on-primary-container/90 leading-relaxed mb-4">
                Tus donaciones permiten que familias de bajos recursos accedan a terapias y redes de apoyo sin costo.
              </p>
            </div>

            <Link
              href="/donar"
              className="w-full inline-flex items-center justify-center gap-1.5 bg-surface text-primary font-label text-xs font-semibold py-2.5 rounded-lg shadow-sm hover:bg-surface-bright active:scale-95 transition-all"
            >
              <span>Hacer una Donación</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
