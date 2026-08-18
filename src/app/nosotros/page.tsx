'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Brain, Users, Shield, Heart, ArrowRight } from 'lucide-react';
import { TEAM_MEMBERS } from '@/lib/mockData';

export default function SobreNosotrosPage() {
  return (
    <div className="flex flex-col gap-20 sm:gap-28 pb-20">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1 rounded-full w-fit">
              Nuestra Esencia
            </span>
            <h1 className="text-4xl sm:text-5xl font-headline font-bold text-on-surface leading-[1.15] text-balance">
              Amar, aceptar y avanzar <span className="text-primary italic">juntos.</span>
            </h1>
            <p className="text-base sm:text-lg font-body text-on-surface-variant leading-relaxed">
              En Diversamente, creemos que el verdadero crecimiento ocurre cuando creamos espacios de profunda aceptación. Nuestro viaje está dedicado a apoyar a familias e individuos a través del crecimiento nutrido, la comprensión y la resiliencia compartida.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/voluntariado"
                className="inline-flex items-center gap-2 bg-primary text-on-primary font-label text-sm font-semibold px-6 py-3.5 rounded-xl shadow-ambient-1 hover:opacity-90 active:scale-95 transition-all"
              >
                <span>Únete a Nuestro Equipo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border shadow-ambient-2 bg-surface-container-low">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNkiVivC-BJEDIS5_LebPoMUechKRKR-VdLpBhvMMdIxblT7FySy7zG1Bohmmjs-23jnIgzdVC_JonaRl9ukLVfJya_Qm2FUnX2esA-KbgktEmWubOt6XmTGf5CZ5u6yuNyN4tJVH0zuwLRkp9GLisu-u6JN0e3qtKR1lFlRjbWaquPikTbNceYWttGr1WXrAOARjXShLCLUHq2bZJsVUWYCkk7V5CSiPzpr9ktpYMkU5RCNWiY8mxKg"
                alt="Familia en Diversamente"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. NUESTRA HISTORIA (Bento Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-label uppercase tracking-widest text-primary font-bold">
            Origen y Trayectoria
          </span>
          <h2 className="text-3xl sm:text-4xl font-headline font-semibold text-on-surface mt-1">
            Nuestra Historia
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large text card */}
          <div className="md:col-span-2 bg-surface-container-low rounded-3xl p-8 sm:p-10 border border-border shadow-ambient-1 flex flex-col justify-center">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nacimiento</span>
            </span>
            <h3 className="text-2xl font-headline font-semibold text-primary mb-4">
              Una Semilla Plantada en Compasión
            </h3>
            <p className="text-sm sm:text-base font-body text-on-surface-variant leading-relaxed">
              Diversamente comenzó con una simple pero profunda comprensión: navegar por la neurodiversidad y caminos de vida únicos requiere más que solo apoyo clínico; demanda una comunidad arraigada en una aceptación profunda e inquebrantable. Fundada por un colectivo de padres y profesionales que experimentaron el profundo aislamiento que puede acompañar estos viajes, nuestra organización fue construida para ser el santuario que una vez buscaron. Enfatizamos la calidez táctil y la seguridad emocional, asegurando que cada interacción se sienta intencional y amable.
            </p>
          </div>

          {/* Plant seedling image card */}
          <div className="relative aspect-square md:aspect-auto rounded-3xl overflow-hidden border border-border shadow-ambient-1 bg-surface-container">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUdC3OPaLg_8XvkdMGSBWFOphB8nqaTq6FNB_WXA9oQX3jlWpIMpVm4Exf_x0mBNCX7MvCmXepBVoNkD6HMm7d7zGsiK5JIHNw2-wJNMZ3Wt7akpVH2eZOdRc-pQbcmIKqLlnesyuBYbKZ61E3XtJ9zpNU2F2w6ddLTsRzyjtdl0mV2cZLofBL0_wRSmhSUXYxLKmKsTuIpYpUWlDfI99yZDflmU1z14obOibTd-uqtcPJKsMas8NBfw"
              alt="Planta brotando en tierra fértil - Crecimiento Nutrido"
              fill
              className="object-cover"
            />
          </div>

          {/* Value 1: Claridad */}
          <div className="bg-secondary-container text-on-secondary-container rounded-3xl p-8 flex flex-col justify-between shadow-ambient-1">
            <Brain className="w-10 h-10 text-secondary mb-6" />
            <div>
              <h4 className="text-2xl font-headline font-semibold mb-2">Claridad</h4>
              <p className="text-sm font-body text-on-secondary-container/90 leading-relaxed">
                Proporcionando caminos claros y comprensión desmitificada a través de desafíos complejos de desarrollo.
              </p>
            </div>
          </div>

          {/* Value 2: Pertenencia */}
          <div className="bg-tertiary-container text-on-tertiary-container rounded-3xl p-8 flex flex-col justify-between shadow-ambient-1">
            <Users className="w-10 h-10 text-tertiary mb-6" />
            <div>
              <h4 className="text-2xl font-headline font-semibold mb-2">Pertenencia</h4>
              <p className="text-sm font-body text-on-tertiary-container/90 leading-relaxed">
                Fomentando espacios seguros donde todas las personas son intrínsecamente valoradas tal como son.
              </p>
            </div>
          </div>

          {/* Value 3: Apoyo */}
          <div className="bg-primary-container text-on-primary-container rounded-3xl p-8 flex flex-col justify-between shadow-ambient-1">
            <Shield className="w-10 h-10 text-on-primary-container mb-6" />
            <div>
              <h4 className="text-2xl font-headline font-semibold mb-2">Apoyo</h4>
              <p className="text-sm font-body text-on-primary-container/90 leading-relaxed">
                Empoderando a las familias con orientación tangible, acompañamiento constante y calidez humana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FILOSOFÍA DEL CRECIMIENTO NUTRIDO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-surface-container-low rounded-3xl p-8 sm:p-14 border border-border shadow-ambient-1 text-center flex flex-col items-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-surface border border-border shadow-ambient-1 p-3 flex items-center justify-center mb-6">
            <div className="relative w-full h-full">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIN9Xm_IrpRNizzY9AwYi34cFfWRRVeUMGOeJZgfIikLeb216rEs1dSTz4dSMfb6pwvoVjbHN6gFG0j_oizU7Ll_xbOFzqoosBhCXLk7xdVOQl5VtMyjkrHv0vc8n3pb3NeQhDGaTZA3l3vDG_lgW-yKZHjF1leNSk6W1cohsQbf9YChg3MVWJ_UVGyRkj25bu-BOy567DaRg78i70gB4ncKYL_UgS2MSJV2xS-aijMKQXK6QUoXYClOFKKJ0r6sKYxjg"
                alt="Aceptación Logo Diversamente"
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-4">
            La Filosofía del Crecimiento Nutrido
          </h2>
          <p className="text-base sm:text-lg font-body text-on-surface-variant max-w-3xl leading-relaxed">
            Rechazamos los bordes afilados y las transiciones agresivas en la vida y en nuestro apoyo. Nuestro enfoque centrado en lo humano significa que escuchamos antes de guiar, y aceptamos antes de actuar. El progreso no es lineal; es un despliegue orgánico que requiere un espacio seguro e iluminado por la empatía para florecer.
          </p>
        </div>
      </section>

      {/* 4. CONOCE A NUESTROS GUÍAS (EQUIPO) */}
      <section id="equipo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-label uppercase tracking-widest text-primary font-bold">
            Equipo Profesional
          </span>
          <h2 className="text-3xl sm:text-4xl font-headline font-semibold text-on-surface mt-1">
            Conoce a Nuestros Guías
          </h2>
          <p className="text-sm font-body text-on-surface-variant mt-2">
            Profesionales comprometidos que combinan rigor científico, experiencia clínica y calidez humana incondicional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member, i) => (
            <div
              key={i}
              className="bg-surface rounded-3xl p-8 border border-border shadow-ambient-1 hover:shadow-ambient-2 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="relative w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-surface shadow-ambient-1 group-hover:scale-105 transition-transform duration-500">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="text-2xl font-headline font-semibold text-on-surface group-hover:text-primary transition-colors mb-1">
                {member.name}
              </h3>

              <div className="text-xs font-label uppercase tracking-wider text-secondary font-bold mb-2">
                {member.role}
              </div>

              <div className="text-xs font-body text-on-surface-variant/80 italic mb-4">
                {member.credentials}
              </div>

              <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-6 flex-grow">
                {member.bio}
              </p>

              {/* Specialties tags */}
              <div className="flex flex-wrap justify-center gap-1.5 pt-2 border-t border-border/40 w-full">
                {member.specialties.map((spec, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[11px] font-label px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA VOLUNTARIADO / DONAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-surface-container-low rounded-3xl p-8 sm:p-12 border border-border flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-2xl sm:text-3xl font-headline font-semibold text-primary mb-2">
              ¿Deseas colaborar con nosotros?
            </h3>
            <p className="text-sm font-body text-on-surface-variant max-w-xl">
              Buscamos profesionales, estudiantes y personas con vocación social que quieran sumarse como voluntarios o embajadores.
            </p>
          </div>
          <Link
            href="/voluntariado"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-label text-sm font-semibold px-6 py-3.5 rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all flex-shrink-0"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Postularme a Voluntariado</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
