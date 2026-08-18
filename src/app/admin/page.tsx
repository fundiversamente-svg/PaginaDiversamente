'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
  PlusCircle,
  Edit,
  Trash2,
  FilePlus,
  Video,
  Layers,
  Sparkles,
  ShieldCheck,
  UserCheck,
  X,
  Save,
  UserPlus,
  KeyRound,
  ShieldAlert,
  Check,
} from 'lucide-react';
import { supabase, isSupabaseConfigured, safeInsert } from '@/lib/supabaseClient';
import { useAuth, checkIsAdmin } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';

export default function AdminPortalPage() {
  const { user, profile, role, isLoading, signOut } = useAuth();
  const [activeMainTab, setActiveMainTab] = useState<'content' | 'inbox' | 'users'>('content');
  const [activeSubTab, setActiveSubTab] = useState<string>('exclusive');
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // Form state for content creation
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'webinar',
    category: 'Acompañamiento Familiar',
    video_url: '',
    download_url: '',
    file_size: '',
    author: 'Equipo Diversamente',
    thumbnail_url: '',
  });

  // Form state for adding new administrator
  const [newAdminData, setNewAdminData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  // Form state for changing personal password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { showToast } = useToast();
  const isAdmin = role === 'admin' || Boolean(user?.email && checkIsAdmin(user.email));

  const loadFromLocal = useCallback((tableName: string) => {
    if (typeof window !== 'undefined') {
      const localKey = `diversamente_local_${tableName}`;
      const saved = JSON.parse(localStorage.getItem(localKey) || '[]');
      setDataList(saved);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    let tableName = 'exclusive_content';

    if (activeMainTab === 'inbox') {
      const inboxMap: Record<string, string> = {
        messages: 'contact_messages',
        inquiries: 'program_inquiries',
        volunteers: 'volunteers',
        donations: 'donations',
      };
      tableName = inboxMap[activeSubTab] || 'contact_messages';
    } else if (activeMainTab === 'content') {
      const contentMap: Record<string, string> = {
        exclusive: 'exclusive_content',
        programs: 'programs_catalog',
        resources: 'resources',
      };
      tableName = contentMap[activeSubTab] || 'exclusive_content';
    } else if (activeMainTab === 'users') {
      tableName = 'profiles';
    }

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
  }, [activeMainTab, activeSubTab, loadFromLocal]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, loadData]);

  // Open modal to create content
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({
      title: '',
      description: '',
      type: 'webinar',
      category: 'Guía',
      video_url: '',
      download_url: '',
      file_size: 'PDF HD',
      author: profile?.full_name || 'Equipo Diversamente',
      thumbnail_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    });
    setIsModalOpen(true);
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      showToast('Por favor completa el título y la descripción', 'error');
      return;
    }

    setLoading(true);
    let targetTable: any = 'exclusive_content';
    if (activeSubTab === 'resources') targetTable = 'resources';

    const newRecord: any = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      video_url: formData.video_url || null,
      download_url: formData.download_url || '#recurso-descargable',
      file_size: formData.file_size || '1.5 MB',
      author: formData.author,
      thumbnail_url: formData.thumbnail_url || null,
      is_published: true,
    };

    if (activeSubTab === 'resources') {
      newRecord.category = formData.category;
      newRecord.file_type = 'PDF';
      newRecord.download_count = 0;
      newRecord.is_featured = true;
    }

    const res = await safeInsert(targetTable, newRecord);
    if (res.success) {
      showToast(`¡Contenido ${modalMode === 'create' ? 'publicado' : 'actualizado'} con éxito!`, 'success');
      setIsModalOpen(false);
      loadData();
    } else {
      showToast(res.error || 'Error al guardar el contenido', 'error');
    }
    setLoading(false);
  };

  // Toggle user role between Admin and Subscriber
  const handleToggleUserRole = async (targetUser: any) => {
    const newRole = targetUser.role === 'admin' ? 'subscriber' : 'admin';
    const confirmMsg = targetUser.role === 'admin'
      ? `¿Deseas revocar los permisos de Administrador a ${targetUser.email}?`
      : `¿Deseas promover a ${targetUser.email} como ADMINISTRADOR con permisos de edición completos?`;

    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await (supabase.from('profiles') as any)
          .update({ role: newRole, membership_tier: newRole === 'admin' ? 'supporter' : 'free' })
          .eq('id', targetUser.id);

        if (error) {
          showToast('Error al actualizar rol: ' + error.message, 'error');
        } else {
          showToast(`Rol de ${targetUser.email} actualizado a ${newRole}`, 'success');
          loadData();
        }
      } catch (err: any) {
        showToast('Error: ' + err.message, 'error');
      }
    } else {
      // Local storage update
      const updated = dataList.map((item) =>
        item.id === targetUser.id ? { ...item, role: newRole } : item
      );
      setDataList(updated);
      localStorage.setItem('diversamente_local_profiles', JSON.stringify(updated));
      showToast(`Rol actualizado localmente a ${newRole}`, 'success');
    }
    setLoading(false);
  };

  // Create new Administrator user
  const handleCreateNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminData.fullName || !newAdminData.email || !newAdminData.password) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }
    if (newAdminData.password.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    setLoading(true);
    const cleanEmail = newAdminData.email.trim().toLowerCase();

    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: newAdminData.password,
          options: {
            data: {
              full_name: newAdminData.fullName.trim(),
              role: 'admin',
            },
          },
        });

        if (error) {
          showToast('Error al crear usuario en Supabase: ' + error.message, 'error');
        } else {
          if (data.user) {
            await (supabase.from('profiles') as any).upsert([
              {
                id: data.user.id,
                email: cleanEmail,
                full_name: newAdminData.fullName.trim(),
                role: 'admin',
                membership_tier: 'supporter',
              },
            ]);
          }
          showToast(`¡Nuevo Administrador ${cleanEmail} creado exitosamente!`, 'success');
          setIsAddAdminModalOpen(false);
          setNewAdminData({ fullName: '', email: '', password: '' });
          loadData();
        }
      } catch (err: any) {
        showToast('Error: ' + err.message, 'error');
      }
    } else {
      // Local mode fallback
      const newMockAdmin = {
        id: `admin-${Date.now()}`,
        email: cleanEmail,
        full_name: newAdminData.fullName.trim(),
        role: 'admin',
        membership_tier: 'supporter',
        created_at: new Date().toISOString(),
      };
      const updated = [newMockAdmin, ...dataList];
      setDataList(updated);
      localStorage.setItem('diversamente_local_profiles', JSON.stringify(updated));
      showToast(`¡Administrador ${cleanEmail} registrado con éxito!`, 'success');
      setIsAddAdminModalOpen(false);
      setNewAdminData({ fullName: '', email: '', password: '' });
    }
    setLoading(false);
  };

  // Change logged-in Administrator password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('La nueva contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    setLoading(true);
    const targetEmail = profile?.email || user?.email || 'fundiversamente@gmail.com';

    if (supabase && isSupabaseConfigured) {
      try {
        // Verificar si hay sesión activa en Supabase Auth
        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData?.session?.user) {
          const { error } = await supabase.auth.updateUser({ password: newPassword });
          if (error) {
            if (error.status === 429 || error.message?.includes('rate limit') || error.message?.includes('429')) {
              showToast('Límite de solicitudes de Supabase alcanzado (Error 429). Espera unos minutos o define la contraseña en el dashboard de Supabase.', 'error');
            } else {
              showToast('Error al actualizar contraseña: ' + error.message, 'error');
            }
          } else {
            showToast('¡Contraseña actualizada con éxito en Supabase!', 'success');
            setIsChangePasswordModalOpen(false);
            setNewPassword('');
            setConfirmPassword('');
          }
        } else {
          // Si no había sesión activa en Supabase Auth, registrar la cuenta con la nueva clave
          const { error: signUpError } = await supabase.auth.signUp({
            email: targetEmail,
            password: newPassword,
            options: {
              data: {
                full_name: 'Administrador Diversamente',
                role: 'admin',
              },
            },
          });

          if (signUpError) {
            if (signUpError.status === 429 || signUpError.message?.includes('rate limit') || signUpError.message?.includes('429')) {
              showToast('Límite de intentos de Supabase alcanzado (429). Puedes configurar la contraseña en el panel de Supabase -> Authentication -> Users.', 'error');
            } else {
              showToast('Nota: ' + signUpError.message, 'info');
            }
          } else {
            showToast('¡Contraseña establecida exitosamente!', 'success');
            setIsChangePasswordModalOpen(false);
            setNewPassword('');
            setConfirmPassword('');
          }
        }
      } catch (err: any) {
        showToast('Error: ' + err.message, 'error');
      }
    } else {
      showToast('Contraseña actualizada correctamente en sesión local', 'success');
      setIsChangePasswordModalOpen(false);
      setNewPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

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
    link.download = `diversamente_${activeMainTab}_${activeSubTab}_${Date.now()}.csv`;
    link.click();
    showToast('Archivo CSV exportado exitosamente', 'success');
  };

  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-label uppercase tracking-wider font-semibold">
            Verificando permisos de acceso...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-surface rounded-3xl p-8 border border-border shadow-ambient-2 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-headline font-semibold text-on-surface mb-2">
            Acceso Restringido
          </h2>
          <p className="text-xs font-body text-on-surface-variant leading-relaxed mb-6">
            Esta sección es exclusiva para el equipo administrador de Diversamente. Debes iniciar sesión con una cuenta autorizada para acceder a las herramientas de edición y bandejas de entrada.
          </p>

          <Link
            href="/login?redirect=/admin"
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-primary text-on-primary font-label text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Iniciar Sesión como Administrador</span>
          </Link>
        </div>
      </div>
    );
  }

  const filteredData = dataList.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary-container text-on-primary-container px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Administrador: {profile?.email || 'fundiversamente@gmail.com'}</span>
            </span>
          </div>
          <h1 className="text-3xl font-headline font-semibold text-on-surface">
            Centro de Gestión y Publicación
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Change Password Button */}
          <button
            onClick={() => setIsChangePasswordModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-border text-xs font-label font-semibold text-on-surface transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-secondary" />
            <span>Cambiar Mi Contraseña</span>
          </button>

          {/* Supabase status */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium border ${
              isSupabaseConfigured
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSupabaseConfigured ? 'Supabase Conectado' : 'Modo Simulación'}</span>
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

      {/* Main Mode Navigation (Content vs Inbox vs Users) */}
      <div className="flex bg-surface-container-low p-1.5 rounded-2xl border border-border mb-8 max-w-xl">
        <button
          onClick={() => {
            setActiveMainTab('content');
            setActiveSubTab('exclusive');
          }}
          className={`flex-1 py-2.5 text-xs font-label font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'content'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Editor de Contenido</span>
        </button>

        <button
          onClick={() => {
            setActiveMainTab('inbox');
            setActiveSubTab('messages');
          }}
          className={`flex-1 py-2.5 text-xs font-label font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'inbox'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Bandeja de Entrada</span>
        </button>

        <button
          onClick={() => {
            setActiveMainTab('users');
            setActiveSubTab('profiles');
          }}
          className={`flex-1 py-2.5 text-xs font-label font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'users'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Usuarios & Administradores</span>
        </button>
      </div>

      {/* Secondary Tabs & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-border pb-4">
        {/* Sub tabs */}
        <div className="flex flex-wrap gap-2">
          {activeMainTab === 'content' && (
            <>
              <button
                onClick={() => setActiveSubTab('exclusive')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-label font-semibold transition-all ${
                  activeSubTab === 'exclusive'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                Contenido Exclusivo Suscriptores
              </button>
              <button
                onClick={() => setActiveSubTab('resources')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-label font-semibold transition-all ${
                  activeSubTab === 'resources'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                Biblioteca de Recursos Públicos
              </button>
            </>
          )}

          {activeMainTab === 'inbox' && (
            <>
              {[
                { key: 'messages', label: 'Mensajes de Contacto', icon: Mail },
                { key: 'inquiries', label: 'Inscripciones a Programas', icon: Calendar },
                { key: 'volunteers', label: 'Voluntariado', icon: Users },
                { key: 'donations', label: 'Donaciones', icon: Heart },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveSubTab(tab.key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-label font-semibold transition-all ${
                    activeSubTab === tab.key
                      ? 'bg-secondary text-on-secondary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </>
          )}

          {activeMainTab === 'users' && (
            <span className="text-xs font-label font-bold text-on-surface self-center">
              Directorio de Usuarios y Gestión de Roles de Administrador
            </span>
          )}
        </div>

        {/* Right action buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {activeMainTab === 'content' && (
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-label font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar Nuevo Material</span>
            </button>
          )}

          {activeMainTab === 'users' && (
            <button
              onClick={() => setIsAddAdminModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-label font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Crear Nuevo Administrador</span>
            </button>
          )}

          <div className="relative flex-grow sm:flex-grow-0 sm:w-56">
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
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Dynamic Data Table / Card list */}
      <div className="bg-surface rounded-2xl border border-border shadow-ambient-1 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-on-surface-variant font-body">
            Cargando registros...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-2 text-on-surface-variant">
            <Clock className="w-8 h-8 opacity-40" />
            <p className="text-sm font-headline font-semibold">No hay registros para mostrar en esta vista.</p>
            <p className="text-xs">
              {activeMainTab === 'content'
                ? 'Haz clic en "Publicar Nuevo Material" para subir tu primer recurso.'
                : activeMainTab === 'users'
                ? 'Haz clic en "Crear Nuevo Administrador" para registrar a otro miembro de tu equipo.'
                : 'Los envíos de visitantes y suscriptores aparecerán aquí.'}
            </p>
          </div>
        ) : activeMainTab === 'users' ? (
          /* Dedicated Users Management View */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-surface-container-low border-b border-border text-on-surface-variant uppercase font-label">
                <tr>
                  <th className="px-5 py-3">Usuario / Nombre</th>
                  <th className="px-5 py-3">Correo Electrónico</th>
                  <th className="px-5 py-3">Fecha de Registro</th>
                  <th className="px-5 py-3">Rol Actual</th>
                  <th className="px-5 py-3 text-right">Acciones de Administrador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredData.map((u) => {
                  const isTargetAdmin = u.role === 'admin' || u.email === 'fundiversamente@gmail.com';
                  const isMainAdmin = u.email === 'fundiversamente@gmail.com';

                  return (
                    <tr key={u.id || u.email} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="px-5 py-4 font-semibold text-on-surface flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                          isTargetAdmin ? 'bg-primary text-on-primary' : 'bg-secondary-container text-secondary'
                        }`}>
                          {u.full_name ? u.full_name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div>{u.full_name || 'Sin nombre'}</div>
                          {isMainAdmin && (
                            <span className="text-[10px] text-primary font-bold">★ Administrador Principal</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-[11px] text-on-surface-variant">
                        {u.email}
                      </td>
                      <td className="px-5 py-4 text-on-surface-variant font-mono text-[11px]">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('es-CO') : 'Reciente'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isTargetAdmin
                            ? 'bg-primary-container text-on-primary-container border border-primary/30'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {isTargetAdmin ? <ShieldCheck className="w-3 h-3 text-primary" /> : <UserCheck className="w-3 h-3 text-secondary" />}
                          <span>{isTargetAdmin ? 'Administrador' : 'Suscriptor'}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {!isMainAdmin && (
                          <button
                            onClick={() => handleToggleUserRole(u)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-label font-semibold transition-all border ${
                              isTargetAdmin
                                ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 hover:bg-red-100'
                                : 'bg-primary text-on-primary hover:opacity-90 border-transparent shadow-sm'
                            }`}
                          >
                            {isTargetAdmin ? 'Revocar Admin' : 'Hacer Administrador'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* General Inbox & Content View */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-surface-container-low border-b border-border text-on-surface-variant uppercase font-label">
                <tr>
                  <th className="px-5 py-3">Fecha / ID</th>
                  <th className="px-5 py-3">Título / Nombre</th>
                  <th className="px-5 py-3">Tipo / Asunto</th>
                  <th className="px-5 py-3">Detalles / Contenido</th>
                  <th className="px-5 py-3">Estado / Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredData.map((row) => (
                  <tr key={row.id || Math.random()} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap text-on-surface-variant font-mono text-[11px]">
                      {row.created_at ? new Date(row.created_at).toLocaleDateString('es-CO') : 'Reciente'}
                    </td>
                    <td className="px-5 py-4 font-medium text-on-surface">
                      <div>{row.title || row.name || row.full_name || row.donor_name || 'Sin nombre'}</div>
                      <div className="text-[11px] text-on-surface-variant font-mono">{row.email || row.donor_email || row.author}</div>
                    </td>
                    <td className="px-5 py-4 text-on-surface">
                      <span className="inline-block px-2 py-0.5 rounded bg-surface-container-low text-primary font-semibold text-[11px]">
                        {row.type || row.topic || row.category || row.membership_tier || 'General'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant max-w-sm leading-relaxed">
                      <p className="line-clamp-2">
                        {row.description || row.message || row.motivation || row.notes || 'Sin descripción adicional.'}
                      </p>
                      {row.amount && (
                        <div className="font-bold text-primary text-xs mt-1">
                          ${parseFloat(row.amount).toLocaleString('es-CO')} {row.currency}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-secondary-container text-on-secondary-container">
                        <CheckCircle className="w-3 h-3" />
                        <span>{row.role || row.status || (row.is_published ? 'Publicado' : 'Borrador')}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal 1: Publicar / Editar Contenido */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dim/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-label uppercase tracking-widest text-primary font-bold">
                Editor de Contenido
              </span>
              <h3 className="text-2xl font-headline font-semibold text-on-surface mt-1">
                {modalMode === 'create' ? 'Publicar Nuevo Material' : 'Editar Material'}
              </h3>
              <p className="text-xs font-body text-on-surface-variant">
                Este material estará disponible para {activeSubTab === 'exclusive' ? 'familias suscriptoras' : 'todos los visitantes'}.
              </p>
            </div>

            <form onSubmit={handleSaveContent} className="space-y-4">
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Título del Material *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej. Taller Clínico: Estrategias de Comunicación en Casa"
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                    Tipo de Material
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="webinar">Webinar / Video Grabado</option>
                    <option value="kit_sensorial">Kit Sensorial / Pictogramas</option>
                    <option value="guia_avanzada">Guía Clínica Avanzada</option>
                    <option value="plantilla">Plantilla Imprimible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                    Autor / Especialista
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Ej. Dra. Elena Silva"
                    className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Descripción Detallada *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explica de qué trata este recurso, qué incluye y a quién va dirigido..."
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                    URL de Video Embed (YouTube/Vimeo)
                  </label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                    Tamaño / Duración
                  </label>
                  <input
                    type="text"
                    value={formData.file_size}
                    onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                    placeholder="Ej. 75 min + PDF HD"
                    className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  URL de Imagen de Portada (Thumbnail)
                </label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-xs font-label font-semibold text-on-surface hover:bg-surface-container-low"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl text-xs font-label font-semibold hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Guardando...' : 'Publicar Material'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Crear Nuevo Administrador */}
      {isAddAdminModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dim/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-border">
            <button
              onClick={() => setIsAddAdminModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-semibold text-on-surface">
                Crear Nuevo Administrador
              </h3>
              <p className="text-xs font-body text-on-surface-variant mt-1">
                Este usuario tendrá acceso total para editar contenidos y ver mensajes.
              </p>
            </div>

            <form onSubmit={handleCreateNewAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={newAdminData.fullName}
                  onChange={(e) => setNewAdminData({ ...newAdminData, fullName: e.target.value })}
                  placeholder="Nombre del nuevo admin"
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                  placeholder="admin2@diversamente.org"
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Contraseña Inicial *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddAdminModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-xs font-label font-semibold text-on-surface hover:bg-surface-container-low"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-on-primary py-2.5 rounded-xl text-xs font-label font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{loading ? 'Creando...' : 'Crear Admin'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Cambiar Mi Contraseña */}
      {isChangePasswordModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dim/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-border">
            <button
              onClick={() => setIsChangePasswordModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-secondary flex items-center justify-center mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-semibold text-on-surface">
                Cambiar Mi Contraseña
              </h3>
              <p className="text-xs font-body text-on-surface-variant mt-1">
                Define una nueva contraseña segura para tu cuenta de Administrador.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Nueva Contraseña *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-1.5">
                  Confirmar Nueva Contraseña *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-xs font-label font-semibold text-on-surface hover:bg-surface-container-low"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-on-primary py-2.5 rounded-xl text-xs font-label font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{loading ? 'Guardando...' : 'Actualizar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
