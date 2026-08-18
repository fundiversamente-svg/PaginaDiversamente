'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Play,
  Heart,
  Brain,
  Sparkles,
  Users,
  Shield,
  BookOpen,
  Quote,
  ChevronRight,
  Smile,
} from 'lucide-react';
import VideoModal from '@/components/VideoModal';
import { PROGRAMS, TESTIMONIALS, IMPACT_STATS } from '@/lib/mockData';
import ProgramInquiryModal from '@/components/ProgramInquiryModal';
import type { Program } from '@/lib/mockData';

export default function HomePage() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const featuredPrograms = PROGRAMS.slice(0, 3);

  return (
    <div className="flex flex-col gap-20 sm:gap-28 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        {/* Ambient Organic Background Blurs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
          <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-secondary-container rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-morph" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-primary-container rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen opacity-60 animate-morph" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label text-xs font-semibold tracking-wide shadow-sm">
                <Brain className="w-4 h-4 text-secondary" />
                <span>Apoyo y Acompañamiento Neuroafirmativo</span>
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-headline font-bold text-on-surface leading-[1.2] text-balance">
                Amar, aceptar y avanzar{' '}
                <span className="text-primary italic relative inline-block">
                  juntos
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-tertiary/60 rounded-full" />
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg font-body text-on-surface-variant max-w-xl leading-relaxed">
                Brindamos espacios de contención y herramientas prácticas, elocuentes y efectivas para aceptar, comprender y acompañar la neurodiversidad con empatía, profesionalismo y calidez humana.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
                <Link
                  href="/programas"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label text-sm font-semibold px-6 py-3.5 rounded-xl shadow-ambient-1 hover:opacity-90 active:scale-95 transition-all"
                >
                  <span>Nuestros Programas</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setVideoOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label text-sm font-semibold px-5 py-3.5 rounded-xl border border-border transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 text-primary fill-primary/20" />
                  <span>Ver Presentación</span>
                </button>
              </div>

              {/* Trust badge */}
              <div className="flex items-center gap-4 pt-4 border-t border-border/40 text-xs text-on-surface-variant">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-secondary-container border-2 border-surface flex items-center justify-center text-[10px] font-bold text-secondary">
                    FAM
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary-container border-2 border-surface flex items-center justify-center text-[10px] font-bold text-on-primary-container">
                    PSI
                  </div>
                  <div className="w-8 h-8 rounded-full bg-tertiary-container border-2 border-surface flex items-center justify-center text-[10px] font-bold text-on-tertiary-container">
                    DOC
                  </div>
                </div>
                <span>Más de 450 familias confían en nuestra comunidad</span>
              </div>
            </div>

            {/* Right Visual Image / Organic Logo */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                <div className="absolute inset-0 bg-surface-container-low organic-shape-1 opacity-90 border border-border shadow-ambient-2" />
                <div className="absolute inset-4 bg-surface-container organic-shape-2 opacity-60" />
                <div className="relative z-10 p-8 flex flex-col items-center text-center">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBcZuIis-sb9UIOfFY3ZCUTe2_xqa3yn-AOE_VVPTxCRmssXFXc0kBwm5ATanxOrytO7jfE3B6beGoHPvzsDCsuE1q093eYYO9v0mEPivvR1C8DUE3Fz940DfSLH_YUXIRDZQxcYt39FwaRpg9xHYBzAwp46Jw4xv4Y2lTtFkjmP8Og_apWf8b0u_FdPkcvCl7AmqHd3gipVEVKCesi33jVrXPaIiRpeRt1z16qoO6DQ2yQM925VLk0Jzo5uEoYChcYd4"
                      alt="Diversamente Logo Oficial"
                      fill
                      sizes="(max-width: 768px) 192px, 224px"
                      className="object-contain drop-shadow-md"
                      priority
                    />
                  </div>
                  <span className="text-xs font-label uppercase tracking-widest text-primary font-bold mt-2">
                    Alianza de Inclusión Familiar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NUESTRA MISIÓN & VIDEO PRESENTATION */}
      <section id="mision" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-surface-container-low rounded-3xl p-8 sm:p-14 border border-border shadow-ambient-1 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center shadow-sm border border-border mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <span className="text-xs font-label uppercase tracking-widest text-primary font-bold mb-2">
            Nuestra Misión
          </span>
          <h2 className="text-3xl sm:text-4xl font-headline font-semibold text-on-surface max-w-2xl mb-4">
            Conoce nuestro impacto y la forma en que acompañamos vidas
          </h2>
          <p className="text-base font-body text-on-surface-variant max-w-2xl leading-relaxed mb-8">
            Brindamos un acompañamiento integral y respetuoso a familias y personas neurodivergentes, transformando vidas a través de la comprensión, el profesionalismo y el amor incondicional.
          </p>

          {/* Video Preview Card */}
          <div
            onClick={() => setVideoOpen(true)}
            className="group relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-ambient-2 border border-border cursor-pointer bg-surface-container-high"
          >
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNkiVivC-BJEDIS5_LebPoMUechKRKR-VdLpBhvMMdIxblT7FySy7zG1Bohmmjs-23jnIgzdVC_JonaRl9ukLVfJya_Qm2FUnX2esA-KbgktEmWubOt6XmTGf5CZ5u6yuNyN4tJVH0zuwLRkp9GLisu-u6JN0e3qtKR1lFlRjbWaquPikTbNceYWttGr1WXrAOARjXShLCLUHq2bZJsVUWYCkk7V5CSiPzpr9ktpYMkU5RCNWiY8mxKg"
              alt="Video de presentación Diversamente"
              fill
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-transform duration-300">
                <Play className="w-7 h-7 fill-current ml-1" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-surface/90 dark:bg-surface-dim/90 backdrop-blur-md p-3 rounded-xl border border-border flex items-center justify-between text-xs font-body">
              <span className="font-semibold text-primary">Video Institucional: Diversamente</span>
              <span className="text-on-surface-variant">Clic para reproducir (2:45 min)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. IMPACT STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {IMPACT_STATS.map((stat, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 bg-surface rounded-2xl border border-border shadow-ambient-1 flex flex-col justify-center text-center sm:text-left"
            >
              <div className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-label font-semibold text-on-surface mb-1">
                {stat.label}
              </div>
              <div className="text-xs font-body text-on-surface-variant leading-relaxed">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PROGRAMAS DESTACADOS (Bento Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-label uppercase tracking-widest text-primary font-bold">
              Caminos de Acompañamiento
            </span>
            <h2 className="text-3xl sm:text-4xl font-headline font-semibold text-on-surface mt-1">
              Programas Destacados
            </h2>
          </div>
          <Link
            href="/programas"
            className="inline-flex items-center gap-1.5 text-sm font-label font-semibold text-primary hover:underline decoration-tertiary"
          >
            <span>Ver todos los programas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Card (Spans 2 columns) */}
          <div className="lg:col-span-2 relative min-h-[380px] rounded-2xl overflow-hidden shadow-ambient-1 border border-border group flex flex-col justify-end p-6 sm:p-8 bg-surface-container-high">
            <Image
              src={featuredPrograms[0].image}
              alt={featuredPrograms[0].title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
            
            <div className="relative z-10 flex flex-col items-start">
              <span className="inline-block px-3 py-1 bg-surface-container/90 backdrop-blur-md rounded-full text-xs font-label font-semibold text-primary mb-3">
                {featuredPrograms[0].category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-headline font-semibold text-on-surface mb-2">
                {featuredPrograms[0].title}
              </h3>
              <p className="text-sm font-body text-on-surface-variant max-w-xl mb-4 leading-relaxed">
                {featuredPrograms[0].shortDescription}
              </p>
              <button
                onClick={() => setSelectedProgram(featuredPrograms[0])}
                className="inline-flex items-center gap-2 bg-primary text-on-primary font-label text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                <span>Consultar este programa</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Secondary Cards Column */}
          <div className="flex flex-col gap-6">
            {featuredPrograms.slice(1, 3).map((prog) => (
              <div
                key={prog.id}
                className="p-6 bg-surface rounded-2xl border border-border shadow-ambient-1 hover:border-primary/40 transition-all flex flex-col justify-between flex-grow group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-secondary-container text-secondary flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-label text-primary font-semibold block mb-1">
                    {prog.category}
                  </span>
                  <h3 className="text-xl font-headline font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">
                    {prog.title}
                  </h3>
                  <p className="text-xs font-body text-on-surface-variant leading-relaxed mb-4">
                    {prog.shortDescription}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedProgram(prog)}
                  className="inline-flex items-center gap-1 text-xs font-label font-semibold text-primary hover:underline mt-auto w-fit"
                >
                  <span>Saber más e inscribirme</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PILARES & FILOSOFÍA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-label uppercase tracking-widest text-primary font-bold">
            Nuestros Pilares
          </span>
          <h2 className="text-3xl sm:text-4xl font-headline font-semibold text-on-surface mt-1">
            La Filosofía del Crecimiento Nutrido
          </h2>
          <p className="text-sm font-body text-on-surface-variant mt-2">
            Rechazamos las transiciones agresivas. Nuestro enfoque centrado en lo humano significa que escuchamos antes de guiar y aceptamos antes de actuar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-surface-container-low rounded-2xl border border-border shadow-ambient-1 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary-container text-secondary flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-headline font-semibold text-primary">Claridad</h3>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed">
              Proporcionando caminos claros, herramientas basadas en evidencia y desmitificación de diagnósticos a través de desafíos complejos.
            </p>
          </div>

          <div className="p-8 bg-surface-container-low rounded-2xl border border-border shadow-ambient-1 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
              <Smile className="w-6 h-6 text-tertiary" />
            </div>
            <h3 className="text-xl font-headline font-semibold text-primary">Pertenencia</h3>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed">
              Fomentando espacios seguros donde las personas y familias son intrínsecamente valoradas tal como son, sin máscaras ni juicios.
            </p>
          </div>

          <div className="p-8 bg-surface-container-low rounded-2xl border border-border shadow-ambient-1 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
              <Shield className="w-6 h-6 text-on-primary-container" />
            </div>
            <h3 className="text-xl font-headline font-semibold text-primary">Apoyo</h3>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed">
              Empoderando a padres y cuidadores con orientación tangible, redes afectivas y acompañamiento profesional constante.
            </p>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-surface-container-low rounded-3xl p-8 sm:p-14 border border-border shadow-ambient-1 relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Quote className="w-6 h-6 fill-current" />
            </div>

            <p className="text-xl sm:text-2xl font-headline italic text-on-surface leading-relaxed mb-8">
              &ldquo;{TESTIMONIALS[0].content}&rdquo;
            </p>

            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary">
                <Image
                  src={TESTIMONIALS[0].avatar}
                  alt={TESTIMONIALS[0].author}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <div className="font-label font-bold text-sm text-on-surface">
                  {TESTIMONIALS[0].author}
                </div>
                <div className="font-caption text-xs text-on-surface-variant">
                  {TESTIMONIALS[0].role}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION (DONAR & VOLUNTARIADO) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-primary-container text-on-primary-container rounded-3xl p-8 sm:p-14 shadow-ambient-2 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-primary-container bg-white/20 px-3 py-1 rounded-full mb-4">
              Sé parte del cambio
            </span>
            <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-3">
              ¿Listo para avanzar juntos?
            </h2>
            <p className="text-sm font-body text-on-primary-container/90 leading-relaxed">
              Ya sea que necesites acompañamiento para tu familia, desees ser voluntario o quieras realizar una donación para becar a otros hogares, tu presencia hace la diferencia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              href="/donar"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface text-primary font-label text-sm font-semibold px-6 py-3.5 rounded-xl shadow-md hover:bg-surface-bright active:scale-95 transition-all"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Hacer una Donación</span>
            </Link>
            <Link
              href="/contacto"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent text-on-primary-container border border-on-primary-container/40 font-label text-sm font-semibold px-6 py-3.5 rounded-xl hover:bg-white/10 active:scale-95 transition-all"
            >
              <span>Escríbenos</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Modales */}
      <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
      <ProgramInquiryModal
        isOpen={Boolean(selectedProgram)}
        onClose={() => setSelectedProgram(null)}
        program={selectedProgram}
      />
    </div>
  );
}
