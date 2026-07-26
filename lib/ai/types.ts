export interface ProjectionRequest {
  name: string;
  industry: string;
  price: number | string;
  targetTransactions: number | string;
}

export interface AssessmentRequest {
  startupName: string;
  startupDescription: string;
  industry: string;
  businessModel: string;
  fundingStage: string;
  teamSize: number | string;
  financialInfo?: string;
}

export interface ProjectionResult {
  revenue_3y: number[];
  cogs_3y: number[];
  opex_3y: number[];
  bep_units: number;
  bep_value: number;
  risks: string[];
  advice: string[];
}

export interface AssessmentResult {
  startup_profile: {
    name: string;
    description: string;
    industry: string;
    business_model: string;
    funding_stage: string;
    team_size: number;
    summary: string;
  };
  financial_readiness_score: {
    score: number;
    band: 'low' | 'medium' | 'high';
    summary: string;
  };
  category_scores: {
    market_fit: number;
    financial_structure: number;
    unit_economics: number;
    execution_readiness: number;
    investor_readiness: number;
  };
  personalized_checklist: Array<{
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    description: string;
    impact: string;
  }>;
  ai_recommendations: Array<{
    priority: 'low' | 'medium' | 'high';
    title: string;
    rationale: string;
    action: string;
  }>;
  startup_roadmap: Array<{
    phase: string;
    objective: string;
    milestones: string[];
    time_horizon: string;
  }>;
  learning_topics: string[];
}

export interface AIServiceResponse<T> {
  data: T;
  provider?: string;
  isMock?: boolean;
  warning?: string;
}
