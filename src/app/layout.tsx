import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://diversamente.vercel.app'),
  title: {
    default: 'Diversamente | Alianza de Inclusión Familiar',
    template: '%s | Diversamente',
  },
  description:
    'Espacios de contención, psicología y herramientas prácticas para amar, aceptar y avanzar juntos en la neurodiversidad.',
  keywords: [
    'Diversamente',
    'Neurodiversidad',
    'Autismo',
    'TDAH',
    'Inclusión Familiar',
    'Apoyo a Padres',
    'Terapia Infantil',
    'Talleres Inclusivos',
    'Bogotá',
    'Colombia',
  ],
  authors: [{ name: 'Fundación Diversamente' }],
  creator: 'Diversamente',
  publisher: 'Diversamente',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://diversamente.vercel.app',
    title: 'Diversamente | Amar, aceptar y avanzar juntos',
    description:
      'Acompañamiento integral a familias y personas neurodivergentes. Construyendo un santuario digital y humano de pertenencia.',
    siteName: 'Diversamente',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBcZuIis-sb9UIOfFY3ZCUTe2_xqa3yn-AOE_VVPTxCRmssXFXc0kBwm5ATanxOrytO7jfE3B6beGoHPvzsDCsuE1q093eYYO9v0mEPivvR1C8DUE3Fz940DfSLH_YUXIRDZQxcYt39FwaRpg9xHYBzAwp46Jw4xv4Y2lTtFkjmP8Og_apWf8b0u_FdPkcvCl7AmqHd3gipVEVKCesi33jVrXPaIiRpeRt1z16qoO6DQ2yQM925VLk0Jzo5uEoYChcYd4',
        width: 1200,
        height: 630,
        alt: 'Diversamente - Alianza de Inclusión Familiar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diversamente | Alianza de Inclusión Familiar',
    description: 'Espacios de contención y herramientas para la neurodiversidad.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfcfb' },
    { media: '(prefers-color-scheme: dark)', color: '#131412' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-grow pt-24">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
