'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, BookOpen, UserCheck, Phone, MapPin, ExternalLink, Instagram } from 'lucide-react';
import { RESOURCES_LIST } from '@/lib/mockData';
import ResourceCard from '@/components/ResourceCard';

const SPECIALISTS_DIRECTORY = [
  {
    name: 'Dra. Patricia Morales',
    specialty: 'Neuropediatría y Diagnóstico de Neurodesarrollo',
    city: 'Bogotá (Chicó / Teleconsulta)',
    phone: '+57 310 445 9901',
    verified: true,
  },
  {
    name: 'Lic. Camilo Restrepo',
    specialty: 'Terapia Ocupacional e Integración Sensorial',
    city: 'Bogotá (Cedritos)',
    phone: '+57 318 290 8822',
    verified: true,
  },
  {
    name: 'Dra. Andrea Londoño',
    specialty: 'Fonoaudiología y Comunicación Aumentativa (PECS)',
    city: 'Medellín / Virtual Colombia',
    phone: '+57 301 776 5410',
    verified: true,
  },
  {
    name: 'Centro Terapéutico Crecer Juntos',
    specialty: 'Atención Interdisciplinar Infantil (Psicología, TO, Fono)',
    city: 'Bogotá (Usaquén)',
    phone: '+57 315 889 0012',
    verified: true,
  },
];

export default function RecursosPage() {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = useMemo(() => {
    return RESOURCES_LIST.filter((res) => {
      const matchCat = activeCategory === 'Todas' || res.category === activeCategory;
      const matchSearch =
        searchQuery === '' ||
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center pt-8">
        <div className="relative py-12 px-6 sm:px-12 bg-surface-container-low rounded-3xl border border-border shadow-ambient-1 overflow-hidden">
          <div className="absolute inset-0 hero-pattern opacity-10 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1 rounded-full mb-4">
              Materiales y Conocimiento Abierto
            </span>
            <h1 className="text-4xl sm:text-5xl font-headline font-bold text-on-surface mb-4">
              Fomentando el Conocimiento y la Conexión
            </h1>
            <p className="text-base sm:text-lg font-body text-on-surface-variant leading-relaxed mb-8">
              Descubre una biblioteca de guías seleccionadas, cartillas de derechos y herramientas prácticas diseñadas para acompañar tu camino.
            </p>

            {/* Visual Logo Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="p-3 bg-surface rounded-2xl border border-border shadow-sm flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcqeA4YAKZbCLaK_OdWdjW3dO8KXFcxPlKayJD4C9g2cQo0t5HYTf5NKPUn0iZfgK8C1rZJVymW6LT5JR_NQBYnQ7Ms75eq_oPHr3xAqsAT0EI2oAqjZwJjwODaTXM4qJ7vcLt7dECUvhkQ5N-N3ivZmy9XtIORk0vtAbwroTPYLk7ShFw4YUBmiBYzLOOibciC_rGNrzypXG64kVtf4ClnW_GOp2kGTjtJwhziICyI5BIy3uZYvfemBkgKalS3HHyyCE"
                    alt="Diversamente Aprendizaje"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-left">
                  <div className="text-xs font-label font-bold text-on-surface">Aprendizaje Guiado</div>
                  <div className="text-[11px] text-on-surface-variant">Guías descargables en PDF</div>
                </div>
              </div>

              <div className="p-3 bg-surface rounded-2xl border border-border shadow-sm flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4D5iuhmb_PomFuvtpQfrNPamfJMRVEVJZ7C4kbSRgQmu3MCXhf6Jcdac804lOeO5PY_qzQ_-zCc4enFTqCL_jJlvo7X9FY7E1ZQ3Z0fCToxwbMt2JloxCDW13Tmh2hwXGqNkzsixRj9xh2Kkwmqwa-oR7-obK1WSJkeyjgLxBZnHKWnfmm2N8F5X1ZMmlJF6nWROgSQlVdVFCxh9v2NTCfX2W3hruIlv9e5O8Aegc6YlPUiFQ8rhTE34j93w7gPiIUrc"
                    alt="Diversamente Amor & Comprensión"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-left">
                  <div className="text-xs font-label font-bold text-on-surface">Amor & Comprensión</div>
                  <div className="text-[11px] text-on-surface-variant">Directorio de especialistas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. RECURSOS DESCARGABLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-headline font-semibold text-on-surface">
              Biblioteca de Recursos
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 font-body">
              Material libre de costo para padres, cuidadores y docentes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['Todas', 'Guía', 'Herramientas', 'Directorio', 'Educación'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-label font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>

        {/* Instagram Infografías CTA */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 border border-pink-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-xs flex-shrink-0">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-headline font-bold text-on-surface">
                ¿Buscas infografías visuales y resúmenes prácticos?
              </h4>
              <p className="text-xs sm:text-sm font-body text-on-surface-variant mt-0.5">
                En nuestro Instagram <strong className="text-primary font-bold">@somos_diversamente</strong> compartimos carruseles educativos semanales y guías en formato visual.
              </p>
            </div>
          </div>

          <a
            href="https://www.instagram.com/somos_diversamente?utm_source=qr&igsi=MWY0YmN6cnI5ODRhZw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-label text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl shadow-xs hover:scale-[1.02] active:scale-95 transition-all flex-shrink-0"
          >
            <Instagram className="w-4 h-4" />
            <span>Ver Infografías en Instagram</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </section>

      {/* 3. DIRECTORIO DE ESPECIALISTAS LOCALES */}
      <section id="directorio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-surface-container-low rounded-3xl p-8 sm:p-12 border border-border shadow-ambient-1">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-label uppercase tracking-widest text-primary font-bold">
              Red Confiable
            </span>
            <h2 className="text-3xl font-headline font-semibold text-on-surface mt-1 mb-2">
              Directorio de Especialistas Verificados
            </h2>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed">
              Profesionales externos recomendados por nuestra comunidad por su trato neuroafirmativo, experiencia comprobada y empatía.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SPECIALISTS_DIRECTORY.map((spec, idx) => (
              <div
                key={idx}
                className="p-5 bg-surface rounded-2xl border border-border shadow-sm flex flex-col justify-between gap-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-headline font-semibold text-on-surface">
                        {spec.name}
                      </h4>
                      <span title="Especialista verificado">
                        <UserCheck className="w-4 h-4 text-secondary" />
                      </span>
                    </div>
                    <p className="text-xs text-primary font-medium mt-0.5">{spec.specialty}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-border/40 font-body">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-on-surface-variant" />
                    {spec.city}
                  </span>
                  <a
                    href={`tel:${spec.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-1 text-primary hover:underline font-label font-bold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{spec.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-surface rounded-xl border border-border/60 text-xs text-on-surface-variant text-center font-body">
            ¿Eres terapeuta o profesional en neurodiversidad y quieres formar parte de nuestro directorio verificado?{' '}
            <a href="/contacto" className="text-primary font-semibold underline">
              Postula tu perfil aquí
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
