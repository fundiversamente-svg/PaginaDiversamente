'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Heart,
  Sparkles,
  User,
  LogOut,
  ShieldCheck,
  UserCheck,
  Lock,
  Layers,
  Home,
  Info,
  BookOpen,
  FolderHeart,
  MessageCircle,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth, checkIsAdmin } from '@/context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, profile, role, signOut } = useAuth();

  const isAdministrator = role === 'admin' || Boolean(user?.email && checkIsAdmin(user.email));

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

  // Lock body scroll when mobile menu is open to prevent page movement behind it
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Sobre Nosotros', href: '/nosotros', icon: Info },
    { name: 'Programas', href: '/programas', icon: FolderHeart },
    { name: 'Recursos', href: '/recursos', icon: BookOpen },
    { name: 'Suscriptores', href: '/suscriptores', badge: 'Exclusivo', icon: Sparkles },
    { name: 'Contacto', href: '/contacto', icon: MessageCircle },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-surface/95 dark:bg-surface-dim/95 backdrop-blur-md shadow-ambient-1 py-3 border-b border-border/40'
            : 'bg-surface/90 dark:bg-surface-dim/90 backdrop-blur-sm sm:bg-transparent py-3 sm:py-5 border-b border-border/20 sm:border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand / Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 text-xl sm:text-2xl font-headline font-semibold text-primary tracking-tight transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0">
              <Sparkles className="w-4 h-4 text-secondary" />
            </div>
            <span className="truncate font-headline font-bold">Diversamente</span>
          </Link>

          {/* Desktop Navigation Links (>= 1024px) */}
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

            {/* Dedicated visible Admin Link in Navbar when logged in as admin */}
            {isAdministrator && (
              <Link
                href="/admin"
                className={`text-xs font-label font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                  pathname === '/admin'
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Panel Admin</span>
              </Link>
            )}
          </nav>

          {/* Desktop Actions (>= 1024px) */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            {/* User Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-surface-container-low hover:bg-surface-container-high border border-border transition-all"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                    isAdministrator ? 'bg-primary text-on-primary' : 'bg-secondary text-on-secondary'
                  }`}>
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
                      <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        isAdministrator ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container'
                      }`}>
                        {isAdministrator ? <ShieldCheck className="w-3 h-3 text-primary" /> : <UserCheck className="w-3 h-3 text-secondary" />}
                        <span>{isAdministrator ? 'Administrador' : 'Suscriptor Activo'}</span>
                      </span>
                    </div>

                    <div className="py-1">
                      {isAdministrator && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-primary font-bold bg-primary/10 hover:bg-primary/20 transition-colors mb-1"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Panel de Administración</span>
                        </Link>
                      )}

                      <Link
                        href="/suscriptores"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container-low hover:text-primary transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-secondary" />
                        <span>Contenido Exclusivo</span>
                      </Link>
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

          {/* Mobile hamburger controls (< 1024px) */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-primary bg-surface-container-low hover:bg-surface-container-high border border-border focus:outline-none transition-colors"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Modern Mobile Slide-Over Drawer with Dark Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn" role="dialog" aria-modal="true">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-surface shadow-2xl border-l border-border flex flex-col justify-between overflow-y-auto p-6 animate-slideInRight z-50">
            {/* Top drawer header */}
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <Sparkles className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="font-headline font-bold text-lg text-primary">Diversamente</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                  aria-label="Cerrar menú"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Admin Quick Action Button on Mobile if Admin */}
              {isAdministrator && (
                <div className="mt-4">
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-label text-sm font-bold py-3 rounded-2xl shadow-sm border border-primary-container"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Panel de Administración</span>
                  </Link>
                </div>
              )}

              {/* Navigation links */}
              <nav className="flex flex-col gap-1.5 mt-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-sm font-label font-medium py-3 px-3.5 rounded-xl transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-secondary-container text-on-secondary-container font-bold shadow-xs'
                          : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-secondary' : 'opacity-70'}`} />
                        <span>{link.name}</span>
                      </div>
                      {link.badge && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Drawer Footer: User status & CTA */}
            <div className="pt-6 border-t border-border flex flex-col gap-3 mt-6">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="p-3 bg-surface-container-low rounded-2xl border border-border text-xs text-on-surface-variant">
                    <p className="font-semibold text-on-surface truncate text-sm">{profile?.full_name || 'Mi Cuenta'}</p>
                    <p className="text-[11px] truncate opacity-80">{user.email}</p>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                      isAdministrator ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container'
                    }`}>
                      {isAdministrator ? 'Administrador' : 'Suscriptor Activo'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-label text-xs font-semibold py-2.5 rounded-xl border border-red-200/50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label text-sm font-semibold py-3 rounded-xl border border-border transition-colors"
                >
                  <User className="w-4 h-4 text-on-surface-variant" />
                  <span>Ingresar a mi Cuenta</span>
                </Link>
              )}

              <Link
                href="/donar"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-label text-sm font-semibold py-3 rounded-xl shadow-sm text-center"
              >
                <Heart className="w-4 h-4 fill-current opacity-80" />
                <span>Donar al Proyecto</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
