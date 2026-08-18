-- ==============================================================================
-- DIVERSAMENTE - FIX COMPLETO AUTO-CONTENIDO (FUNCIONES + TABLAS + RLS + PERMISOS)
-- Pega y ejecuta esto en el SQL Editor de tu proyecto Supabase:
-- https://supabase.com/dashboard/project/pmpafbqxtyprxdermjss/sql
-- ==============================================================================

-- 1. EXTENSIÓN UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE PERFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'subscriber' CHECK (role IN ('visitor', 'subscriber', 'admin')),
    membership_tier VARCHAR(50) DEFAULT 'free' CHECK (membership_tier IN ('free', 'supporter', 'scholarship')),
    phone VARCHAR(50),
    bio TEXT
);

-- 3. FUNCIONES DE SEGURIDAD (Definidas antes de las políticas para evitar error 42883)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

CREATE OR REPLACE FUNCTION public.is_subscriber_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role IN ('subscriber', 'admin') FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- 4. TRIGGER PARA NUEVOS REGISTROS EN AUTH
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role VARCHAR(50) := 'subscriber';
BEGIN
  IF NEW.email = 'fundiversamente@gmail.com' OR NEW.email ILIKE '%admin%' OR NEW.email ILIKE '%fundiversamente%' THEN
    assigned_role := 'admin';
  ELSIF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
    assigned_role := NEW.raw_user_meta_data->>'role';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, membership_tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Administrador Diversamente'),
    assigned_role,
    CASE WHEN assigned_role = 'admin' THEN 'supporter' ELSE 'free' END
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    role = assigned_role,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. CREACIÓN DE TODAS LAS TABLAS RESTANTES
CREATE TABLE IF NOT EXISTS public.exclusive_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('webinar', 'plantilla', 'guia_avanzada', 'evento_privado', 'kit_sensorial')),
    video_url TEXT,
    download_url TEXT,
    file_size VARCHAR(50),
    access_tier VARCHAR(50) DEFAULT 'subscriber' CHECK (access_tier IN ('subscriber', 'admin')),
    is_published BOOLEAN DEFAULT true,
    thumbnail_url TEXT,
    author VARCHAR(100) DEFAULT 'Equipo Diversamente'
);

CREATE TABLE IF NOT EXISTS public.programs_catalog (
    id VARCHAR(100) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    icon VARCHAR(100) DEFAULT 'family_home',
    image_url TEXT,
    target_audience VARCHAR(255),
    format VARCHAR(50) DEFAULT 'Virtual',
    duration VARCHAR(100),
    features TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true
);

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

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.newsletters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    audience VARCHAR(100) DEFAULT 'all',
    sent_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'sent',
    sent_at TIMESTAMP WITH TIME ZONE,
    author VARCHAR(100) DEFAULT 'Equipo Diversamente'
);

-- 6. PERMISOS GLOBALES (GRANTS)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 7. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exclusive_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

-- 8. POLÍTICAS RLS IDEMPOTENTES (DROP IF EXISTS + CREATE)

-- 8.0 NEWSLETTERS
DROP POLICY IF EXISTS "Solo admin puede ver y crear boletines" ON public.newsletters;
CREATE POLICY "Solo admin puede ver y crear boletines"
    ON public.newsletters FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 8.1 PROFILES
