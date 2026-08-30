'use client';

import React, { useState } from 'react';
import { Heart, Check, Copy, CheckCheck, Sparkles, ShieldCheck, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from './Toast';
import { safeInsert } from '@/lib/supabaseClient';

const PRESET_AMOUNTS = [
  { amount: 25000, label: '$25.000', impact: 'Materiales didácticos y sensoriales para 1 niño en talleres' },
  { amount: 50000, label: '$50.000', impact: '1 sesión de contención y orientación psicológica a una familia' },
  { amount: 100000, label: '$100.000', impact: 'Beca mensual de acompañamiento en grupo de Red de Apoyo' },
  { amount: 250000, label: '$250.000', impact: 'Capacitación completa para una institución educativa' },
];

export default function DonationModule() {
  const [selectedAmount, setSelectedAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<'one_time' | 'monthly'>('one_time');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'nequi' | 'bancolombia' | 'daviplata' | 'card'>('nequi');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();

  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Número copiado: ${text}`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handlePledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount < 5000) {
      showToast('El monto mínimo es de $5.000 COP', 'error');
      return;
    }
    if (!donorName.trim() || !donorEmail.trim()) {
      showToast('Por favor completa tu nombre y correo', 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await safeInsert('donations', {
        donor_name: isAnonymous ? 'Donante Anónimo' : donorName.trim(),
        donor_email: donorEmail.trim().toLowerCase(),
        donor_phone: null,
        amount: currentAmount,
        currency: 'COP',
        frequency,
        payment_method: paymentMethod,
        transaction_reference: `DON-${Date.now()}`,
        is_anonymous: isAnonymous,
        status: 'pledged',
        message: null,
      });

      if (res.success) {
        setIsSuccess(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f4ba9c', '#c0cba7', '#e9c349', '#8c5e45'],
        });
        showToast('¡Gracias por tu inmenso apoyo a Diversamente!', 'success');
      } else {
        showToast(res.error || 'Error al procesar el registro de donación', 'error');
      }
    } catch {
      showToast('Error al conectar. Inténtalo de nuevo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-border shadow-ambient-2 max-w-4xl mx-auto">
      {isSuccess ? (
        <div className="py-12 text-center flex flex-col items-center gap-5 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-secondary" />
          </div>
          <h3 className="text-3xl font-headline font-semibold text-primary">
            ¡De todo corazón, muchas gracias!
          </h3>
          <p className="text-base font-body text-on-surface-variant max-w-lg leading-relaxed">
            Tu contribución de <strong>${currentAmount.toLocaleString('es-CO')} COP</strong> nos permite continuar brindando apoyo terapéutico y emocional a familias que lo necesitan.
          </p>
          <div className="p-4 bg-surface-container-low rounded-xl border border-border text-xs text-on-surface-variant max-w-md">
            Hemos enviado un comprobante y los detalles de confirmación a <strong>{donorEmail}</strong>.
          </div>
          <button
            onClick={() => setIsSuccess(false)}
            className="mt-4 px-8 py-3 bg-primary text-on-primary font-label text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
          >
            Realizar otra donación
          </button>
        </div>
      ) : (
        <form onSubmit={handlePledge} className="space-y-8">
          {/* Step 1: Frequency */}
          <div className="flex justify-center">
            <div className="inline-flex bg-surface-container-low p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setFrequency('one_time')}
                className={`px-5 py-2 rounded-lg text-sm font-label font-semibold transition-all ${
                  frequency === 'one_time'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Donación Única
              </button>
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`px-5 py-2 rounded-lg text-sm font-label font-semibold transition-all ${
                  frequency === 'monthly'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Donación Mensual Recurrente
              </button>
            </div>
          </div>

          {/* Step 2: Amount selection */}
          <div>
            <label className="block text-center text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant mb-4">
              Selecciona el monto de tu aporte (COP)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {PRESET_AMOUNTS.map((item) => (
                <button
                  key={item.amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(item.amount);
                    setCustomAmount('');
                  }}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    selectedAmount === item.amount && !customAmount
                      ? 'border-primary bg-primary-container text-on-primary-container font-bold shadow-sm scale-[1.02]'
                      : 'border-border bg-surface-container-low text-on-surface hover:border-primary/50'
                  }`}
                >
                  <div className="text-lg font-headline font-bold">{item.label}</div>
                </button>
              ))}
            </div>

            {/* Custom Amount input */}
            <div className="max-w-xs mx-auto">
              <input
                type="number"
                min="5000"
                step="5000"
                placeholder="Otro valor (ej. 75000)"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
                className="w-full text-center px-4 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Impact indicator */}
            <div className="mt-4 p-3 bg-secondary-container/50 border border-secondary/20 rounded-xl text-center text-xs text-on-secondary-container font-body flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-secondary fill-current flex-shrink-0" />
              <span>
                {customAmount
                  ? `Tu aporte de $${(parseFloat(customAmount) || 0).toLocaleString('es-CO')} COP apoya directamente a las familias de Diversamente.`
                  : PRESET_AMOUNTS.find((p) => p.amount === selectedAmount)?.impact}
              </span>
            </div>
          </div>

          {/* Step 3: Payment Accounts & Gateways */}
          <div>
            <label className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface mb-3">
              Cuentas para transferencia directa (100% libre de comisiones)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Nequi */}
              <div className="p-4 bg-surface-container-low rounded-xl border border-border flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-primary">Nequi</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">318 571 3991</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('3185713991', 'nequi')}
                  className="inline-flex items-center justify-center gap-1.5 text-xs text-primary hover:underline font-label mt-1"
                >
                  {copiedKey === 'nequi' ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'nequi' ? 'Copiado' : 'Copiar número'}</span>
                </button>
              </div>

              {/* Bancolombia */}
              <div className="p-4 bg-surface-container-low rounded-xl border border-border flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-primary">Bancolombia</span>
                  <span className="text-xs text-on-surface-variant font-mono">Ahorros</span>
                </div>
                <div className="text-xs font-mono text-on-surface">Cta: 108-928374-12</div>
                <button
                  type="button"
                  onClick={() => handleCopy('10892837412', 'bancolombia')}
                  className="inline-flex items-center justify-center gap-1.5 text-xs text-primary hover:underline font-label mt-1"
                >
                  {copiedKey === 'bancolombia' ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'bancolombia' ? 'Copiado' : 'Copiar cuenta'}</span>
                </button>
              </div>

              {/* Daviplata */}
              <div className="p-4 bg-surface-container-low rounded-xl border border-border flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-primary">Daviplata</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">318 571 3991</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('3185713991', 'daviplata')}
                  className="inline-flex items-center justify-center gap-1.5 text-xs text-primary hover:underline font-label mt-1"
                >
                  {copiedKey === 'daviplata' ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'daviplata' ? 'Copiado' : 'Copiar número'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Step 4: Donor Info & Confirmation */}
          <div className="pt-4 border-t border-border space-y-4">
            <h4 className="text-sm font-label font-bold uppercase tracking-wider text-on-surface">
              Datos de Confirmación y Recibo
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-label text-on-surface mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="block text-xs font-label text-on-surface mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="tu.correo@ejemplo.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border border-border rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-on-surface-variant font-body">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded text-primary focus:ring-primary/40"
              />
              <span>Deseo que mi donación se mantenga anónima en los reportes públicos</span>
            </label>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label text-base font-semibold py-4 rounded-xl hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all shadow-ambient-1"
              >
                <Heart className="w-5 h-5 fill-current" />
                <span>
                  {loading ? 'Procesando...' : `Confirmar Intención de Donación ($${currentAmount.toLocaleString('es-CO')} COP)`}
                </span>
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs text-on-surface-variant/70 font-body">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>Transacciones seguras y transparentes auditadas por Diversamente</span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
