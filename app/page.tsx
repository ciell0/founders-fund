// app/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { TrendingUp, Sparkles, ShieldCheck, Wallet, ArrowRight, BarChart3, ChevronDown, BookOpen, PlayCircle } from "lucide-react";

const features = [
  {
    id: "projection",
    icon: BarChart3,
    title: "AI Pitch Deck Projection",
    description:
      "Buat proyeksi keuangan 3 tahun (Revenue, COGS, Opex, BEP) instan berbasis AI. Cukup masukkan nama, deskripsi, harga, dan target penjualan. Hasil siap salin ke Pitch Deck!",
    keyCapabilities: [
      "Proyeksi revenue 3 tahun",
      "Estimasi COGS dan Opex",
      "Hitung Break-Even Point",
    ],
    workflow: [
      "Masukkan unit economics dasar startup",
      "Biarkan AI menghasilkan skenario finansial",
      "Bandingkan hasil untuk mempersiapkan pitch deck",
    ],
    realExamples: [
      "Startup edukasi digital dengan harga langganan bulanan",
      "Marketplace lokal dengan target transaksional yang jelas",
    ],
    bestPractices: [
      "Gunakan asumsi yang realistis untuk pertumbuhan",
      "Sertakan margin yang mencerminkan biaya operasional",
    ],
    commonMistakes: [
      "Menganggap revenue tumbuh terlalu cepat tanpa bukti",
      "Mengabaikan biaya tetap yang akan muncul seiring ekspansi",
    ],
    resources: [
      { label: "Placeholder YouTube tutorial", type: "video" },
      { label: "Placeholder article", type: "article" },
    ],
  },
  {
    id: "runway",
    icon: Wallet,
    title: "Runway & Grant Tracker",
    description:
      "Pantau burn rate bulanan dan hitung sisa runway (masa aktif dana) secara presisi. Catat hibah, investasi, dan pengeluaran operasional dalam ledger transaksi.",
    keyCapabilities: [
      "Pelacakan burn rate bulanan",
      "Estimasi runway berdasarkan saldo kas",
      "Pencatatan transaksi dan hibah",
    ],
    workflow: [
      "Catat semua pemasukan dan pengeluaran",
      "Bandingkan kas aktual dengan target operasional",
      "Tentukan kapan startup butuh tambahan pendanaan",
    ],
    realExamples: [
      "Tim yang menerima hibah lomba dan ingin menjaga runway 9 bulan",
      "Startup yang mengatur belanja tim dan infrastruktur secara lebih disiplin",
    ],
    bestPractices: [
      "Pisahkan dana operasional dan dana pengembangan",
      "Tinjau cash flow minimal setiap minggu",
    ],
    commonMistakes: [
      "Menganggap saldo akhir sama dengan runway yang aman",
      "Tidak mengalokasikan dana untuk biaya tak terduga",
    ],
    resources: [
      { label: "Placeholder YouTube tutorial", type: "video" },
      { label: "Placeholder article", type: "article" },
    ],
  },
  {
    id: "literacy",
    icon: ShieldCheck,
    title: "Literacy Checklist",
    description:
      "Panduan praktis pengelolaan keuangan & legalitas rintisan (Equity Split, Pemisahan Rekening Tim, NIB, Dana Darurat). Centang, simpan kemajuan, dan bangun fondasi bisnis sehat.",
    keyCapabilities: [
      "Checklist kesiapan finansial",
      "Peta tindakan legal dan operasional",
      "Pantau langkah yang sudah selesai",
    ],
    workflow: [
      "Lihat checklist yang relevan dengan tahap startup",
      "Pilih prioritas yang paling berdampak",
      "Tandai progres dan lanjutkan ke langkah berikutnya",
    ],
    realExamples: [
      "Tim yang baru membagi equity sebelum ada investor",
      "Startup yang ingin memastikan legalitas sebelum membuka pendanaan",
    ],
    bestPractices: [
      "Tulis keputusan secara jelas dan terdokumentasi",
      "Tinjau checklist secara berkala saat startup berkembang",
    ],
    commonMistakes: [
      "Menunda pembagian tanggung jawab finansial",
      "Mengabaikan dokumen dasar untuk legalitas dan kontrol internal",
    ],
    resources: [
      { label: "Placeholder YouTube tutorial", type: "video" },
      { label: "Placeholder article", type: "article" },
    ],
  },
];

