import { NextResponse } from 'next/server';
import { donationSchema } from '@/lib/validations';
import { createServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = donationSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Datos de donación inválidos', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const supabase = createServerClient();

    if (supabase) {
      const { data: inserted, error } = await (supabase.from('donations') as any)
        .insert([
          {
            donor_name: data.is_anonymous ? 'Donante Anónimo' : data.donor_name,
            donor_email: data.donor_email,
            donor_phone: data.donor_phone || null,
            amount: data.amount,
            currency: data.currency,
            frequency: data.frequency,
            payment_method: data.payment_method,
            transaction_reference: `DON-${Date.now()}`,
            is_anonymous: data.is_anonymous,
            status: 'pledged',
            message: data.message || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase donation error:', error);
        return NextResponse.json(
          { error: 'Error al registrar la donación' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data: inserted }, { status: 201 });
    }

    return NextResponse.json({ success: true, isMock: true }, { status: 200 });
  } catch (error) {
    console.error('Donation API Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