DROP POLICY IF EXISTS "Lectura de propio perfil o administradores" ON public.profiles;
CREATE POLICY "Lectura de propio perfil o administradores"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Actualizar propio perfil (datos basicos)" ON public.profiles;
CREATE POLICY "Actualizar propio perfil (datos basicos)"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid() OR public.is_admin())
    WITH CHECK (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Insertar propio perfil" ON public.profiles;
CREATE POLICY "Insertar propio perfil"
    ON public.profiles FOR INSERT
    TO authenticated, anon, service_role
    WITH CHECK (true);

-- 8.2 CONTENIDO EXCLUSIVO
DROP POLICY IF EXISTS "Lectura contenido exclusivo para suscriptores y administradores" ON public.exclusive_content;
CREATE POLICY "Lectura contenido exclusivo para suscriptores y administradores"
    ON public.exclusive_content FOR SELECT
    TO authenticated
    USING (public.is_subscriber_or_admin());

DROP POLICY IF EXISTS "Administradores pueden crear contenido exclusivo" ON public.exclusive_content;
CREATE POLICY "Administradores pueden crear contenido exclusivo"
    ON public.exclusive_content FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Administradores pueden actualizar contenido exclusivo" ON public.exclusive_content;
CREATE POLICY "Administradores pueden actualizar contenido exclusivo"
    ON public.exclusive_content FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Administradores pueden eliminar contenido exclusivo" ON public.exclusive_content;
CREATE POLICY "Administradores pueden eliminar contenido exclusivo"
    ON public.exclusive_content FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 8.3 PROGRAMAS
DROP POLICY IF EXISTS "Lectura publica de programas activos" ON public.programs_catalog;
CREATE POLICY "Lectura publica de programas activos"
    ON public.programs_catalog FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Administradores pueden insertar programas" ON public.programs_catalog;
CREATE POLICY "Administradores pueden insertar programas"
    ON public.programs_catalog FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Administradores pueden actualizar programas" ON public.programs_catalog;
CREATE POLICY "Administradores pueden actualizar programas"
    ON public.programs_catalog FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Administradores pueden borrar programas" ON public.programs_catalog;
CREATE POLICY "Administradores pueden borrar programas"
    ON public.programs_catalog FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 8.4 RECURSOS PÚBLICOS
DROP POLICY IF EXISTS "Lectura publica de recursos" ON public.resources;
CREATE POLICY "Lectura publica de recursos"
    ON public.resources FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Administradores pueden insertar recursos" ON public.resources;
CREATE POLICY "Administradores pueden insertar recursos"
    ON public.resources FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Administradores pueden actualizar recursos" ON public.resources;
CREATE POLICY "Administradores pueden actualizar recursos"
    ON public.resources FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Administradores pueden eliminar recursos" ON public.resources;
CREATE POLICY "Administradores pueden eliminar recursos"
    ON public.resources FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 8.5 FORMULARIOS PÚBLICOS (INSERT ABIERTO PARA VISITANTES)
DROP POLICY IF EXISTS "Permitir envio publico de mensajes" ON public.contact_messages;
CREATE POLICY "Permitir envio publico de mensajes"
    ON public.contact_messages FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

DROP POLICY IF EXISTS "Solo admin puede leer mensajes" ON public.contact_messages;
CREATE POLICY "Solo admin puede leer mensajes"
    ON public.contact_messages FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Solo admin puede editar mensajes" ON public.contact_messages;
CREATE POLICY "Solo admin puede editar mensajes"
    ON public.contact_messages FOR UPDATE
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Permitir envio publico de consultas de programas" ON public.program_inquiries;
CREATE POLICY "Permitir envio publico de consultas de programas"
    ON public.program_inquiries FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

DROP POLICY IF EXISTS "Solo admin puede leer consultas" ON public.program_inquiries;
CREATE POLICY "Solo admin puede leer consultas"
    ON public.program_inquiries FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Permitir postulacion publica de voluntariado" ON public.volunteers;
CREATE POLICY "Permitir postulacion publica de voluntariado"
    ON public.volunteers FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

DROP POLICY IF EXISTS "Solo admin puede leer voluntarios" ON public.volunteers;
CREATE POLICY "Solo admin puede leer voluntarios"
    ON public.volunteers FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Permitir registrar intencion de donacion" ON public.donations;
CREATE POLICY "Permitir registrar intencion de donacion"
    ON public.donations FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

DROP POLICY IF EXISTS "Solo admin puede ver donaciones" ON public.donations;
CREATE POLICY "Solo admin puede ver donaciones"
    ON public.donations FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Permitir suscripcion publica a newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Permitir suscripcion publica a newsletter"
    ON public.newsletter_subscribers FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

DROP POLICY IF EXISTS "Solo admin puede ver lista de newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Solo admin puede ver lista de newsletter"
    ON public.newsletter_subscribers FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- 9. CONTENIDO SEMILLA INICIAL
INSERT INTO public.exclusive_content (title, description, type, video_url, download_url, file_size, author, thumbnail_url)
VALUES
(
    'Webinar Exclusivo: Regulación Emocional y Crisis Sensoriales en Casa',
    'Taller clínico de 75 minutos dirigido por la psicóloga Elena Silva, con casos reales y protocolos de desescalamiento sensorial.',
    'webinar',
    'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    '#material-descargable-webinar-1',
    '75 min + PDF Guía',
    'Dra. Elena Silva',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'
),
(
    'Kit de Plantillas Sensoriales Imprimibles (Pictogramas & Rutinas)',
    'Colección de 35 pictogramas y tableros de anticipación visual listos para imprimir en alta resolución y plastificar en casa.',
    'kit_sensorial',
    NULL,
    '#kit-sensorial-pictogramas',
    '14.5 MB (PDF HD)',
    'María Torres (Terapeuta)',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80'
),
(
    'Guía Avanzada: Manejo del Duelo Parental y Diagnóstico Tardío',
    'Documento confidencial con ejercicios terapéuticos para padres que atraviesan las etapas de asimilación de un diagnóstico neurodivergente.',
    'guia_avanzada',
    NULL,
    '#guia-duelo-parental',
    '4.2 MB',
    'Equipo Clínico Diversamente',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80'
)
ON CONFLICT DO NOTHING;

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
)
ON CONFLICT DO NOTHING;

-- 10. ASIGNAR ROL ADMINISTRADOR PERMANENTE A FUNDIVERSAMENTE
UPDATE public.profiles
SET role = 'admin', membership_tier = 'supporter', full_name = 'Administrador Diversamente'
WHERE email = 'fundiversamente@gmail.com';

