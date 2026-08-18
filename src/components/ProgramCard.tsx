'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Clock, MapPin, Check } from 'lucide-react';
import type { Program } from '@/lib/mockData';
import ProgramInquiryModal from './ProgramInquiryModal';

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <article className="group bg-surface rounded-2xl overflow-hidden border border-border/80 shadow-ambient-1 hover:shadow-ambient-2 hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
        {/* Card Image */}
        <div className="relative h-52 w-full overflow-hidden bg-surface-container-low">
          <Image
            src={program.image}
            alt={program.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
          
          <span className="absolute top-4 left-4 bg-surface/90 dark:bg-surface-container/90 backdrop-blur-md text-primary font-label text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {program.category}
          </span>
        </div>

        {/* Card Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-2">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              {program.format}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              {program.duration}
            </span>
          </div>

          <h3 className="text-xl font-headline font-semibold text-on-surface group-hover:text-primary transition-colors mb-2">
            {program.title}
          </h3>

          <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-4 flex-grow">
            {program.shortDescription}
          </p>

          {/* Features checkmarks */}
          <ul className="space-y-1.5 mb-6 text-xs text-on-surface-variant">
            {program.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Action button */}
          <button
            onClick={() => setModalOpen(true)}
            className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary font-label text-sm font-semibold py-2.5 px-4 rounded-xl border border-border hover:border-transparent transition-all duration-300 active:scale-95 shadow-sm"
          >
            <span>Consultar / Inscribirme</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </article>

      <ProgramInquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        program={program}
      />
    </>
  );
}
