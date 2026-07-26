import { invokeAIModel } from './providers';
import { buildAssessmentPrompt, buildProjectionPrompt } from './prompts';
import { parseAssessmentResponse, parseProjectionResponse } from './parsers';
import { AssessmentRequest, AssessmentResult, AIServiceResponse, ProjectionRequest, ProjectionResult } from './types';

export function generateLocalMockProjections(input: ProjectionRequest): ProjectionResult {
  const price = Number(input.price);
  const monthlyTarget = Number(input.targetTransactions);

  const revY1 = price * monthlyTarget * 12;
  const revY2 = Math.round(revY1 * 1.8);
  const revY3 = Math.round(revY2 * 1.5);

  const cogsY1 = Math.round(revY1 * 0.4);
  const cogsY2 = Math.round(revY2 * 0.38);
  const cogsY3 = Math.round(revY3 * 0.35);

  const opexY1 = Math.round(revY1 * 0.35);
  const opexY2 = Math.round(opexY1 * 1.25);
  const opexY3 = Math.round(opexY2 * 1.2);

  const marginPerUnit = price * 0.6;
  const bepUnits = Math.ceil(opexY1 / marginPerUnit);
  const bepValue = bepUnits * price;

  return {
    revenue_3y: [revY1, revY2, revY3],
    cogs_3y: [cogsY1, cogsY2, cogsY3],
    opex_3y: [opexY1, opexY2, opexY3],
    bep_units: bepUnits,
    bep_value: bepValue,
    risks: [
      `Persaingan ketat di sektor ${input.industry}.`,
      'Biaya akuisisi pengguna yang tidak stabil.',
      'Ketergantungan yang tinggi pada dana hibah di awal pengembangan.',
      'Rasio retensi pengguna yang berpotensi rendah di bulan-bulan awal.'
    ],
    advice: [
      'Pertahankan COGS di kisaran 35-40% dengan bernegosiasi dengan penyedia API/infrastruktur.',
      'Alokasikan minimal 40% anggaran awal untuk validasi produk dan user-acquisition organik.',
      'Fokus capai BEP pada Tahun 1 dengan mengoptimalkan biaya pemasaran berbasis digital marketing kampus.',
      'Sisihkan dana cadangan kas minimal untuk 3 bulan operasional tetap.'
    ],
  };
}

export function generateLocalMockAssessment(input: AssessmentRequest): AssessmentResult {
  return {
    startup_profile: {
      name: input.startupName,
      description: input.startupDescription,
      industry: input.industry,
      business_model: input.businessModel,
      funding_stage: input.fundingStage,
      team_size: Number(input.teamSize || 0),
      summary: 'Profil startup disusun secara ringkas untuk membantu prioritas pembelajaran dan eksekusi.',
    },
    financial_readiness_score: {
      score: 68,
      band: 'medium',
      summary: 'Startup menunjukkan potensi yang baik namun masih memerlukan fondasi finansial dan operasional yang lebih kuat.',
    },
    category_scores: {
      market_fit: 70,
      financial_structure: 64,
      unit_economics: 61,
      execution_readiness: 67,
      investor_readiness: 66,
    },
    personalized_checklist: [
      {
        id: 'check-1',
        title: 'Validasi unit economics',
        priority: 'high',
        description: 'Pastikan margin per pelanggan dan biaya acquisition jelas dipahami.',
        impact: 'Mengurangi risiko ketidakstabilan pertumbuhan.',
      },
    ],
    ai_recommendations: [
      {
        priority: 'high',
        title: 'Bangun proyeksi kas bulanan',
        rationale: 'Proyeksi kas membantu mengidentifikasi runway dan kebutuhan pendanaan lebih awal.',
        action: 'Buat model kas bulanan minimal 12 bulan.',
      },
    ],
    startup_roadmap: [
      {
        phase: 'Foundation',
        objective: 'Menetapkan fondasi finansial dan operasional yang sehat.',
        milestones: ['Buat arus kas bulanan', 'Uji unit economics'],
        time_horizon: '0-3 bulan',
      },
    ],
    learning_topics: ['Unit economics', 'Cash flow management', 'Investor readiness'],
  };
}

export async function generateProjection(input: ProjectionRequest): Promise<AIServiceResponse<ProjectionResult>> {
  const { systemPrompt, userPrompt } = buildProjectionPrompt(input);

  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!groqKey && !openaiKey) {
    return { data: generateLocalMockProjections(input), isMock: true };
  }

  try {
    const response = await invokeAIModel({ systemPrompt, userPrompt, responseFormat: 'json_object' });
    return { data: parseProjectionResponse(response.content), provider: response.provider };
  } catch (error) {
    console.warn('AI projection failed, using local simulation.', error);
    return { data: generateLocalMockProjections(input), isMock: true, warning: 'Inference failed, returned simulation.' };
  }
}

export async function generateAssessment(input: AssessmentRequest): Promise<AIServiceResponse<AssessmentResult>> {
  const { systemPrompt, userPrompt } = buildAssessmentPrompt(input);

  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!groqKey && !openaiKey) {
    return { data: generateLocalMockAssessment(input), isMock: true };
  }

  try {
    const response = await invokeAIModel({ systemPrompt, userPrompt, responseFormat: 'json_object' });
    return { data: parseAssessmentResponse(response.content), provider: response.provider };
  } catch (error) {
    console.warn('AI assessment failed, using local simulation.', error);
    return { data: generateLocalMockAssessment(input), isMock: true, warning: 'Inference failed, returned simulation.' };
  }
}
