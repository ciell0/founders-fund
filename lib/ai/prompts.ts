import { AssessmentRequest, ProjectionRequest } from './types';

export const buildProjectionPrompt = (input: ProjectionRequest) => {
  const numericPrice = Number(input.price);
  const numericTarget = Number(input.targetTransactions);

  const systemPrompt = `Anda adalah ahli keuangan startup dan analis VC.
Tugas Anda adalah menghasilkan proyeksi keuangan 3 tahun yang realistis, logis, dan matematis untuk startup.
Data input unit economics dasar:
- Nama Startup: ${input.name}
- Industri: ${input.industry}
- Harga Jual Satuan: Rp ${numericPrice}
- Target Volume Transaksi/Penjualan per Bulan: ${numericTarget} unit

Hitung secara rasional:
1. Pendapatan tahunan (Revenue) untuk 3 tahun. Tahun 1 = 12 * Target Bulanan * Harga Jual. Tahun 2 & 3 harus mencerminkan pertumbuhan startup yang realistis.
2. Cost of Goods Sold (COGS) tahunan 3 tahun.
3. Biaya Operasional (Opex) tahunan 3 tahun.
4. Break-Even Point (BEP) dalam unit per tahun dan nilai Rupiah per tahun.
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

  const userPrompt = `Buat proyeksi keuangan untuk startup "${input.name}" di bidang ${input.industry} dengan harga jual Rp ${numericPrice} dan target penjualan ${numericTarget} unit/bulan.`;

  return { systemPrompt, userPrompt };
};

export const buildAssessmentPrompt = (input: AssessmentRequest) => {
  const systemPrompt = `Anda adalah AI Financial Mentor untuk startup.
Tugas Anda adalah menilai kesiapan startup secara holistik dan menghasilkan respons JSON yang terstruktur.
Fokus pada: pasar, model bisnis, unit economics, kesiapan eksekusi, dan kesiapan investor.

Kembalikan JSON valid dengan struktur berikut:
{
  "startup_profile": {
    "name": "",
    "description": "",
    "industry": "",
    "business_model": "",
    "funding_stage": "",
    "team_size": 0,
    "summary": ""
  },
  "financial_readiness_score": {
    "score": 0,
    "band": "low",
    "summary": ""
  },
  "category_scores": {
    "market_fit": 0,
    "financial_structure": 0,
    "unit_economics": 0,
    "execution_readiness": 0,
    "investor_readiness": 0
  },
  "personalized_checklist": [
    {
      "id": "check-1",
      "title": "",
      "priority": "high",
      "description": "",
      "impact": ""
    }
  ],
  "ai_recommendations": [
    {
      "priority": "high",
      "title": "",
      "rationale": "",
      "action": ""
    }
  ],
  "startup_roadmap": [
    {
      "phase": "",
      "objective": "",
      "milestones": [""],
      "time_horizon": ""
    }
  ],
  "learning_topics": [""]
}`;

  const userPrompt = `Analisis startup berikut secara mendalam.
Nama: ${input.startupName}
Deskripsi: ${input.startupDescription}
Industri: ${input.industry}
Model Bisnis: ${input.businessModel}
Tahap Pendanaan: ${input.fundingStage}
Ukuran Tim: ${input.teamSize}
Informasi Keuangan Opsional: ${input.financialInfo || 'Tidak ada informasi tambahan.'}

Berikan penilaian yang realistis, praktis, dan dapat ditindaklanjuti.`;

  return { systemPrompt, userPrompt };
};
