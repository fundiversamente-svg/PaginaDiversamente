'use client';

import React, { useState } from 'react';
import { Download, FileText, CheckCircle2 } from 'lucide-react';
import { useToast } from './Toast';
import type { ResourceItem } from '@/lib/mockData';

interface ResourceCardProps {
  resource: ResourceItem;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const { showToast } = useToast();

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      showToast(`Descargando "${resource.title}" (${resource.fileSize})`, 'success');
      
      // Create sample downloadable blob if actual file doesn't exist
      const blob = new Blob(
        [
          `Diversamente - Alianza de Inclusión Familiar\n\nRecurso: ${resource.title}\nCategoría: ${resource.category}\n\nDescripción:\n${resource.description}\n\nPara más recursos y acompañamiento, visita: https://fundiversamente.org o contáctanos a fundiversamente@gmail.com`
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resource.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 600);
  };

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border shadow-ambient-1 hover:shadow-ambient-2 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-block px-3 py-1 rounded-full font-label text-xs font-semibold ${
              resource.category === 'Guía'
                ? 'bg-secondary-container text-on-secondary-container'
                : resource.category === 'Herramientas'
                ? 'bg-tertiary-container text-on-tertiary-container'
                : 'bg-primary-container text-on-primary-container'
            }`}
          >
            {resource.category}
          </span>
          <span className="text-xs font-mono text-on-surface-variant/70 uppercase">
            {resource.fileType} • {resource.fileSize}
          </span>
        </div>

        <div className="flex items-start gap-3 mb-2">
          <div className="p-2 rounded-xl bg-surface-container-low text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-headline font-semibold text-on-surface group-hover:text-primary transition-colors">
            {resource.title}
          </h3>
        </div>

        <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-6">
          {resource.description}
        </p>
      </div>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary font-label text-sm font-semibold py-2.5 px-4 rounded-xl border border-border hover:border-transparent transition-all duration-300 active:scale-95 shadow-sm"
      >
        {downloaded ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            <span>Descargado</span>
          </>
        ) : downloading ? (
          <span>Preparando descarga...</span>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Descargar Recurso</span>
          </>
        )}
      </button>
    </div>
  );
}
