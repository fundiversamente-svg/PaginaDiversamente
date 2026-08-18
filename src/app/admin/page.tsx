'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  Users,
  Heart,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  Download,
  Search,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { useToast } from '@/components/Toast';

export default function AdminPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'volunteers' | 'inquiries' | 'donations'>('messages');
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default demo pin: diversamente2024 or 1234
    if (pin === 'diversamente2024' || pin === '1234' || pin === 'admin') {
      setIsAuthenticated(true);
      showToast('Acceso concedido al panel administrativo', 'success');
    } else {
      showToast('PIN incorrecto. Intenta con: diversamente2024', 'error');
    }
  };

  const loadFromLocal = (tableName: string) => {
    if (typeof window !== 'undefined') {
      const localKey = `diversamente_local_${tableName}`;
      const saved = JSON.parse(localStorage.getItem(localKey) || '[]');
      setDataList(saved);
    }
  };

  const loadData = React.useCallback(async () => {
    setLoading(true);
    const tableMap: Record<string, string> = {
      messages: 'contact_messages',
      volunteers: 'volunteers',
      inquiries: 'program_inquiries',
      donations: 'donations',
    };
    const tableName = tableMap[activeTab];

    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from(tableName as any)
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setDataList(data);
        } else {
          loadFromLocal(tableName);
        }
      } catch {
        loadFromLocal(tableName);
      }
    } else {
      loadFromLocal(tableName);
    }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const handleExportCSV = () => {
    if (dataList.length === 0) {
      showToast('No hay datos para exportar', 'info');
      return;
    }
    const headers = Object.keys(dataList[0]).join(',');
    const rows = dataList.map((item) =>
      Object.values(item)
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diversamente_${activeTab}_${Date.now()}.csv`;
    link.click();
    showToast('Archivo CSV exportado exitosamente', 'success');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface rounded-3xl p-8 border border-border shadow-ambient-2 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-headline font-semibold text-primary mb-1">
            Portal Administrativo
          </h2>
          <p className="text-xs font-body text-on-surface-variant mb-6">
            Acceso seguro para el equipo de gestión de Diversamente.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Ingresa tu clave de acceso o PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center px-4 py-3 text-sm bg-surface-container-low border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <p className="text-[11px] text-on-surface-variant/70 mt-1">
                PIN de acceso de demostración: <code className="text-primary font-mono">diversamente2024</code>
              </p>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary text-on-primary font-label text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              Ingresar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredData = dataList.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 pb-20">
      {/* Header with status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-label uppercase tracking-widest text-primary font-bold">
            Gestión Interna
          </span>
          <h1 className="text-3xl font-headline font-semibold text-on-surface">
            Panel de Mensajes y Solicitudes
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Supabase status indicator */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium border ${
              isSupabaseConfigured
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>
              {isSupabaseConfigured
                ? 'Supabase: Conectado en Vivo'
                : 'Modo Local / Esperando llaves Supabase'}
            </span>
          </div>

          <button
            onClick={loadData}
            className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant transition-colors"
            title="Refrescar datos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-border pb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'messages', label: 'Mensajes de Contacto', icon: Mail },
            { key: 'inquiries', label: 'Inscripciones a Programas', icon: Calendar },
            { key: 'volunteers', label: 'Postulaciones Voluntariado', icon: Users },
            { key: 'donations', label: 'Intenciones de Donación', icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-label font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-60">
            <Search className="w-3.5 h-3.5 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar registros..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-container-low border border-border rounded-lg text-on-surface focus:outline-none"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-border text-xs font-label font-semibold text-on-surface"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-ambient-1 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-on-surface-variant font-body">
            Cargando registros...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-2 text-on-surface-variant">
            <Clock className="w-8 h-8 opacity-40" />
            <p className="text-sm font-headline">Aún no hay registros en esta sección.</p>
            <p className="text-xs">Los nuevos envíos de formularios aparecerán aquí en tiempo real.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-surface-container-low border-b border-border text-on-surface-variant uppercase font-label">
                <tr>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Nombre / Contacto</th>
                  <th className="px-5 py-3">Detalle / Asunto</th>
                  <th className="px-5 py-3">Mensaje / Notas</th>
                  <th className="px-5 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredData.map((row) => (
                  <tr key={row.id || Math.random()} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap text-on-surface-variant font-mono text-[11px]">
                      {row.created_at ? new Date(row.created_at).toLocaleDateString('es-CO') : 'Reciente'}
                    </td>
                    <td className="px-5 py-4 font-medium text-on-surface">
                      <div>{row.name || row.full_name || row.donor_name || 'Anónimo'}</div>
                      <div className="text-[11px] text-on-surface-variant font-mono">{row.email || row.donor_email}</div>
                      {row.phone && <div className="text-[11px] text-secondary font-mono">{row.phone}</div>}
                    </td>
                    <td className="px-5 py-4 text-on-surface">
                      {row.topic && <span className="font-semibold text-primary">{row.topic}</span>}
                      {row.program_name && (
                        <div>
                          <span className="font-semibold text-primary">{row.program_name}</span>
                          <div className="text-[10px] text-on-surface-variant">Modalidad: {row.preferred_modality}</div>
                        </div>
                      )}
                      {row.amount && (
                        <div className="font-bold text-primary">
                          ${parseFloat(row.amount).toLocaleString('es-CO')} {row.currency} ({row.frequency})
                        </div>
                      )}
                      {row.skills && Array.isArray(row.skills) && (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {row.skills.map((s: string, idx: number) => (
                            <span key={idx} className="bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant max-w-sm leading-relaxed">
                      <p className="line-clamp-3">{row.message || row.motivation || row.notes || 'Sin comentarios adicionales.'}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-secondary-container text-on-secondary-container">
                        <CheckCircle className="w-3 h-3" />
                        <span>{row.status || 'recibido'}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
