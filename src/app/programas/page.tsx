'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Sparkles, Search, Filter } from 'lucide-react';
import { PROGRAMS } from '@/lib/mockData';
import ProgramCard from '@/components/ProgramCard';

const CATEGORIES = [
  'Todos',
  'Acompañamiento Familiar',
  'Terapia Individual',
  'Educación & Talleres',
  'Comunidad',
];

export default function ProgramasPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('Todos');

  const filteredPrograms = useMemo(() => {
    return PROGRAMS.filter((prog) => {
      const matchCategory =
        selectedCategory === 'Todos' || prog.category === selectedCategory;
      const matchFormat =
        selectedFormat === 'Todos' || prog.format === selectedFormat;
      const matchSearch =
        searchQuery === '' ||
        prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchFormat && matchSearch;
    });
  }, [selectedCategory, selectedFormat, searchQuery]);

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center pt-8">
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-ambient-1 bg-surface-container-low border border-border hidden md:block p-3">
            <div className="relative w-full h-full">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnXvvO6NQpGWuD04wEZT1A-iq-dLBdEuL1VHxtcbBe4mqUHVMbpOd1fjJEG6e9eGIS0M78iMDOCa9soH4n1bI4D34uqi6fpVoysf2VpB9vO6XwWtXFzxD500DALqZjSAF5TkyGJ-7gWMJ1aCBDOpC2J-F7UJob601CJrc4lO2unSQGRcfLFlQ3avquB8di4gKtM1ZYG-gZOjpLlhKz9Tq9Y2pohiH1njTQ6wy0j-s_1980NBgLN3wW4gRcEpgvoeZMUpo"
                alt="Crecimiento Juntos"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1 rounded-full mb-3">
              Catálogo de Servicios
            </span>
            <h1 className="text-4xl sm:text-5xl font-headline font-bold text-on-surface">
              Programas y Servicios
            </h1>
          </div>

          <div className="w-20 h-20 rounded-full overflow-hidden shadow-ambient-1 bg-surface-container-low border border-border hidden md:block p-3">
            <div className="relative w-full h-full">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuABbAVZvck3DoC-eQbncHUWhVxiGGPRn0C-CTdc6dsprCtnAdKan2lQfAHFvhlB8eETCB9zYuEPLSvYzGdAEf3BRsFIWL9r7yGwgAw54PEpQBmYfy5ayV-GgzRlnLWhdfLbIA8i8HodhUVLLhmToJWODoOoXTfCiJkjPpxUh_jCU-_F09v-KDyAwXw2Zt9vpfPKNdrAw2T_iQ3wqjzcgnXeTjDJcBCvBLElIB_K-pG75dMvTap3sEXOXW2AIWbynkPbpRQ"
                alt="Avanzar Juntos"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <p className="text-base sm:text-lg font-body text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Fomentando el crecimiento a través del apoyo estructurado y la conexión comunitaria. Explora nuestras vías principales diseñadas para empoderar a familias e individuos.
        </p>
      </section>

      {/* 2. FILTERS & SEARCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-ambient-1 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar programa o taller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-container-low border border-border rounded-xl text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-label font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Modality Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-secondary flex-shrink-0" />
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface-container-low border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="Todos">Todas las modalidades</option>
              <option value="Virtual">Virtual</option>
              <option value="Presencial">Presencial</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. PROGRAM CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((prog) => (
              <ProgramCard key={prog.id} program={prog} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-surface-container-low rounded-2xl border border-border p-8">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-3 opacity-60" />
            <h3 className="text-xl font-headline font-semibold text-on-surface mb-1">
              No encontramos programas con ese filtro
            </h3>
            <p className="text-sm font-body text-on-surface-variant mb-4">
              Intenta cambiar la categoría o limpiar el término de búsqueda.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Todos');
                setSelectedFormat('Todos');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-primary text-on-primary font-label text-xs font-semibold rounded-lg"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </section>

      {/* 4. METHODOLOGY SUMMARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-surface-container-low rounded-3xl p-8 sm:p-12 border border-border shadow-ambient-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-label uppercase tracking-widest text-primary font-bold">
              Metodología
            </span>
            <h3 className="text-2xl font-headline font-semibold text-on-surface">
              ¿Cómo funcionan nuestros programas?
            </h3>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed">
              Diseñamos cada espacio basándonos en la evidencia clínica, adaptándonos al ritmo particular de cada individuo y su entorno familiar.
            </p>
          </div>

          <div className="p-6 bg-surface rounded-2xl border border-border">
            <div className="text-lg font-headline font-semibold text-primary mb-2">
              1. Diagnóstico y Acogida
            </div>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              Entrevista inicial empática y sin costo de evaluación para identificar los desafíos prioritarios y canalizar hacia el programa adecuado.
            </p>
          </div>

          <div className="p-6 bg-surface rounded-2xl border border-border">
            <div className="text-lg font-headline font-semibold text-primary mb-2">
              2. Plan Personalizado
            </div>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              Acompañamiento guiado con metas alcanzables, seguimiento continuo y vinculación activa con la red de familias.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
