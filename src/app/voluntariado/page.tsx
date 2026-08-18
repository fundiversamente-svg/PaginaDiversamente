'use client';

import React from 'react';
import { HeartHandshake, Award, Users2, Sparkles, BookCheck } from 'lucide-react';
import VolunteerForm from '@/components/VolunteerForm';

export default function VoluntariadoPage() {
  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20 pt-8">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary bg-secondary-container px-3.5 py-1 rounded-full mb-3">
            Comunidad en Acción
          </span>
          <h1 className="text-4xl sm:text-5xl font-headline font-bold text-on-surface mb-4">
            Pon tus talentos al servicio de la <span className="text-primary italic">inclusión</span>
          </h1>
          <p className="text-base sm:text-lg font-body text-on-surface-variant leading-relaxed">
            Ser voluntario en Diversamente es una oportunidad para aprender, conectar con historias inspiradoras y ser un pilar de calma y apoyo para familias que lo necesitan.
          </p>
        </div>
      </section>

      {/* Why Volunteer Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-surface-container-low rounded-2xl border border-border shadow-ambient-1">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-secondary flex items-center justify-center mb-4">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-headline font-semibold text-on-surface mb-1">
              Impacto Tangible
            </h3>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              Cada hora que dedicas se traduce en alivio, sonrisas y espacios seguros para niños y cuidadores.
            </p>
          </div>

          <div className="p-6 bg-surface-container-low rounded-2xl border border-border shadow-ambient-1">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center mb-4">
              <BookCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-headline font-semibold text-on-surface mb-1">
              Capacitación Continua
            </h3>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              Accede a talleres formativos en neurodiversidad, integración sensorial y primeros auxilios psicológicos.
            </p>
          </div>

          <div className="p-6 bg-surface-container-low rounded-2xl border border-border shadow-ambient-1">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-4">
              <Users2 className="w-5 h-5 text-tertiary" />
            </div>
            <h3 className="text-lg font-headline font-semibold text-on-surface mb-1">
              Red Humana y Cálida
            </h3>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              Forma parte de un colectivo multidisciplinar donde priman la empatía, el respeto y la colaboración.
            </p>
          </div>

          <div className="p-6 bg-surface-container-low rounded-2xl border border-border shadow-ambient-1">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high text-primary flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-headline font-semibold text-on-surface mb-1">
              Certificación de Horas
            </h3>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              Certificamos formalmente tus horas de servicio social o voluntariado para universidades y hojas de vida.
            </p>
          </div>
        </div>
      </section>

      {/* Main Volunteer Application Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <VolunteerForm />
      </section>
    </div>
  );
}
