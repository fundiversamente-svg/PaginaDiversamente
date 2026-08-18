import { NextResponse } from 'next/server';
import { programInquirySchema } from '@/lib/validations';
import { createServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = programInquirySchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Datos de consulta inválidos', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const supabase = createServerClient();

    if (supabase) {
      const { data: inserted, error } = await (supabase.from('program_inquiries') as any)
        .insert([
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
            program_id: data.program_id,
            program_name: data.program_name,
            preferred_modality: data.preferred_modality,
            notes: data.notes || null,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase inquiry error:', error);
        return NextResponse.json(
          { error: 'Error al registrar la consulta del programa' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data: inserted }, { status: 201 });
    }

    return NextResponse.json({ success: true, isMock: true }, { status: 200 });
  } catch (error) {
    console.error('Inquiry API Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
