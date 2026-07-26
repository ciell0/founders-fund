import { NextResponse } from 'next/server';
import { generateProjection } from '@/lib/ai/service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, industry, price, targetTransactions } = body || {};

    if (!name || !industry || !price || !targetTransactions) {
      return NextResponse.json({ error: 'Parameter input tidak lengkap.' }, { status: 400 });
    }

    const result = await generateProjection({
      name,
      industry,
      price,
      targetTransactions,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI projection handler crash:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
