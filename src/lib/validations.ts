import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .trim(),
  email: z
    .string()
    .email('Ingresa un correo electrónico válido')
    .max(255, 'El correo es demasiado largo')
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .max(30, 'El teléfono es demasiado largo')
    .optional()
    .or(z.literal('')),
  topic: z
    .string()
    .min(1, 'Por favor selecciona un tema')
    .default('Consulta General'),
  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(2000, 'El mensaje no puede exceder 2000 caracteres')
    .trim(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const programInquirySchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio').trim(),
  email: z.string().email('Correo electrónico inválido').trim().toLowerCase(),
  phone: z.string().min(7, 'Ingresa un teléfono o WhatsApp de contacto válido').trim(),
  program_id: z.string().min(1, 'Programa no especificado'),
  program_name: z.string().min(1, 'Nombre del programa no especificado'),
  preferred_modality: z.enum(['virtual', 'presencial', 'indiferente']).default('virtual'),
  notes: z.string().max(1000).optional().or(z.literal('')),
});

export type ProgramInquiryFormData = z.infer<typeof programInquirySchema>;

export const volunteerSchema = z.object({
  full_name: z.string().min(2, 'El nombre completo es obligatorio').trim(),
  email: z.string().email('Correo inválido').trim().toLowerCase(),
  phone: z.string().min(7, 'Ingresa un número de contacto válido').trim(),
  city: z.string().min(2, 'Ingresa tu ciudad').default('Bogotá'),
  occupation: z.string().max(100).optional().or(z.literal('')),
  skills: z.array(z.string()).min(1, 'Selecciona al menos una habilidad o área de interés'),
  availability: z.string().min(2, 'Indica tu disponibilidad de tiempo'),
  motivation: z
    .string()
    .min(20, 'Cuéntanos un poco más sobre tu motivación (mínimo 20 caracteres)')
    .max(1500)
    .trim(),
});

export type VolunteerFormData = z.infer<typeof volunteerSchema>;

export const donationSchema = z.object({
  donor_name: z.string().min(2, 'Tu nombre es obligatorio').trim(),
  donor_email: z.string().email('Correo inválido').trim().toLowerCase(),
  donor_phone: z.string().max(30).optional().or(z.literal('')),
  amount: z.number().min(5000, 'El monto mínimo de donación es de $5.000 COP'),
  currency: z.string().default('COP'),
  frequency: z.enum(['one_time', 'monthly', 'annual']).default('one_time'),
  payment_method: z.string().default('bank_transfer'),
  is_anonymous: z.boolean().default(false),
  message: z.string().max(500).optional().or(z.literal('')),
});

export type DonationFormData = z.infer<typeof donationSchema>;

export const newsletterSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido').trim().toLowerCase(),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
