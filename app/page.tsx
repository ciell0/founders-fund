// app/page.tsx
import Link from "next/link";
import { TrendingUp, Sparkles, ShieldCheck, Wallet, ArrowRight, BarChart3 } from "lucide-react";

export default function LandingPage() {
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

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-violet-400 transition-colors">Fitur</a>
            <a href="#about" className="hover:text-violet-400 transition-colors">Tentang Lomba</a>
          </nav>

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
            {/* Feature 1 */}
            <div className="rounded-2xl border border-zinc-850 bg-zinc-900/30 p-8 glass-panel-hover">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 mb-6">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Pitch Deck Projection</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Buat proyeksi keuangan 3 tahun (Revenue, COGS, Opex, BEP) instan berbasis AI. Cukup masukkan nama, deskripsi, harga, dan target penjualan. Hasil siap salin ke Pitch Deck!
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-zinc-850 bg-zinc-900/30 p-8 glass-panel-hover">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 mb-6">
                <Wallet className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Runway & Grant Tracker</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Pantau burn rate bulanan dan hitung sisa runway (masa aktif dana) secara presisi. Catat hibah, investasi, dan pengeluaran operasional dalam ledger transaksi.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-zinc-850 bg-zinc-900/30 p-8 glass-panel-hover">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 mb-6">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Literacy Checklist</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Panduan praktis pengelolaan keuangan & legalitas rintisan (Equity Split, Pemisahan Rekening Tim, NIB, Dana Darurat). Centang, simpan kemajuan, dan bangun fondasi bisnis sehat.
              </p>
            </div>
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
