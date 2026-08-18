'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  videoUrl = 'https://www.youtube.com/embed/vD5pWKwhNt8?si=_gQcZ3BN5M2RCa-m',
  title = 'Conoce nuestro impacto y visión',
}: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dim/80 dark:bg-surface-dim/90 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div className="relative w-full max-w-4xl bg-surface rounded-2xl overflow-hidden shadow-2xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-surface-container-low">
          <h3 id="video-modal-title" className="text-lg font-headline font-semibold text-primary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface transition-colors"
            aria-label="Cerrar video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={videoUrl}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Footer caption */}
        <div className="p-4 bg-surface-container-low text-xs text-on-surface-variant text-center font-body">
          Diversamente: Construyendo espacios donde cada persona y familia encuentra su lugar.
        </div>
      </div>
    </div>
  );
}
