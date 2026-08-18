import { NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validations';
import { createServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = newsletterSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Correo electrónico inválido' },
        { status: 400 }
      );
    }

    const { email } = parseResult.data;
    const supabase = createServerClient();

    if (supabase) {
      const { data: inserted, error } = await (supabase.from('newsletter_subscribers') as any)
        .insert([{ email, is_active: true }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return NextResponse.json(
            { success: true, message: 'Ya estás suscrito al boletín' },
            { status: 200 }
          );
        }
        return NextResponse.json(
          { error: 'Error al registrar suscripción' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data: inserted }, { status: 201 });
    }

    return NextResponse.json({ success: true, isMock: true }, { status: 200 });
  } catch (error) {
    console.error('Newsletter API Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
