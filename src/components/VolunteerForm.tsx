'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, HeartHandshake } from 'lucide-react';
import { useToast } from './Toast';
import { safeInsert } from '@/lib/supabaseClient';
import { volunteerSchema, type VolunteerFormData } from '@/lib/validations';

const SKILL_OPTIONS = [
  'Psicología / Contención Emocional',
  'Educación Especial / Pedagogía',
  'Terapia Ocupacional / Fonoaudiología',
  'Arte, Música y Recreación Inclusiva',
  'Logística y Apoyo en Eventos',
  'Diseño Gráfico, Redes y Contenido',
  'Asesoría Legal y Derechos en Salud',
];

export default function VolunteerForm() {
  const [formData, setFormData] = useState<VolunteerFormData>({
    full_name: '',
    email: '',
    phone: '',
    city: 'Bogotá',
    occupation: '',
    skills: [],
    availability: 'Fines de semana (sábados)',
    motivation: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof VolunteerFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = volunteerSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof VolunteerFormData, string>> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof VolunteerFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      showToast('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await safeInsert('volunteers', {
        full_name: validation.data.full_name,
        email: validation.data.email,
        phone: validation.data.phone,
        city: validation.data.city,
        occupation: validation.data.occupation || null,
        skills: validation.data.skills,
        availability: validation.data.availability,
        motivation: validation.data.motivation,
        status: 'received',
      });

      if (res.success) {
        setIsSuccess(true);
        showToast('¡Postulación enviada! Gracias por tu generosidad y compromiso.', 'success');
      } else {
        showToast(res.error || 'Error al registrar la postulación', 'error');
      }
    } catch {
      showToast('Ocurrió un error inesperado al conectar con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-2xl p-6 sm:p-10 border border-border shadow-ambient-1 max-w-3xl mx-auto">
      {isSuccess ? (
        <div className="py-12 text-center flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-secondary" />
          </div>
          <h3 className="text-2xl font-headline font-semibold text-primary">
            ¡Postulación Recibida con Amor!
          </h3>
          <p className="text-sm font-body text-on-surface-variant max-w-md">
            Nuestro equipo de coordinación de voluntariado revisará tu perfil y te contactará para una breve llamada de bienvenida y alineación.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="mt-4 px-6 py-2.5 bg-primary text-on-primary font-label text-sm font-semibold rounded-lg hover:opacity-90 transition-all"
          >
            Enviar otra postulación
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-2 text-secondary mb-2">
            <HeartHandshake className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Únete al Equipo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-headline font-semibold text-primary">
            Formulario de Voluntariado
          </h2>
          <p className="text-sm font-body text-on-surface-variant">
            Tu tiempo y tus talentos tienen el poder de transformar familias enteras. Cuéntanos sobre ti.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Tu nombre completo"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}
            </div>

            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                Correo Electrónico *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tu.correo@ejemplo.com"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                Teléfono / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+57 315 000 0000"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                Ciudad *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Bogotá / Otra"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                Ocupación o Profesión
              </label>
              <input
                type="text"
                value={formData.occupation || ''}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="Ej. Psicóloga / Estudiante"
                className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Skill Pills */}
          <div>
            <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-2">
              Áreas en las que deseas contribuir (Selecciona una o más) *
            </label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((skill) => {
                const selected = formData.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-label font-medium transition-all ${
                      selected
                        ? 'bg-secondary text-on-secondary shadow-sm scale-[1.02]'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-border'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {skill}
                  </button>
                );
              })}
            </div>
            {errors.skills && <p className="mt-1 text-xs text-red-500">{errors.skills}</p>}
          </div>

          <div>
            <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
              Disponibilidad de tiempo
            </label>
            <select
              value={formData.availability || ''}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="Fines de semana (sábados)">Fines de semana (Sábados en la mañana)</option>
              <option value="Entre semana (tardes)">Entre semana (Tardes)</option>
              <option value="Virtual / Horario flexible">Virtual / Trabajo remoto por objetivos</option>
              <option value="Eventos puntuales">Disponibilidad para eventos específicos</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
              ¿Qué te motiva a ser parte de Diversamente? *
            </label>
            <textarea
              rows={4}
              required
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              placeholder="Cuéntanos un poco sobre tu historia, tu cercanía con la neurodiversidad o tu deseo de ayudar..."
              className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {errors.motivation && <p className="mt-1 text-xs text-red-500">{errors.motivation}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label text-sm font-semibold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Enviando postulación...' : 'Enviar Postulación'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
