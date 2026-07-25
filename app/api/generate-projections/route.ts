// app/api/generate-projections/route.ts
import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { OpenAI } from 'openai';

export async function POST(req: Request) {
  try {
    const { name, industry, price, targetTransactions } = await req.json();

    if (!name || !industry || !price || !targetTransactions) {
      return NextResponse.json({ error: 'Parameter input tidak lengkap.' }, { status: 400 });
    }

    const numericPrice = Number(price);
    const numericTarget = Number(targetTransactions);

    const systemPrompt = `Anda adalah ahli keuangan startup dan analis VC (Venture Capital).
Tugas Anda adalah menghasilkan proyeksi keuangan 3 tahun yang realistis, logis, dan matematis untuk startup mahasiswa.
Data input unit economics dasar:
- Nama Startup: ${name}
- Industri: ${industry}
- Harga Jual Satuan (Unit Price): Rp ${numericPrice}
- Target Volume Transaksi/Penjualan per Bulan: ${numericTarget} unit

Hitung secara rasional:
1. Pendapatan tahunan (Revenue) untuk 3 tahun. Tahun 1 = 12 * Target Bulanan * Harga Jual. Tahun 2 & 3 harus mencerminkan pertumbuhan startup yang realistis (misal 50% - 150% YoY).
2. Cost of Goods Sold (COGS) tahunan 3 tahun. Harus proporsional terhadap Revenue (misal 30% - 60% tergantung industri).
3. Biaya Operasional (Opex) tahunan 3 tahun (gaji tim, server, pemasaran, dsb). Opex harus rasional.
4. Break-Even Point (BEP) dalam unit per tahun dan nilai Rupiah per tahun.
   Rumus BEP: BEP Unit = Opex / (Harga Jual - COGS per Unit)
   BEP Rupiah = BEP Unit * Harga Jual.
   Gunakan Opex Tahun 1 untuk perhitungan BEP.
5. Berikan 3-5 risiko keuangan spesifik sektor ini.
6. Berikan 3-5 saran alokasi dana dan efisiensi operasional.

Respon HARUS berupa JSON valid tanpa teks penjelasan tambahan, mengikuti format ini:
{
  "revenue_3y": [tahun_1_rev, tahun_2_rev, tahun_3_rev],
  "cogs_3y": [tahun_1_cogs, tahun_2_cogs, tahun_3_cogs],
  "opex_3y": [tahun_1_opex, tahun_2_opex, tahun_3_opex],
  "bep_units": bep_unit_tahunan,
  "bep_value": bep_rupiah_tahunan,
  "risks": ["risiko_1", "risiko_2", ...],
  "advice": ["saran_1", "saran_2", ...]
}`;

    const userPrompt = `Buat proyeksi keuangan untuk startup "${name}" di bidang ${industry} dengan harga jual Rp ${numericPrice} dan target penjualan ${numericTarget} unit/bulan.`;

    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // --- CASE 1: BOTH KEYS MISSING -> MOCK DYNAMIC AI RESPONSE ---
    if (!groqKey && !openaiKey) {
      console.log('Using local mock generator (no API keys provided)');
      const mockResult = generateLocalMockProjections(name, industry, numericPrice, numericTarget);
      return NextResponse.json({ data: mockResult, isMock: true });
    }

    let completionText = '';
    let successProvider = '';

    // --- CASE 2: ATTEMPT GROQ FIRST (PRIMARY) ---
    if (groqKey) {
      try {
        console.log('Attempting Groq completion...');
        const groq = new Groq({ apiKey: groqKey });
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          model: 'llama3-8b-8192', // fast, solid, cost-effective
          response_format: { type: 'json_object' },
          temperature: 0.2,
        });

        completionText = chatCompletion.choices[0]?.message?.content || '';
        successProvider = 'groq';
      } catch (groqErr) {
        console.error('Groq API Error, attempting fallback:', groqErr);
      }
    }

    // --- CASE 3: FALLBACK TO OPENAI ---
    if (!completionText && openaiKey) {
      try {
        console.log('Attempting OpenAI fallback...');
        const openai = new OpenAI({ apiKey: openaiKey });
        const chatCompletion = await openai.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          temperature: 0.2,
        });

        completionText = chatCompletion.choices[0]?.message?.content || '';
        successProvider = 'openai';
      } catch (openaiErr) {
        console.error('OpenAI Fallback Error:', openaiErr);
      }
    }

    // --- POST PROCESS & RESPONSE ---
    if (completionText) {
      const parsedData = JSON.parse(completionText);
      return NextResponse.json({ data: parsedData, provider: successProvider });
    } else {
      // If both API calls failed due to rate limits or invalid keys, use local simulation
      console.warn('API keys configured but failed during inference. Falling back to local simulation.');
      const mockResult = generateLocalMockProjections(name, industry, numericPrice, numericTarget);
      return NextResponse.json({ data: mockResult, isMock: true, warning: 'Inference failed, returned simulation.' });
    }

  } catch (err: any) {
    console.error('Projections generator handler crash:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

// Logical simulation fallback helper
function generateLocalMockProjections(
  name: string,
  industry: string,
  price: number,
  monthlyTarget: number
) {
  // Annual Revenue Year 1
  const revY1 = price * monthlyTarget * 12;
  
  // Year 2 & 3 growths
  const revY2 = Math.round(revY1 * 1.8); // 80% growth
  const revY3 = Math.round(revY2 * 1.5); // 50% growth

  // COGS is generally 40% of revenues
  const cogsY1 = Math.round(revY1 * 0.4);
  const cogsY2 = Math.round(revY2 * 0.38);
  const cogsY3 = Math.round(revY3 * 0.35);

  // OPEX starts at 35% of Year 1 rev, grows slower
  const opexY1 = Math.round(revY1 * 0.35);
  const opexY2 = Math.round(opexY1 * 1.25);
  const opexY3 = Math.round(opexY2 * 1.2);

  // Break-even
  // price - cogs_unit (cogs_unit is 40% of unit price)
  const marginPerUnit = price * 0.6;
  const bepUnits = Math.ceil(opexY1 / marginPerUnit);
  const bepValue = bepUnits * price;

  const risks = [
    `Persaingan ketat di sektor industri ${industry}.`,
    "Biaya akuisisi pengguna (CAC) yang tidak stabil.",
    "Ketergantungan yang tinggi pada dana hibah di awal pengembangan.",
    "Rasio retensi pengguna yang berpotensi rendah di bulan-bulan awal."
  ];

  const advice = [
    "Pertahankan COGS di kisaran 35-40% dengan bernegosiasi dengan penyedia API/infrastruktur.",
    "Alokasikan minimal 40% anggaran awal untuk validasi produk dan user-acquisition organik.",
    "Fokus capai BEP pada Tahun 1 dengan mengoptimalkan biaya pemasaran berbasis digital marketing kampus.",
    "Sisihkan dana cadangan kas minimal untuk 3 bulan operasional tetap."
  ];

  return {
    revenue_3y: [revY1, revY2, revY3],
    cogs_3y: [cogsY1, cogsY2, cogsY3],
    opex_3y: [opexY1, opexY2, opexY3],
    bep_units: bepUnits,
    bep_value: bepValue,
    risks,
    advice
  };
}