const learningItems = [
  {
    id: "burn-rate",
    title: "Burn Rate",
    shortText: "Memahami seberapa cepat startup menghabiskan kas untuk menjalankan operasi.",
    lesson: [
      "Burn rate adalah biaya bulanan yang harus ditutup oleh saldo kas yang tersedia.",
      "Semakin tinggi burn rate, semakin cepat startup harus mencari pendanaan tambahan.",
    ],
  },
  {
    id: "runway",
    title: "Runway",
    shortText: "Mengukur berapa lama startup bisa bertahan sebelum saldo kas habis.",
    lesson: [
      "Runway biasanya dihitung dari saldo kas dibagi rata-rata burn rate bulanan.",
      "Runway yang aman memberi tim waktu cukup untuk mencapai milestone berikutnya.",
    ],
  },
  {
    id: "cash-flow",
    title: "Cash Flow",
    shortText: "Melihat aliran masuk dan keluar kas agar operasi tetap sehat.",
    lesson: [
      "Cash flow yang sehat membantu startup menghindari kekurangan dana saat beban operasional meningkat.",
      "Pantau kas bulanan untuk melihat kapan startup perlu menyesuaikan prioritas belanja.",
    ],
  },
  {
    id: "revenue-projection",
    title: "Revenue Projection",
    shortText: "Membuat perkiraan revenue berdasarkan asumsi pasar dan unit economics.",
    lesson: [
      "Revenue projection membantu founder menilai apakah model bisnis cukup kuat untuk tumbuh.",
      "Gunakan skenario konservatif, moderat, dan agresif untuk memetakan risiko.",
    ],
  },
  {
    id: "break-even",
    title: "Break-even Point",
    shortText: "Menentukan titik ketika pendapatan menutup biaya tetap dan variabel.",
    lesson: [
      "Break-even point memberi sinyal kapan produk atau layanan mulai menjadi sustainable.",
      "Semakin rendah break-even point, semakin cepat startup bisa stabil secara finansial.",
    ],
  },
  {
    id: "unit-economics",
    title: "Unit Economics",
    shortText: "Memahami profitabilitas per pelanggan atau per transaksi.",
    lesson: [
      "Unit economics membantu menilai apakah model bisnis dapat berkembang tanpa merugi.",
      "Perhatikan contribution margin dan biaya akuisisi pelanggan secara cermat.",
    ],
  },
  {
    id: "equity-split",
    title: "Equity Split",
    shortText: "Membagi kepemilikan secara adil agar keputusan dan tanggung jawab jelas.",
    lesson: [
      "Equity split sebaiknya mencerminkan kontribusi, risiko, dan komitmen jangka panjang tim.",
      "Dokumentasikan keputusan secara jelas dari awal untuk menghindari konflik.",
    ],
  },
  {
    id: "cap-table",
    title: "Cap Table",
    shortText: "Menyusun daftar pemegang saham dan struktur ownership secara sistematis.",
    lesson: [
      "Cap table membantu founder melihat dampak pendanaan baru terhadap kepemilikan masing-masing pihak.",
      "Jaga cap table tetap rapi agar keputusan investasi tidak membingungkan.",
    ],
  },
  {
    id: "emergency-fund",
    title: "Emergency Fund",
    shortText: "Menyisihkan cadangan kas untuk situasi tak terduga yang mengganggu operasional.",
    lesson: [
      "Dana darurat bisa menjadi penyangga ketika pendapatan turun atau biaya muncul tiba-tiba.",
      "Cadangan ini membantu startup tetap berjalan meski ada gangguan bisnis.",
    ],
  },
  {
    id: "business-legality",
    title: "Business Legality",
    shortText: "Memastikan dokumen dan struktur bisnis sesuai kebutuhan operasional dan pendanaan.",
    lesson: [
      "Legalitas yang baik memudahkan startup beroperasi secara sah dan lebih siap saat mencari mitra atau investor.",
      "Mulai dari dokumen dasar, izin, hingga pencatatan keuangan internal yang terdokumentasi.",
    ],
  },
];

