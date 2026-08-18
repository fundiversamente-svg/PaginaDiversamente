import { NextResponse } from 'next/server';
import { volunteerSchema } from '@/lib/validations';
import { createServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = volunteerSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Datos de voluntariado inválidos', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const supabase = createServerClient();

    if (supabase) {
      const { data: inserted, error } = await (supabase.from('volunteers') as any)
        .insert([
          {
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            city: data.city,
            occupation: data.occupation || null,
            skills: data.skills,
            availability: data.availability,
            motivation: data.motivation,
            status: 'received',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase volunteer error:', error);
        return NextResponse.json(
          { error: 'Error al registrar la postulación' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data: inserted }, { status: 201 });
    }

    return NextResponse.json({ success: true, isMock: true }, { status: 200 });
  } catch (error) {
    console.error('Volunteer API Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
