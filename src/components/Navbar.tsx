'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart, Sparkles, User, LogOut, ShieldCheck, UserCheck, Lock } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, profile, role, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Sobre Nosotros', href: '/nosotros' },
    { name: 'Programas', href: '/programas' },
    { name: 'Recursos', href: '/recursos' },
    { name: 'Suscriptores', href: '/suscriptores', badge: 'Exclusivo' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/90 dark:bg-surface-dim/90 backdrop-blur-md shadow-ambient-1 py-3 border-b border-border/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-2xl font-headline font-semibold text-primary tracking-tight transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <Sparkles className="w-4 h-4 text-secondary" />
          </div>
          <span>Diversamente</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-label font-medium transition-all duration-200 relative py-1 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-primary-container text-on-primary-container">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full animate-fadeIn" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions: Theme Toggle, Auth, Donate */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />

          {/* User Auth Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-surface-container-low hover:bg-surface-container-high border border-border transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold font-mono">
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-label font-semibold text-on-surface max-w-[100px] truncate">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface rounded-2xl p-2 border border-border shadow-ambient-2 z-50 animate-fadeIn font-body text-xs">
                  <div className="px-3 py-2 border-b border-border/50">
                    <p className="font-semibold text-on-surface truncate">{profile?.full_name || 'Mi Cuenta'}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary-container text-on-secondary-container">
                      {role === 'admin' ? 'Administrador' : 'Suscriptor Activo'}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/suscriptores"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container-low hover:text-primary transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-secondary" />
                      <span>Contenido Exclusivo</span>
                    </Link>

                    {role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-primary font-semibold hover:bg-surface-container-low transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Panel de Edición</span>
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-border/50">
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-label font-semibold px-3.5 py-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-low border border-border transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Ingresar</span>
            </Link>
          )}

          {/* Donate Button */}
          <Link
            href="/donar"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-label text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:opacity-95 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
          >
            <Heart className="w-4 h-4 fill-current opacity-80" />
            <span>Donar</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-primary hover:bg-surface-container-low focus:outline-none"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-full bg-surface/98 dark:bg-surface-dim/98 backdrop-blur-xl border-b border-border shadow-ambient-2 px-6 py-6 animate-fadeIn">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-label font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-secondary-container text-on-secondary-container font-semibold'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-border flex flex-col gap-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-on-surface-variant px-3">
                    Sesión iniciada como <strong>{profile?.full_name || user.email}</strong>
                  </div>
                  {role === 'admin' && (
                    <Link
                      href="/admin"
                      className="w-full flex items-center justify-center gap-2 bg-surface-container-low text-primary font-label text-sm font-semibold py-2.5 rounded-lg border border-border"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Panel de Administración</span>
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-label text-xs font-semibold py-2 rounded-lg"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 bg-surface-container-low text-on-surface font-label text-sm font-semibold py-2.5 rounded-lg border border-border"
                >
                  <User className="w-4 h-4" />
                  <span>Iniciar Sesión / Registro</span>
                </Link>
              )}

              <Link
                href="/donar"
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-label text-sm font-semibold py-3 rounded-lg shadow-sm active:scale-95 transition-all"
              >
                <Heart className="w-4 h-4 fill-current opacity-80" />
                <span>Donar ahora</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
