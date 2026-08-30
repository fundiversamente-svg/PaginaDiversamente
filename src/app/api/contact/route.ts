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
        ]);

      if (error) {
        console.error('Supabase contact insert error:', error);
        return NextResponse.json(
          { error: 'Error al guardar el mensaje en Supabase: ' + error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data: { name, email, topic } }, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Base de datos de Supabase no configurada en el servidor' },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor: ' + (error?.message || 'Desconocido') },
      { status: 500 }
    );
  }
}
