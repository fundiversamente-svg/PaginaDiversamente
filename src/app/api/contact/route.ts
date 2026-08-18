import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { createServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = contactSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Datos de contacto inválidos', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { name, email, phone, topic, message } = parseResult.data;
    const supabase = createServerClient();

    if (supabase) {
      const { data, error } = await (supabase.from('contact_messages') as any)
        .insert([
          {
            name,
            email,
            phone: phone || null,
            topic,
            message,
            status: 'unread',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase contact insert error:', error);
        return NextResponse.json(
          { error: 'Error al guardar el mensaje en la base de datos' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data }, { status: 201 });
    }

    // Modo simulación si aún no hay credenciales de Supabase
    return NextResponse.json(
      {
        success: true,
        isMock: true,
        message: 'Mensaje recibido en modo simulación (configura tus llaves de Supabase en .env.local)',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
