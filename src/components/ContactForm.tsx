'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from './Toast';
import { safeInsert } from '@/lib/supabaseClient';
import { contactSchema, type ContactFormData } from '@/lib/validations';

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    topic: 'Consulta General',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      showToast('Por favor corrige los campos señalados en el formulario', 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await safeInsert('contact_messages', {
        name: validation.data.name,
        email: validation.data.email,
        phone: validation.data.phone || null,
        topic: validation.data.topic,
        message: validation.data.message,
        status: 'unread',
      });

      if (res.success) {
        setIsSuccess(true);
        showToast('¡Mensaje enviado con éxito! Nos comunicaremos contigo pronto.', 'success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          topic: 'Consulta General',
          message: '',
        });
      } else {
        showToast(res.error || 'Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
      }
    } catch {
      showToast('Ocurrió un error inesperado al conectar con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-2xl p-6 sm:p-10 border border-border shadow-ambient-1">
      {isSuccess ? (
        <div className="py-12 text-center flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-secondary" />
          </div>
          <h3 className="text-2xl font-headline font-semibold text-primary">
            ¡Mensaje Enviado con Éxito!
          </h3>
          <p className="text-sm font-body text-on-surface-variant max-w-md">
            Gracias por escribirnos. Nuestro equipo revisará tu mensaje y te responderá lo más pronto posible a tu correo o teléfono.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="mt-4 px-6 py-2.5 bg-primary text-on-primary font-label text-sm font-semibold rounded-lg hover:opacity-90 transition-all"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-headline font-semibold text-primary mb-2">
              Ponte en Contacto
            </h2>
            <p className="text-sm font-body text-on-surface-variant">
              Estamos aquí para escuchar y acompañar. Completa el siguiente formulario y nos pondremos en contacto a la brevedad.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-2">
                  Nombre Completo *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre y apellido"
                  className={`w-full px-4 py-3 text-sm bg-surface-container-lowest border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                    errors.name ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-2">
                  Correo Electrónico *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu.correo@ejemplo.com"
                  className={`w-full px-4 py-3 text-sm bg-surface-container-lowest border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                    errors.email ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-phone" className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-2">
                  Teléfono / WhatsApp (Opcional)
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="+57 315 000 0000"
                  className="w-full px-4 py-3 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>

              <div>
                <label htmlFor="contact-topic" className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-2">
                  ¿Cómo podemos ayudarte?
                </label>
                <select
                  id="contact-topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                >
                  <option value="Consulta General">Consulta General</option>
                  <option value="Información del Programa">Información de Programas</option>
                  <option value="Solicitud de Apoyo">Solicitud de Apoyo Psicológico / Familiar</option>
                  <option value="Voluntariado">Postulación a Voluntariado</option>
                  <option value="Alianzas y Donaciones">Alianzas y Donaciones</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-2">
                Mensaje *
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Escribe tu mensaje o consulta detallada aquí..."
                className={`w-full px-4 py-3 text-sm bg-surface-container-lowest border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                  errors.message ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label text-sm font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all shadow-sm w-full sm:w-auto"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Enviando mensaje...' : 'Enviar Mensaje'}</span>
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
