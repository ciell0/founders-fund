// app/dashboard/checklist/page.tsx
"use client";

import * as React from "react";
import { DashboardContext } from "../layout";
import {
  CheckCircle2,
  Circle,
  Trophy,
  Loader2,
  Sparkles,
  BookOpen,
  ChevronDown,
  BrainCircuit,
  Lightbulb,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Target,
  BarChart3,
} from "lucide-react";

type Priority = "low" | "medium" | "high";

interface AssessmentChecklistItem {
  id: string;
  title: string;
  priority: Priority;
  description: string;
  impact: string;
  category?: string;
}

interface AssessmentRecommendation {
  priority: Priority;
  title: string;
  rationale: string;
  action: string;
}

interface AssessmentRoadmapItem {
  phase: string;
  objective: string;
  milestones: string[];
  time_horizon: string;
}

interface AssessmentResult {
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
    band: "low" | "medium" | "high";
    summary: string;
  };
  category_scores: {
    market_fit: number;
    financial_structure: number;
    unit_economics: number;
    execution_readiness: number;
    investor_readiness: number;
  };
  personalized_checklist: AssessmentChecklistItem[];
  ai_recommendations: AssessmentRecommendation[];
  startup_roadmap: AssessmentRoadmapItem[];
  learning_topics: string[];
}

interface AssessmentFormState {
  startupName: string;
  startupDescription: string;
  industry: string;
  businessModel: string;
  fundingStage: string;
  teamSize: string;
  financialInfo: string;
}

const createMockAssessment = (form: AssessmentFormState): AssessmentResult => ({
  startup_profile: {
    name: form.startupName || "Startup Anda",
    description: form.startupDescription || "Startup dengan potensi pertumbuhan yang besar namun masih memerlukan fondasi finansial yang lebih kuat.",
    industry: form.industry || "Teknologi",
    business_model: form.businessModel || "Subscription / SaaS",
    funding_stage: form.fundingStage || "Pre-seed",
    team_size: Number(form.teamSize || 4),
    summary: "Startup menunjukkan arah yang jelas, tetapi belum sepenuhnya terstruktur pada unit economics dan tata kelola kas.",
  },
  financial_readiness_score: {
    score: 74,
    band: "medium",
    summary: "Startup berada pada jalur yang baik, namun masih memerlukan penguatan sistem kas, prioritas finansial, dan dokumentasi investor.",
  },
  category_scores: {
    market_fit: 78,
    financial_structure: 69,
    unit_economics: 71,
    execution_readiness: 75,
    investor_readiness: 72,
  },
  personalized_checklist: [
    {
      id: "market-validation",
      title: "Validasi pasar dan demand",
      priority: "high",
      description: "Pastikan setiap asumsi pertumbuhan didukung oleh data nyata dari pengguna atau calon pelanggan.",
      impact: "Mengurangi risiko membangun solusi yang tidak benar-benar dibutuhkan pasar.",
      category: "Market Readiness",
    },
    {
      id: "cash-forecast",
      title: "Bangun cash forecast bulanan",
      priority: "high",
      description: "Buat proyeksi kas bulanan untuk melihat runway dan kebutuhan pendanaan yang mungkin muncul.",
      impact: "Memberi visibility lebih awal terhadap potensi kekurangan dana.",
      category: "Financial Structure",
    },
    {
      id: "unit-economics",
      title: "Definisikan unit economics",
      priority: "medium",
      description: "Pahami margin per pelanggan dan biaya akuisisi sehingga model bisnis lebih konsisten.",
      impact: "Membantu startup tahu apakah skalanya benar-benar profitable.",
      category: "Unit Economics",
    },
    {
      id: "governance",
      title: "Tata kelola keputusan keuangan",
      priority: "medium",
      description: "Tetapkan pembagian tanggung jawab dan mekanisme keputusan untuk setiap pengeluaran besar.",
      impact: "Mengurangi konflik internal dan memperkuat disiplin operasional.",
      category: "Execution Readiness",
    },
  ],
  ai_recommendations: [
    {
      priority: "high",
      title: "Bangun dashboard arus kas mingguan",
      rationale: "Founder perlu melihat pergerakan kas secara konsisten agar keputusan lebih cepat dan lebih tepat.",
      action: "Mulai dengan ringkasan kas mingguan dan target runway 3 bulan ke depan.",
    },
    {
      priority: "medium",
      title: "Tingkatkan bukti pasar sebelum ekspansi",
      rationale: "Pendekatan yang lebih disiplin pada validasi pasar akan mengurangi biaya yang tidak perlu.",
      action: "Lakukan wawancara pelanggan dan ukur retensi sebelum menambah tim besar.",
    },
  ],
  startup_roadmap: [
    {
      phase: "Foundation",
      objective: "Memperkuat fondasi keuangan dan operasi",
      milestones: ["Buat cash forecast 6 bulan", "Tentukan unit economics utama"],
      time_horizon: "0-3 bulan",
    },
    {
      phase: "Validation",
      objective: "Memastikan model bisnis dapat tumbuh dengan aman",
      milestones: ["Uji hipotesis pasar", "Tingkatkan retensi pengguna"],
      time_horizon: "3-6 bulan",
    },
  ],
  learning_topics: ["Cash Flow Management", "Unit Economics", "Investor Readiness"],
});

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 backdrop-blur-md">
      <div className="mb-4">
        <h3 className="text-base font-bold text-white">{title}</h3>
        {description ? <p className="mt-1 text-xs text-zinc-400">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}

