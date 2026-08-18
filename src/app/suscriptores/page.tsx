'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Lock,
  Play,
  Download,
  Video,
  FileText,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { useToast } from '@/components/Toast';
import VideoModal from '@/components/VideoModal';
import type { Database } from '@/types/database.types';

type ExclusiveItem = Database['public']['Tables']['exclusive_content']['Row'];

const FALLBACK_EXCLUSIVE_CONTENT: ExclusiveItem[] = [
  {
    id: 'ex-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Webinar Exclusivo: Regulación Emocional y Crisis Sensoriales en Casa',
    description: 'Taller clínico de 75 minutos dirigido por la psicóloga Elena Silva, con casos reales, herramientas de autorregulación y protocolos de desescalamiento sensorial para padres.',
    type: 'webinar',
    video_url: 'https://www.youtube.com/embed/vD5pWKwhNt8?si=_gQcZ3BN5M2RCa-m',
    download_url: '/exclusive/guia_regulacion_sensorial.pdf',
    file_size: '75 min + PDF Guía',
    access_tier: 'subscriber',
    is_published: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    author: 'Dra. Elena Silva',
  },
  {
    id: 'ex-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Kit de Plantillas Sensoriales Imprimibles (35 Pictogramas & Rutinas)',
    description: 'Colección de tableros de anticipación visual, rutinas de mañana/noche y pictogramas de comunicación listos para imprimir en alta resolución y plastificar en casa.',
    type: 'kit_sensorial',
    video_url: null,
    download_url: '/exclusive/kit_pictogramas_hd.pdf',
    file_size: '14.5 MB (PDF HD)',
    access_tier: 'subscriber',
    is_published: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    author: 'María Torres (Terapeuta Ocupacional)',
  },
  {
    id: 'ex-3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Guía Avanzada: Manejo del Duelo Parental y Diagnóstico Tardío',
    description: 'Documento confidencial con ejercicios terapéuticos y cartas guía para procesar el impacto emocional de un diagnóstico neurodivergente en la pareja y la familia.',
    type: 'guia_avanzada',
    video_url: null,
    download_url: '/exclusive/guia_duelo_parental.pdf',
    file_size: '4.2 MB',
    access_tier: 'subscriber',
    is_published: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80',
    author: 'Equipo Clínico Diversamente',
  },
  {
    id: 'ex-4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: 'Círculo Grabado: Solicitud de Adaptaciones Escolares DUA (Plantillas Word)',
    description: 'Encuentro privado donde explicamos cómo exigir legalmente los ajustes razonables en colegios en Colombia, incluyendo modelos editables en Word.',
    type: 'webinar',
    video_url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    download_url: '/exclusive/modelos_cartas_dua.docx',
    file_size: '90 min + Plantillas Word',
    access_tier: 'subscriber',
    is_published: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    author: 'David Chen & María Torres',
  },
];

