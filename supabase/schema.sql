-- ==============================================================================
-- DIVERSAMENTE - ESQUEMA DE BASE DE DATOS SUPABASE & POLÍTICAS DE SEGURIDAD (RLS)
-- Alianza de Inclusión Familiar: Amar, aceptar y avanzar juntos.
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLAS PRINCIPALES
-- ==============================================================================

-- Tabla: contact_messages (Mensajes del formulario de contacto)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    topic VARCHAR(100) NOT NULL DEFAULT 'Consulta General',
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'in_progress', 'resolved', 'archived')),
    admin_notes TEXT
);

-- Tabla: program_inquiries (Solicitudes de inscripción / información de programas)
CREATE TABLE IF NOT EXISTS public.program_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    program_id VARCHAR(100) NOT NULL,
    program_name VARCHAR(255) NOT NULL,
    preferred_modality VARCHAR(50) DEFAULT 'virtual' CHECK (preferred_modality IN ('virtual', 'presencial', 'indiferente')),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'enrolled', 'cancelled'))
);

-- Tabla: volunteers (Postulaciones de voluntariado)
CREATE TABLE IF NOT EXISTS public.volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    city VARCHAR(100) DEFAULT 'Bogotá',
    occupation VARCHAR(255),
    skills TEXT[] DEFAULT '{}',
    availability VARCHAR(100),
    motivation TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'received' CHECK (status IN ('received', 'interview_scheduled', 'active', 'inactive'))
);

-- Tabla: donations (Registro y seguimiento de intenciones y donaciones)
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    donor_name VARCHAR(255) NOT NULL,
    donor_email VARCHAR(255) NOT NULL,
    donor_phone VARCHAR(50),
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'COP',
    frequency VARCHAR(20) DEFAULT 'one_time' CHECK (frequency IN ('one_time', 'monthly', 'annual')),
    payment_method VARCHAR(50) DEFAULT 'bank_transfer',
    transaction_reference VARCHAR(255),
    is_anonymous BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'pledged' CHECK (status IN ('pledged', 'pending', 'completed', 'failed')),
    message TEXT
);

-- Tabla: newsletter_subscribers (Suscripciones al boletín informativo)
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Tabla: resources (Catálogo de guías y herramientas descargables)
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    file_type VARCHAR(20) DEFAULT 'PDF',
    file_size VARCHAR(50) DEFAULT '1.5 MB',
    download_url TEXT NOT NULL,
    download_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false
);

-- ==============================================================================
-- 3. ÍNDICES DE RENDIMIENTO
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_contact_created ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_program ON public.program_inquiries(program_id);
CREATE INDEX IF NOT EXISTS idx_donations_created ON public.donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);

-- ==============================================================================
-- 4. SEGURIDAD Y POLÍTICAS ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Políticas para: contact_messages
-- Permitir a usuarios anónimos o autenticados crear mensajes (INSERT público)
CREATE POLICY "Permitir envio publico de mensajes de contacto"
    ON public.contact_messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Solo administradores autenticados o backend service_role pueden ver/modificar mensajes
CREATE POLICY "Solo administradores pueden ver mensajes"
    ON public.contact_messages
    FOR SELECT
    TO authenticated
    USING (auth.role() = 'authenticated');

CREATE POLICY "Solo administradores pueden actualizar mensajes"
    ON public.contact_messages
    FOR UPDATE
    TO authenticated
    USING (auth.role() = 'authenticated');

-- Políticas para: program_inquiries
CREATE POLICY "Permitir envio publico de consultas de programas"
    ON public.program_inquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Solo administradores pueden ver consultas de programas"
    ON public.program_inquiries
    FOR SELECT
    TO authenticated
    USING (auth.role() = 'authenticated');

-- Políticas para: volunteers
CREATE POLICY "Permitir postulacion publica de voluntarios"
    ON public.volunteers
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Solo administradores pueden ver voluntarios"
    ON public.volunteers
    FOR SELECT
    TO authenticated
    USING (auth.role() = 'authenticated');

-- Políticas para: donations
CREATE POLICY "Permitir registrar intencion de donacion"
    ON public.donations
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Solo administradores pueden ver donaciones"
    ON public.donations
    FOR SELECT
    TO authenticated
    USING (auth.role() = 'authenticated');

-- Políticas para: newsletter_subscribers
CREATE POLICY "Permitir suscripcion publica al newsletter"
    ON public.newsletter_subscribers
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Solo administradores pueden ver suscriptores"
    ON public.newsletter_subscribers
    FOR SELECT
    TO authenticated
    USING (auth.role() = 'authenticated');

-- Políticas para: resources
-- Lectura pública para que cualquier visitante pueda ver los recursos
CREATE POLICY "Permitir lectura publica de recursos"
    ON public.resources
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- ==============================================================================
-- 5. DATOS SEMILLA INICIALES (RECURSOS)
-- ==============================================================================
INSERT INTO public.resources (title, category, description, file_type, file_size, download_url, is_featured)
VALUES 
(
    'Comprendiendo las Primeras Señales', 
    'Guía', 
    'Una guía completa para que los padres reconozcan los marcadores tempranos del desarrollo y sepan cuándo buscar asesoramiento profesional.', 
    'PDF', 
    '2.4 MB', 
    '#download-guia-senales',
    true
),
(
    'Estrategias de Apoyo Diario en el Hogar', 
    'Herramientas', 
    'Pasos prácticos y viables para crear un entorno de apoyo, calma y regulación emocional en el hogar para personas neurodivergentes.', 
    'PDF', 
    '1.8 MB', 
    '#download-herramientas-hogar',
    true
),
(
    'Red de Especialistas y Terapeutas Locales', 
    'Directorio', 
    'Una lista seleccionada de terapeutas locales de confianza, educadores inclusivos y grupos de apoyo en Colombia.', 
    'PDF', 
    '1.2 MB', 
    '#download-directorio-especialistas',
    true
),
(
    'Guía para Docentes: Aulas Inclusivas', 
    'Educación', 
    'Herramientas pedagógicas para maestros que buscan adaptar el currículo y fomentar la empatía en el salón de clases.', 
    'PDF', 
    '3.1 MB', 
    '#download-guia-docentes',
    false
)
ON CONFLICT DO NOTHING;