function ScorePill({ score, label, tone }: { score: number; label: string; tone: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-zinc-400">{label}</span>
        <span className={`text-lg font-bold ${tone}`}>{score}/100</span>
      </div>
      <div className="mt-3 h-2.5 rounded-full bg-zinc-800 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-500 transition-all duration-500" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function ChecklistItemCard({
  item,
  isCompleted,
  onToggle,
}: {
  item: AssessmentChecklistItem;
  isCompleted: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div className={`rounded-xl border p-4 transition-all duration-300 ${isCompleted ? "border-emerald-500/20 bg-emerald-500/[0.03]" : "border-zinc-800 bg-zinc-950/40"}`}>
      <div className="flex items-start gap-3">
        <button onClick={() => onToggle(item.id)} className={`mt-0.5 shrink-0 ${isCompleted ? "text-emerald-400" : "text-zinc-600 hover:text-zinc-400"}`}>
          {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className={`text-sm font-semibold ${isCompleted ? "text-zinc-300 line-through" : "text-white"}`}>{item.title}</h4>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${item.priority === "high" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : item.priority === "medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-zinc-800 text-zinc-400 border border-zinc-700"}`}>
              {item.priority}
            </span>
          </div>
          <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
          <p className="mt-2 text-xs text-zinc-500">Impact: {item.impact}</p>
        </div>
      </div>
    </div>
  );
}

function LearningAccordion({
  title,
  summary,
  topics,
  resources,
  isOpen,
  onToggle,
}: {
  title: string;
  summary: string;
  topics: string[];
  resources: string[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-3 text-left">
        <div>
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          <p className="mt-1 text-sm text-zinc-400">{summary}</p>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen ? (
        <div className="mt-4 space-y-3 border-t border-zinc-900/60 pt-4">
          <div>
            <h5 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Learning focus</h5>
            <ul className="mt-2 space-y-2 text-sm text-zinc-300">
              {topics.map((topic) => (
                <li key={topic} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Resources</h5>
            <div className="mt-2 flex flex-wrap gap-2">
              {resources.map((resource) => (
                <span key={resource} className="rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 text-xs text-zinc-400">{resource}</span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function ChecklistPage() {
  const { activeStartup } = React.useContext(DashboardContext);
  const [form, setForm] = React.useState<AssessmentFormState>({
    startupName: activeStartup?.name || "",
    startupDescription: "",
    industry: activeStartup?.industry || "",
    businessModel: "",
    fundingStage: "",
    teamSize: "",
    financialInfo: "",
  });
  const [assessment, setAssessment] = React.useState<AssessmentResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [completedIds, setCompletedIds] = React.useState<string[]>([]);
  const [activeLearning, setActiveLearning] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (activeStartup) {
      setForm((prev) => ({ ...prev, startupName: activeStartup.name || prev.startupName, industry: activeStartup.industry || prev.industry }));
    }
  }, [activeStartup]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeStartup) return;

    setLoading(true);
    setAssessment(null);
    setCompletedIds([]);

    await new Promise((resolve) => setTimeout(resolve, 900));

    const mockResult = createMockAssessment(form);
    setAssessment(mockResult);
    setLoading(false);
  };

  const handleToggleChecklist = (id: string) => {
    setCompletedIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  const progressPercentage = assessment ? Math.round((completedIds.length / Math.max(assessment.personalized_checklist.length, 1)) * 100) : 0;
  const groupedChecklist = React.useMemo(() => {
    if (!assessment) return [] as Array<{ category: string; items: AssessmentChecklistItem[] }>;
    return Array.from(new Map((assessment.personalized_checklist || []).map((item) => [item.category || "General", [] as AssessmentChecklistItem[]])).keys()).map((category) => ({
      category,
      items: assessment.personalized_checklist.filter((item) => (item.category || "General") === category),
    }));
  }, [assessment]);

  if (!activeStartup) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AI Financial Literacy Assistant</h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Mulai dari deskripsi startup, lalu dapatkan diagnosis, skor kesiapan finansial, checklist personal, dan roadmap belajar yang terarah.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-[-40px] right-[-40px] h-32 w-32 rounded-full bg-violet-600/10 blur-2xl" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Progress Dashboard</h3>
            <p className="text-xs text-zinc-400">Pantau kesiapan finansial awal dan progres checklist yang sudah Anda selesaikan.</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-violet-400">{assessment ? `${progressPercentage}%` : "0%"}</span>
            <span className="text-xs text-zinc-500 ml-1">Selesai</span>
          </div>
        </div>
        <div className="mt-4 h-2.5 w-full bg-zinc-950 border border-zinc-850 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-500 transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>

      <SectionCard title="Startup Assessment Form" description="Isi deskripsi startup untuk menghasilkan analisis AI yang lebih personal.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Startup Name</label>
              <input value={form.startupName} onChange={(event) => setForm((prev) => ({ ...prev, startupName: event.target.value }))} className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Industry</label>
              <input value={form.industry} onChange={(event) => setForm((prev) => ({ ...prev, industry: event.target.value }))} className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500" />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Startup Description</label>
              <textarea value={form.startupDescription} onChange={(event) => setForm((prev) => ({ ...prev, startupDescription: event.target.value }))} rows={4} className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500" placeholder="Jelaskan masalah yang dipecahkan, target pengguna, dan model bisnis utama." />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Business Model</label>
              <input value={form.businessModel} onChange={(event) => setForm((prev) => ({ ...prev, businessModel: event.target.value }))} className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500" placeholder="Contoh: subscription, marketplace, B2B SaaS" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Funding Stage</label>
              <input value={form.fundingStage} onChange={(event) => setForm((prev) => ({ ...prev, fundingStage: event.target.value }))} className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500" placeholder="Contoh: Pre-seed, Seed" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Team Size</label>
              <input type="number" min="1" value={form.teamSize} onChange={(event) => setForm((prev) => ({ ...prev, teamSize: event.target.value }))} className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Optional Financial Info</label>
              <input value={form.financialInfo} onChange={(event) => setForm((prev) => ({ ...prev, financialInfo: event.target.value }))} className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500" placeholder="Misal: current revenue, burn rate, runway" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-violet-500">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Assessing..." : "Run AI Assessment"}
            </button>
            <span className="text-xs text-zinc-500">Mocked response for now. Ready to connect to /api/ai/analyze.</span>
          </div>
        </form>
      </SectionCard>

      {loading ? (
        <SectionCard title="AI Assessment in Progress" description="The assistant is analyzing your startup context and preparing a personalized diagnostic.">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/50 px-6 py-10 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            <h4 className="mt-4 text-lg font-semibold text-white">Preparing startup diagnosis</h4>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">This short loading state mirrors the future API flow and keeps the experience smooth while the AI response is generated.</p>
          </div>
        </SectionCard>
      ) : null}

      {assessment ? (
        <>
          <SectionCard title="Startup Diagnosis" description="Ringkasan awal mengenai kondisi startup Anda.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <div className="flex items-center gap-2 text-violet-400"><BrainCircuit className="h-4 w-4" /> <span className="text-sm font-semibold">Profile</span></div>
                <p className="mt-3 text-sm text-zinc-300">{assessment.startup_profile.summary}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <div className="flex items-center gap-2 text-violet-400"><Target className="h-4 w-4" /> <span className="text-sm font-semibold">Business Model</span></div>
                <p className="mt-3 text-sm text-zinc-300">{assessment.startup_profile.business_model}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <div className="flex items-center gap-2 text-violet-400"><BarChart3 className="h-4 w-4" /> <span className="text-sm font-semibold">Funding Stage</span></div>
                <p className="mt-3 text-sm text-zinc-300">{assessment.startup_profile.funding_stage}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <div className="flex items-center gap-2 text-violet-400"><ShieldCheck className="h-4 w-4" /> <span className="text-sm font-semibold">Team Size</span></div>
                <p className="mt-3 text-sm text-zinc-300">{assessment.startup_profile.team_size} anggota</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Financial Readiness Score" description="Skor ini memandu prioritas belajar dan pemulihan fondasi finansial.">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Current readiness</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white">{assessment.financial_readiness_score.score}</span>
                    <span className="text-sm uppercase tracking-[0.2em] text-violet-400">{assessment.financial_readiness_score.band}</span>
                  </div>
                </div>
                <div className="max-w-md rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-sm text-zinc-300">
                  {assessment.financial_readiness_score.summary}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Category Scores" description="Nilai tiap pilar untuk membantu Anda memahami area yang perlu diperkuat.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              <ScorePill score={assessment.category_scores.market_fit} label="Market Fit" tone="text-emerald-400" />
              <ScorePill score={assessment.category_scores.financial_structure} label="Financial Structure" tone="text-sky-400" />
              <ScorePill score={assessment.category_scores.unit_economics} label="Unit Economics" tone="text-amber-400" />
              <ScorePill score={assessment.category_scores.execution_readiness} label="Execution" tone="text-violet-400" />
              <ScorePill score={assessment.category_scores.investor_readiness} label="Investor Readiness" tone="text-rose-400" />
            </div>
          </SectionCard>

          <SectionCard title="Personalized Checklist" description="Checklist ini akan berubah tergantung respons AI yang diterima dari endpoint masa depan.">
            <div className="space-y-4">
              {groupedChecklist.map((group) => (
                <div key={group.category} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-violet-400" />
                    <h4 className="text-sm font-semibold text-white">{group.category}</h4>
                  </div>
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <ChecklistItemCard key={item.id} item={item} isCompleted={completedIds.includes(item.id)} onToggle={handleToggleChecklist} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Learning Resources" description="Jelajahi materi edukasi untuk memperkuat pemahaman finansial startup Anda.">
            <div className="space-y-3">
              {assessment.learning_topics.map((topic) => {
                const isOpen = activeLearning === topic;
                return (
                  <LearningAccordion
                    key={topic}
                    title={topic}
                    summary={`Pelajari konsep penting terkait ${topic.toLowerCase()} untuk memperkuat keputusan startup.`}
                    topics={[`${topic} membantu founder melihat keputusan finansial dengan lebih jelas.`, "Konsep ini sangat bermanfaat saat mempresentasikan rencana bisnis ke juri atau investor."]}
                    resources={["Placeholder YouTube tutorial", "Placeholder article"]}
                    isOpen={isOpen}
                    onToggle={() => setActiveLearning(isOpen ? null : topic)}
                  />
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="AI Recommendations" description="Rekomendasi yang dipersonalisasi berdasarkan hasil AI assessment.">
            <div className="space-y-3">
              {assessment.ai_recommendations.map((recommendation) => (
                <div key={recommendation.title} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-violet-600/10 p-2 text-violet-400"><Lightbulb className="h-4 w-4" /></div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{recommendation.title}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${recommendation.priority === "high" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-zinc-800 text-zinc-400 border border-zinc-700"}`}>{recommendation.priority}</span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-400">{recommendation.rationale}</p>
                      <p className="mt-2 text-sm text-zinc-300">Action: {recommendation.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Startup Roadmap" description="Tahapan prioritas yang bisa Anda jalankan setelah assessment.">
            <div className="space-y-3">
              {assessment.startup_roadmap.map((step) => (
                <div key={step.phase} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{step.phase}</h4>
                      <p className="mt-1 text-sm text-zinc-400">{step.objective}</p>
                    </div>
                    <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 text-xs text-zinc-400">{step.time_horizon}</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                    {step.milestones.map((milestone) => (
                      <li key={milestone} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      ) : null}
    </div>
  );
}
