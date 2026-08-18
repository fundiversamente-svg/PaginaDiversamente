'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Send, HeartHandshake } from 'lucide-react';
import { useToast } from './Toast';
import { safeInsert } from '@/lib/supabaseClient';
import type { Program } from '@/lib/mockData';

interface ProgramInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
}

export default function ProgramInquiryModal({
  isOpen,
  onClose,
  program,
}: ProgramInquiryModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [modality, setModality] = useState<'virtual' | 'presencial' | 'indiferente'>('virtual');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, program]);

  if (!isOpen || !program) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      showToast('Por favor completa los campos requeridos', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await safeInsert('program_inquiries', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        program_id: program.id,
        program_name: program.title,
        preferred_modality: modality,
        notes: notes.trim() || null,
        status: 'pending',
      });

      if (res.success) {
        setSubmitted(true);
        showToast('¡Solicitud enviada con éxito! Nos comunicaremos pronto.', 'success');
      } else {
        showToast(res.error || 'Error al enviar la solicitud', 'error');
      }
    } catch {
      showToast('Ocurrió un error inesperado. Inténtalo de nuevo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dim/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-surface rounded-2xl p-6 sm:p-8 shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="text-2xl font-headline font-semibold text-primary">
              ¡Hemos recibido tu solicitud!
            </h3>
            <p className="text-sm font-body text-on-surface-variant max-w-sm">
              Gracias por confiar en nosotros para <strong>{program.title}</strong>. Un especialista de nuestro equipo te contactará en las próximas 24 horas.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-primary text-on-primary font-label text-sm font-semibold rounded-lg hover:opacity-90 transition-all"
            >
              Entendido
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-secondary mb-2">
              <HeartHandshake className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Inscripción / Información</span>
            </div>
            <h3 className="text-2xl font-headline font-semibold text-primary mb-1">
              {program.title}
            </h3>
            <p className="text-xs font-body text-on-surface-variant mb-6">
              Completa tus datos y nos pondremos en contacto para brindarte detalles sobre fechas, costos y metodología.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Carolina Gómez"
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carolina@ejemplo.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 315 123 4567"
                    className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Modalidad preferida
                </label>
                <select
                  value={modality}
                  onChange={(e) => setModality(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                >
                  <option value="virtual">Virtual (Online vía Zoom/Meet)</option>
                  <option value="presencial">Presencial (Bogotá)</option>
                  <option value="indiferente">Indiferente / Lo que esté disponible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Comentarios o necesidades particulares (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Cuéntanos brevemente sobre la edad de tu familiar o los objetivos que deseas alcanzar..."
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label text-sm font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Enviando solicitud...' : 'Enviar Solicitud'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
