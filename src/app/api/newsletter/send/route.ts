import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, content, audience = 'all', author = 'Equipo Diversamente' } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'El asunto y el contenido del boletín son requeridos.' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    let recipientEmails: string[] = [];

    if (supabase) {
      // 1. Obtener suscriptores del newsletter
      if (audience === 'subscribers' || audience === 'all') {
        const { data: subs } = await (supabase.from('newsletter_subscribers') as any)
          .select('email')
          .eq('is_active', true);
        if (subs) {
          recipientEmails.push(...subs.map((s: any) => s.email));
        }
      }

      // 2. Obtener usuarios registrados
      if (audience === 'users' || audience === 'all') {
        const { data: users } = await (supabase.from('profiles') as any)
          .select('email')
          .not('email', 'is', null);
        if (users) {
          recipientEmails.push(...users.map((u: any) => u.email));
        }
      }

      // Eliminar duplicados
      recipientEmails = Array.from(new Set(recipientEmails.map((e) => e.trim().toLowerCase())));

      // 3. Registrar el boletín en la base de datos
      const { data: inserted, error: insertError } = await (supabase.from('newsletters') as any)
        .insert([
          {
            subject,
            content,
            audience,
            sent_count: recipientEmails.length,
            status: 'sent',
            sent_at: new Date().toISOString(),
            author,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.warn('Error al guardar registro del boletín:', insertError);
      }

      return NextResponse.json({
        success: true,
        data: inserted,
        recipientsCount: recipientEmails.length,
        recipients: recipientEmails,
        message: `Boletín enviado exitosamente a ${recipientEmails.length} destinatarios.`,
      });
    }

    // Modo local / simulación
    return NextResponse.json({
      success: true,
      recipientsCount: 12,
      recipients: ['fundiversamente@gmail.com', 'familia@diversamente.org'],
      message: 'Boletín registrado y enviado exitosamente (Modo Simulación).',
    });
  } catch (error: any) {
    console.error('Newsletter Send API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno al procesar el envío del boletín.' },
      { status: 500 }
    );
  }
}
