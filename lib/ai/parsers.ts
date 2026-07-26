import { AssessmentResult, ProjectionResult } from './types';

export function parseProjectionResponse(raw: string): ProjectionResult {
  const parsed = JSON.parse(raw);
  return {
    revenue_3y: Array.isArray(parsed.revenue_3y) ? parsed.revenue_3y : [],
    cogs_3y: Array.isArray(parsed.cogs_3y) ? parsed.cogs_3y : [],
    opex_3y: Array.isArray(parsed.opex_3y) ? parsed.opex_3y : [],
    bep_units: Number(parsed.bep_units || 0),
    bep_value: Number(parsed.bep_value || 0),
    risks: Array.isArray(parsed.risks) ? parsed.risks : [],
    advice: Array.isArray(parsed.advice) ? parsed.advice : [],
  };
}

export function parseAssessmentResponse(raw: string): AssessmentResult {
  const parsed = JSON.parse(raw);
  return {
    startup_profile: {
      name: parsed?.startup_profile?.name || '',
      description: parsed?.startup_profile?.description || '',
      industry: parsed?.startup_profile?.industry || '',
      business_model: parsed?.startup_profile?.business_model || '',
      funding_stage: parsed?.startup_profile?.funding_stage || '',
      team_size: Number(parsed?.startup_profile?.team_size || 0),
      summary: parsed?.startup_profile?.summary || '',
    },
    financial_readiness_score: {
      score: Number(parsed?.financial_readiness_score?.score || 0),
      band: parsed?.financial_readiness_score?.band || 'low',
      summary: parsed?.financial_readiness_score?.summary || '',
    },
    category_scores: {
      market_fit: Number(parsed?.category_scores?.market_fit || 0),
      financial_structure: Number(parsed?.category_scores?.financial_structure || 0),
      unit_economics: Number(parsed?.category_scores?.unit_economics || 0),
      execution_readiness: Number(parsed?.category_scores?.execution_readiness || 0),
      investor_readiness: Number(parsed?.category_scores?.investor_readiness || 0),
    },
    personalized_checklist: Array.isArray(parsed?.personalized_checklist) ? parsed.personalized_checklist : [],
    ai_recommendations: Array.isArray(parsed?.ai_recommendations) ? parsed.ai_recommendations : [],
    startup_roadmap: Array.isArray(parsed?.startup_roadmap) ? parsed.startup_roadmap : [],
    learning_topics: Array.isArray(parsed?.learning_topics) ? parsed.learning_topics : [],
  };
}
