'use client';

import React from 'react';
import { Heart, ShieldCheck, Sparkles, HelpCircle, FileCheck2 } from 'lucide-react';
import DonationModule from '@/components/DonationModule';

export default function DonarPage() {
  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20 pt-8">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1 rounded-full mb-3">
            Solidaridad & Impacto
          </span>
          <h1 className="text-4xl sm:text-5xl font-headline font-bold text-on-surface mb-4">
            Tu apoyo transforma la incertidumbre en <span className="text-primary italic">esperanza</span>
          </h1>
          <p className="text-base sm:text-lg font-body text-on-surface-variant leading-relaxed">
            Cada aporte permite que más familias accedan a diagnósticos tempranos, acompañamiento psicológico y redes comunitarias libres de estigma.
          </p>
        </div>
      </section>

      {/* Main Donation Module */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <DonationModule />
      </section>

      {/* Transparency & Fund Allocation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-surface-container-low rounded-3xl p-8 sm:p-12 border border-border shadow-ambient-1">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-xs font-label uppercase tracking-widest text-primary font-bold">
              Transparencia y Confianza
            </span>
            <h2 className="text-3xl font-headline font-semibold text-on-surface mt-1">
              ¿Cómo se utilizan tus donaciones?
            </h2>
            <p className="text-sm font-body text-on-surface-variant mt-2">
              Nos comprometemos con la máxima transparencia y auditoría en cada peso recibido.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-surface rounded-2xl border border-border flex flex-col justify-between">
              <div>
                <div className="text-3xl font-headline font-bold text-primary mb-2">70%</div>
                <h3 className="text-lg font-headline font-semibold text-on-surface mb-1">
                  Atención Directa y Becas
                </h3>
                <p className="text-xs font-body text-on-surface-variant leading-relaxed">
                  Financiamiento de terapias individuales, cupos en redes de apoyo para familias vulnerables y contención psicológica especializada.
                </p>
              </div>
            </div>

            <div className="p-6 bg-surface rounded-2xl border border-border flex flex-col justify-between">
              <div>
                <div className="text-3xl font-headline font-bold text-secondary mb-2">20%</div>
                <h3 className="text-lg font-headline font-semibold text-on-surface mb-1">
                  Materiales y Talleres
                </h3>
                <p className="text-xs font-body text-on-surface-variant leading-relaxed">
                  Adquisición de kits sensoriales, herramientas de comunicación aumentativa y jornadas de capacitación docente en escuelas públicas.
                </p>
              </div>
            </div>

            <div className="p-6 bg-surface rounded-2xl border border-border flex flex-col justify-between">
              <div>
                <div className="text-3xl font-headline font-bold text-tertiary mb-2">10%</div>
                <h3 className="text-lg font-headline font-semibold text-on-surface mb-1">
                  Sostenibilidad Operativa
                </h3>
                <p className="text-xs font-body text-on-surface-variant leading-relaxed">
                  Infraestructura digital, coordinación logística de voluntarios y cumplimiento legal/fiscal transparente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ on Donations */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-headline font-semibold text-on-surface">
            Preguntas Frecuentes sobre Donaciones
          </h3>
        </div>

        <div className="space-y-4">
          <div className="p-6 bg-surface rounded-2xl border border-border">
            <h4 className="text-base font-headline font-semibold text-primary mb-1">
              ¿Emiten certificados de donación para efectos tributarios?
            </h4>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              Sí. Una vez realizada tu donación mediante transferencia bancaria, escríbenos a <strong>fundiversamente@gmail.com</strong> con tu comprobante y RUT/Cédula, y te expediremos tu Certificado de Donación formal.
            </p>
          </div>

          <div className="p-6 bg-surface rounded-2xl border border-border">
            <h4 className="text-base font-headline font-semibold text-primary mb-1">
              ¿Puedo donar en especie o materiales didácticos?
            </h4>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              ¡Claro que sí! Recibimos juguetes sensoriales, mobiliario ergonómico infantil, libros sobre neurodiversidad y material de arte. Por favor contáctanos por WhatsApp para coordinar la entrega.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