export default function SuscriptoresPortalPage() {
  const { user, profile, role, isLoading } = useAuth();
  const [contentList, setContentList] = useState<ExclusiveItem[]>(FALLBACK_EXCLUSIVE_CONTENT);
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const { showToast } = useToast();

  const isSubscriberOrAdmin = role === 'subscriber' || role === 'admin';

  useEffect(() => {
    async function loadExclusive() {
      if (supabase && isSupabaseConfigured && isSubscriberOrAdmin) {
        try {
          const { data, error } = await supabase
            .from('exclusive_content')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            setContentList(data);
          }
        } catch (e) {
          console.error('Error fetching exclusive content:', e);
        }
      }
    }
    loadExclusive();
  }, [isSubscriberOrAdmin]);

  const filteredContent = useMemo(() => {
    return contentList.filter((item) => {
      const matchType = selectedType === 'todos' || item.type === selectedType;
      const matchSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [contentList, selectedType, searchQuery]);

  const handleDownload = (item: ExclusiveItem) => {
    showToast(`Iniciando descarga de: ${item.title}`, 'success');
    const blob = new Blob(
      [
        `DIVERSAMENTE - MATERIAL EXCLUSIVO PARA SUSCRIPTORES\n\nTítulo: ${item.title}\nAutor: ${item.author}\nTipo: ${item.type}\n\nDescripción:\n${item.description}\n\nGracias por ser parte de nuestra comunidad de familias.\nContacto: fundiversamente@gmail.com`
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // If user is not logged in / not a subscriber, show gated preview
  if (!isLoading && !isSubscriberOrAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 pb-24">
        {/* Lock Hero */}
        <div className="bg-surface-container-low rounded-3xl p-8 sm:p-14 border border-border shadow-ambient-2 text-center max-w-3xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-xs font-label uppercase tracking-widest text-primary font-bold mb-2">
            Contenido Exclusivo
          </span>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-on-surface mb-4">
            Portal para Familias Suscriptoras
          </h1>
          <p className="text-sm sm:text-base font-body text-on-surface-variant leading-relaxed max-w-xl mb-8">
            Esta sección contiene webinars grabados, kits de pictogramas imprimibles y guías confidenciales de intervención. El acceso es <strong>100% gratuito</strong> para miembros registrados.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login?redirect=/suscriptores"
              className="inline-flex items-center gap-2 bg-primary text-on-primary font-label text-sm font-semibold px-6 py-3.5 rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all"
            >
              <span>Iniciar Sesión</span>
            </Link>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 bg-surface hover:bg-surface-bright text-primary font-label text-sm font-semibold px-6 py-3.5 rounded-xl border border-border transition-all"
            >
              <span>Registrarme Gratis</span>
            </Link>
          </div>
        </div>

        {/* Blurred preview cards */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-xl font-headline font-semibold text-on-surface">
              Vista previa del contenido que desbloquearás:
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-70 filter blur-[1px] pointer-events-none">
            {FALLBACK_EXCLUSIVE_CONTENT.map((item) => (
              <div key={item.id} className="bg-surface rounded-2xl p-5 border border-border">
                <div className="h-32 bg-surface-container-high rounded-xl mb-3" />
                <h4 className="font-headline font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-on-surface-variant line-clamp-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 pb-24">
      {/* Header for Logged-in Subscriber */}
      <div className="bg-surface-container-low rounded-3xl p-8 sm:p-10 border border-border shadow-ambient-1 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-secondary bg-secondary-container px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Suscripción Activa</span>
            </span>
            {role === 'admin' && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary-container text-on-primary-container px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Vista Administrador</span>
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-on-surface">
            Bienvenido, {profile?.full_name || user?.email?.split('@')[0] || 'Suscriptor'}
          </h1>
          <p className="text-xs sm:text-sm font-body text-on-surface-variant mt-1.5 max-w-xl">
            Explora el material exclusivo, grabaciones de especialistas y recursos creados para acompañar a tu hogar.
          </p>
        </div>

        {/* Quick Private Zoom Meeting Banner */}
        <div className="p-4 bg-surface rounded-2xl border border-border shadow-sm flex flex-col gap-2 max-w-xs w-full">
          <div className="flex items-center gap-2 text-xs font-label font-bold text-primary">
            <Calendar className="w-4 h-4 text-secondary" />
            <span>Próximo Círculo Privado</span>
          </div>
          <p className="text-[11px] font-body text-on-surface-variant">
            Sábado 24 de Agosto • 10:00 AM (Zoom en vivo)
          </p>
          <a
            href="https://meet.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 text-xs font-label font-semibold text-secondary hover:underline pt-1 border-t border-border/40"
          >
            <span>Unirme al enlace de sesión</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-surface p-4 rounded-2xl border border-border shadow-ambient-1">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {[
            { key: 'todos', label: 'Todo el Contenido' },
            { key: 'webinar', label: 'Webinars Grabados' },
            { key: 'kit_sensorial', label: 'Kits & Pictogramas' },
            { key: 'guia_avanzada', label: 'Guías Clínicas' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedType(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-label font-semibold transition-all ${
                selectedType === tab.key
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por tema o título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-container-low border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Exclusive Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredContent.map((item) => (
          <div
            key={item.id}
            className="bg-surface rounded-3xl overflow-hidden border border-border shadow-ambient-1 hover:shadow-ambient-2 transition-all flex flex-col group"
          >
            {/* Thumbnail */}
            <div className="relative h-56 w-full bg-surface-container-high overflow-hidden">
              {item.thumbnail_url ? (
                <Image
                  src={item.thumbnail_url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-container-low text-primary">
                  <Layers className="w-12 h-12 opacity-40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />

              <span className="absolute top-4 left-4 bg-surface/90 dark:bg-surface-container/90 backdrop-blur-md text-primary font-label text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                {item.type === 'webinar'
                  ? 'Webinar / Video'
                  : item.type === 'kit_sensorial'
                  ? 'Kit Sensorial'
                  : 'Guía Avanzada'}
              </span>

              {item.video_url && (
                <button
                  onClick={() => setActiveVideo({ url: item.video_url!, title: item.title })}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                  aria-label="Reproducir video"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
                  <span className="font-label font-medium">{item.author}</span>
                  <span className="font-mono text-[11px]">{item.file_size}</span>
                </div>

                <h3 className="text-xl font-headline font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm font-body text-on-surface-variant leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/40 mt-auto">
                {item.video_url && (
                  <button
                    onClick={() => setActiveVideo({ url: item.video_url!, title: item.title })}
                    className="inline-flex items-center gap-2 bg-primary text-on-primary font-label text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Ver Webinar</span>
                  </button>
                )}

                <button
                  onClick={() => handleDownload(item)}
                  className="inline-flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label text-xs font-semibold px-4 py-2.5 rounded-xl border border-border transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-secondary" />
                  <span>Descargar Material</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal
          isOpen={Boolean(activeVideo)}
          onClose={() => setActiveVideo(null)}
          videoUrl={activeVideo.url}
          title={activeVideo.title}
        />
      )}
    </div>
  );
}