export default function LandingPage() {
  const [openFeature, setOpenFeature] = useState<string | null>(null);
  const [openLearning, setOpenLearning] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden font-sans">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[130px] animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[130px] animate-pulse-glow" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
              FoundersFund
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              Masuk
            </Link>
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Coba Sekarang
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* IndonesiaNEXT Tag */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold text-violet-300 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          10th IndonesiaNEXT Hackathon — Literasi Finansial
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
          Kendalikan Keuangan Startup-mu <br className="hidden sm:inline" />
          Dengan Kekuatan <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-300 to-violet-500">AI Financial Projection</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
          Platform finansial literasi & manajemen khusus tim mahasiswa pendiri startup. Buat proyeksi laporan keuangan pitch deck instan dan pantau runway dana hibah/hadiah lomba agar modal tidak habis sebelum rilis.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4">
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-base font-bold text-white hover:bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 w-full sm:w-auto"
          >
            Mulai Secara Gratis
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#features"
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 px-8 py-3.5 text-base font-bold text-zinc-300 transition-all duration-200 w-full sm:w-auto"
          >
            Pelajari Fitur
          </a>
        </div>

        {/* Dashboard Preview / Mockup */}
        <div className="relative mt-16 w-full max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900/20 p-2 shadow-2xl backdrop-blur-sm">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
          <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
            {/* Window bar mockup */}
            <div className="flex h-10 items-center justify-start gap-2 px-4 border-b border-zinc-900 bg-zinc-900/50">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="text-[11px] text-zinc-600 ml-4 font-mono">foundersfund.id/dashboard</span>
            </div>
            
            {/* Visual preview design */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 bg-zinc-950 text-left">
              {/* Sidebar */}
              <div className="w-full md:w-1/4 space-y-3">
                <div className="h-7 w-2/3 bg-zinc-800 rounded animate-pulse" />
                <div className="h-9 w-full bg-violet-600/10 border border-violet-500/20 rounded-lg" />
                <div className="h-9 w-full bg-zinc-900 rounded-lg" />
                <div className="h-9 w-full bg-zinc-900 rounded-lg" />
              </div>
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Runway Estimate</div>
                    <div className="text-2xl font-bold text-white mt-1">14.5 Bulan</div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-3 overflow-hidden">
                      <div className="h-full w-2/3 bg-violet-500 rounded-full" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Monthly Burn Rate</div>
                    <div className="text-2xl font-bold text-rose-400 mt-1">Rp 12.0jt</div>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Current Balance</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">Rp 174.0jt</div>
                  </div>
                </div>
                
                {/* Chart Mock */}
                <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
                  <div className="h-4 w-1/4 bg-zinc-800 rounded mb-4" />
                  <div className="h-32 w-full flex items-end gap-1.5 pt-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end h-full gap-1">
                        <div className="bg-emerald-500/80 rounded" style={{ height: `${20 + (i % 3) * 20}%` }} />
                        <div className="bg-rose-500/80 rounded" style={{ height: `${10 + (i % 2) * 15}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-zinc-900 bg-zinc-950/60 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
              Fokus Utama FoundersFund
            </h2>
            <p className="mt-4 text-zinc-400 text-sm sm:text-base">
              Kami menyederhanakan pengelolaan keuangan yang rumit agar tim mahasiswa pendiri startup dapat fokus meluncurkan produk terbaik mereka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isOpen = openFeature === feature.id;

              return (
                <div key={feature.id} className="rounded-2xl border border-zinc-850 bg-zinc-900/30 p-8 glass-panel-hover">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 mb-6">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>

                  <div className="mt-5">
                    <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Key capabilities</h4>
                    <ul className="mt-2 space-y-2 text-sm text-zinc-300">
                      {feature.keyCapabilities.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpenFeature(isOpen ? null : feature.id)}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-violet-500/30 hover:text-white"
                  >
                    Learn More
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen ? (
                    <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-300 space-y-4">
                      <div>
                        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Workflow</h4>
                        <ol className="mt-2 space-y-2">
                          {feature.workflow.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="text-violet-400">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Real examples</h4>
                        <ul className="mt-2 space-y-2">
                          {feature.realExamples.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="text-emerald-400">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Best practices</h4>
                        <ul className="mt-2 space-y-2">
                          {feature.bestPractices.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="text-amber-400">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Common mistakes</h4>
                        <ul className="mt-2 space-y-2">
                          {feature.commonMistakes.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="text-rose-400">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Educational resources</h4>
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                          {feature.resources.map((resource) => (
                            <a key={resource.label} href="#" className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-300 hover:border-violet-500/30 hover:text-white">
                              {resource.type === "video" ? <PlayCircle className="h-4 w-4 text-violet-400" /> : <BookOpen className="h-4 w-4 text-violet-400" />}
                              <span>{resource.label}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-zinc-900 bg-zinc-950/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
              Financial Learning Center
            </h2>
            <p className="mt-4 text-zinc-400 text-sm sm:text-base">
              Jelajahi konsep penting finansial startup melalui pelajaran singkat yang siap dipakai saat membangun dan mempresentasikan bisnis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningItems.map((item) => {
              const isOpen = openLearning === item.id;
              return (
                <div key={item.id} className="rounded-2xl border border-zinc-850 bg-zinc-900/30 p-6 glass-panel-hover">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm text-zinc-400">{item.shortText}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpenLearning(isOpen ? null : item.id)}
                      className="rounded-full border border-zinc-800 bg-zinc-950/70 p-2 text-zinc-300 transition-all duration-200 hover:border-violet-500/30 hover:text-white"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  {isOpen ? (
                    <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-300">
                      <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Mini lesson</h4>
                      <ul className="mt-3 space-y-2">
                        {item.lesson.map((entry) => (
                          <li key={entry} className="flex gap-2">
                            <span className="text-violet-400">•</span>
                            <span>{entry}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 bg-zinc-950 text-center text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            &copy; {new Date().getFullYear()} FoundersFund. Dikembangkan untuk 10th IndonesiaNEXT Hackathon.
          </div>
          <div className="flex gap-6">
            <span className="hover:text-zinc-400 transition-colors">Sub-Tema: Literasi Finansial</span>
            <span className="text-zinc-800">|</span>
            <span className="hover:text-zinc-400 transition-colors">Tech: Next.js + Supabase + Groq AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
