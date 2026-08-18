'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Sobre Nosotros', href: '/nosotros' },
    { name: 'Programas', href: '/programas' },
    { name: 'Recursos', href: '/recursos' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Voluntariado', href: '/voluntariado' },
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
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-label font-medium transition-all duration-200 relative py-1 ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full animate-fadeIn" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Theme Toggle & Donate Button) */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/donar"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-label text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:opacity-95 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
          >
            <Heart className="w-4 h-4 fill-current opacity-80" />
            <span>Donar ahora</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
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
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-label font-medium py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-secondary-container text-on-secondary-container font-semibold'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-border flex flex-col gap-3">
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
