// app/dashboard/projections/page.tsx
"use client";

import * as React from "react";
import { DashboardContext } from "../layout";
import { getProjections, saveProjection } from "@/lib/supabase";
import { 
  BarChart3, 
  Sparkles, 
  HelpCircle, 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  Lightbulb, 
  Loader2, 
  RefreshCw, 
  Table, 
  ChevronRight 
} from "lucide-react";

interface ProjectionData {
  revenue_3y: number[];
  cogs_3y: number[];
  opex_3y: number[];
  bep_units: number;
  bep_value: number;
  risks: string[];
  advice: string[];
}

export default function ProjectionsPage() {
  const { activeStartup } = React.useContext(DashboardContext);
  const [projection, setProjection] = React.useState<ProjectionData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [generating, setGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form states
  const [price, setPrice] = React.useState("");
  const [targetTransactions, setTargetTransactions] = React.useState("");
  const [customIndustry, setCustomIndustry] = React.useState("");

  const fetchProjection = React.useCallback(async () => {
    if (!activeStartup) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await getProjections(activeStartup.id);
    if (!err && data && data.length > 0) {
      setProjection(data[0].projection_data as ProjectionData);
    } else {
      setProjection(null);
    }
    setLoading(false);
  }, [activeStartup]);

  React.useEffect(() => {
    if (activeStartup) {
      setCustomIndustry(activeStartup.industry || "");
      fetchProjection();
    }
  }, [activeStartup, fetchProjection]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStartup || !price || !targetTransactions) return;

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-projections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: activeStartup.name,
          industry: customIndustry || activeStartup.industry || "Teknologi",
          price: Number(price),
          targetTransactions: Number(targetTransactions),
        }),
      });

      const res = await response.json();

      if (res.error) {
        throw new Error(res.error);
      }

      if (res.data) {
        setProjection(res.data);
        
        // Save to Database
        await saveProjection(activeStartup.id, res.data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal menghasilkan proyeksi keuangan. Coba lagi.");
    } finally {
      setGenerating(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (!activeStartup) return null;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-500 text-sm">
        <Loader2 className="h-6 w-6 animate-spin text-violet-500 mr-2" />
        Memuat proyeksi keuangan startup...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">AI Pitch Deck Financial Generator</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-600/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-300">
              <Sparkles className="h-3 w-3" /> AI
            </span>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Gunakan AI untuk membuat estimasi pendapatan 3 tahun dan Break-Even Point (BEP) instan yang siap dimasukkan ke Pitch Deck.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-500/15 border border-rose-500/30 p-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      {/* INPUT FORM: Rendered if no projection exists or user is editing */}
      {!projection && !generating && (
        <div className="max-w-2xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 md:p-8 backdrop-blur-sm relative">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-violet-600/5 blur-3xl" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white">Input Unit Economics</h3>
              <p className="text-zinc-500 text-xs">AI akan memproyeksikan data finansial berdasarkan variabel penjualan Anda.</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Nama Startup</label>
                <input
                  type="text"
                  disabled
                  value={activeStartup.name}
                  className="mt-1.5 block w-full rounded-lg border border-zinc-800 bg-zinc-950/50 py-2.5 px-3.5 text-sm text-zinc-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Sektor Industri / Deskripsi Singkat</label>
                <input
                  type="text"
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  className="mt-1.5 block w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 px-3.5 text-sm text-zinc-100 placeholder-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="Misal: EdTech platform belajar matematika"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Harga Jual Satuan Produk / Layanan (Unit Price)
              </label>
              <div className="mt-1.5 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 text-sm">Rp</span>
                <input
                  type="number"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="50000"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1.5">Harga rata-rata per transaksi / langganan bulanan per pengguna.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Target Volume Transaksi / Penjualan per Bulan
              </label>
              <div className="mt-1.5 relative">
                <input
                  type="number"
                  required
                  min="1"
                  value={targetTransactions}
                  onChange={(e) => setTargetTransactions(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 px-3.5 text-sm text-zinc-100 placeholder-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="1500"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 text-xs font-medium">Transaksi / Bulan</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1.5">Berapa banyak transaksi yang ingin dicapai setiap bulan di tahun pertama.</p>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-bold text-white hover:bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="h-4.5 w-4.5 text-violet-200" />
              Generate Proyeksi Keuangan
            </button>
          </form>
        </div>
      )}

      {/* GENERATING LOADING SCREEN */}
      {generating && (
        <div className="max-w-xl mx-auto py-16 flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute h-16 w-16 rounded-full border border-violet-500/20 bg-violet-600/10 animate-ping opacity-75" />
            <div className="relative h-12 w-12 rounded-xl border border-violet-500/30 bg-violet-950 text-violet-400 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">AI Sedang Menyusun Proyeksi</h3>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-sm leading-relaxed">
            Menghitung Revenue 3 tahun, COGS, BEP, serta analisis risiko untuk sektor industri Anda.
          </p>
          <div className="mt-4 inline-flex items-center gap-1 rounded bg-zinc-900 px-2.5 py-1 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
            Target Kecepatan: &lt; 5 Detik
          </div>
        </div>
      )}

      {/* OUTPUT VIEWER */}
      {projection && !generating && (
        <div className="space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 relative overflow-hidden backdrop-blur-md">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Pendapatan Tahun 1 (Est)</span>
              <h4 className="text-2xl font-extrabold text-white mt-1">
                {formatCurrency(projection.revenue_3y[0])}
              </h4>
              <p className="text-[10px] text-emerald-400 mt-2 font-medium">Berdasarkan unit economics target awal</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 relative overflow-hidden backdrop-blur-md">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Break-Even Point (Units)</span>
              <h4 className="text-2xl font-extrabold text-violet-400 mt-1">
                {projection.bep_units.toLocaleString('id-ID')} unit
              </h4>
              <p className="text-[10px] text-zinc-500 mt-2 font-medium">Penjualan tahunan minimal untuk balik modal</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 relative overflow-hidden backdrop-blur-md">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Break-Even Point (Value)</span>
              <h4 className="text-2xl font-extrabold text-violet-400 mt-1">
                {formatCurrency(projection.bep_value)}
              </h4>
              <p className="text-[10px] text-zinc-500 mt-2 font-medium">Nilai Rupiah omset minimum per tahun</p>
            </div>
          </div>

          {/* Breakdown Table & Growth Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Table */}
            <div className="lg:col-span-2 rounded-xl border border-zinc-850 bg-zinc-900/20 p-5 flex flex-col justify-between">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-1.5">
                    <Table className="h-4.5 w-4.5 text-violet-400" />
                    Laporan Proyeksi Keuangan (3 Tahun)
                  </h3>
                  <p className="text-[10px] sm:text-xs text-zinc-500">Breakdown tahunan estimasi laba kotor & bersih.</p>
                </div>
              </div>

              <div className="overflow-x-auto border border-zinc-800 bg-zinc-950/60 rounded-lg">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-950/90 font-semibold text-zinc-400">
                      <th className="p-3">Elemen Finansial</th>
                      <th className="p-3 text-right">Tahun 1</th>
                      <th className="p-3 text-right">Tahun 2</th>
                      <th className="p-3 text-right">Tahun 3</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 text-zinc-300 font-medium">Pendapatan (Revenue)</td>
                      <td className="p-3 text-right text-white font-semibold">{formatCurrency(projection.revenue_3y[0])}</td>
                      <td className="p-3 text-right text-white font-semibold">{formatCurrency(projection.revenue_3y[1])}</td>
                      <td className="p-3 text-right text-white font-semibold">{formatCurrency(projection.revenue_3y[2])}</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 text-zinc-300">Beban Pokok Penjualan (COGS)</td>
                      <td className="p-3 text-right text-rose-450">{formatCurrency(projection.cogs_3y[0])}</td>
                      <td className="p-3 text-right text-rose-450">{formatCurrency(projection.cogs_3y[1])}</td>
                      <td className="p-3 text-right text-rose-450">{formatCurrency(projection.cogs_3y[2])}</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20 bg-zinc-900/10">
                      <td className="p-3 text-emerald-400 font-bold">Laba Kotor (Gross Profit)</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">
                        {formatCurrency(projection.revenue_3y[0] - projection.cogs_3y[0])}
                      </td>
                      <td className="p-3 text-right text-emerald-400 font-bold">
                        {formatCurrency(projection.revenue_3y[1] - projection.cogs_3y[1])}
                      </td>
                      <td className="p-3 text-right text-emerald-400 font-bold">
                        {formatCurrency(projection.revenue_3y[2] - projection.cogs_3y[2])}
                      </td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 text-zinc-300">Biaya Operasional (Opex)</td>
                      <td className="p-3 text-right text-rose-450">{formatCurrency(projection.opex_3y[0])}</td>
                      <td className="p-3 text-right text-rose-450">{formatCurrency(projection.opex_3y[1])}</td>
                      <td className="p-3 text-right text-rose-450">{formatCurrency(projection.opex_3y[2])}</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20 bg-violet-950/15">
                      <td className="p-3 text-violet-400 font-bold">Laba Bersih (Net Profit)</td>
                      <td className={`p-3 text-right font-bold ${
                        (projection.revenue_3y[0] - projection.cogs_3y[0] - projection.opex_3y[0]) >= 0 
                          ? 'text-violet-400' 
                          : 'text-rose-400'
                      }`}>
                        {formatCurrency(projection.revenue_3y[0] - projection.cogs_3y[0] - projection.opex_3y[0])}
                      </td>
                      <td className={`p-3 text-right font-bold ${
                        (projection.revenue_3y[1] - projection.cogs_3y[1] - projection.opex_3y[1]) >= 0 
                          ? 'text-violet-400' 
                          : 'text-rose-400'
                      }`}>
                        {formatCurrency(projection.revenue_3y[1] - projection.cogs_3y[1] - projection.opex_3y[1])}
                      </td>
                      <td className={`p-3 text-right font-bold ${
                        (projection.revenue_3y[2] - projection.cogs_3y[2] - projection.opex_3y[2]) >= 0 
                          ? 'text-violet-400' 
                          : 'text-rose-400'
                      }`}>
                        {formatCurrency(projection.revenue_3y[2] - projection.cogs_3y[2] - projection.opex_3y[2])}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-900">
                <span className="text-[10px] text-zinc-500 font-mono">
                  Calculated by FoundersFund AI Layer
                </span>
                <button
                  onClick={() => setProjection(null)}
                  className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 font-semibold"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Generate Ulang
                </button>
              </div>
            </div>

            {/* Growth Visualiser Graph */}
            <div className="rounded-xl border border-zinc-850 bg-zinc-900/20 p-5 flex flex-col">
              <h3 className="font-bold text-white flex items-center gap-1.5 mb-4">
                <TrendingUp className="h-4.5 w-4.5 text-violet-400" />
                Tren Pertumbuhan
              </h3>
              
              <div className="flex-1 flex flex-col justify-end space-y-4">
                {projection.revenue_3y.map((rev, i) => {
                  const maxRev = Math.max(...projection.revenue_3y);
                  const percentage = (rev / maxRev) * 100;
                  
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-zinc-300">
                        <span>Tahun {i + 1}</span>
                        <span className="text-white">{formatCurrency(rev)}</span>
                      </div>
                      <div className="h-3 w-full bg-zinc-950 border border-zinc-850 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed mt-6">
                *Visualisasi menunjukkan skala akselerasi omset pertahun berdasarkan kecerdasan LLM dalam memperkirakan pertumbuhan retensi pasar.
              </p>
            </div>

          </div>

          {/* Advice & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Risk Assessment */}
            <div className="rounded-xl border border-zinc-850 bg-zinc-900/20 p-5">
              <h3 className="font-bold text-white flex items-center gap-1.5 mb-4">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-400" />
                Analisis Risiko Finansial (Risk Assessment)
              </h3>
              <ul className="space-y-3">
                {projection.risks.map((risk, i) => (
                  <li key={i} className="flex gap-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategic Advice */}
            <div className="rounded-xl border border-zinc-850 bg-zinc-900/20 p-5">
              <h3 className="font-bold text-white flex items-center gap-1.5 mb-4">
                <Lightbulb className="h-4.5 w-4.5 text-amber-400" />
                Rekomendasi & Langkah Strategis AI
              </h3>
              <ul className="space-y-3">
                {projection.advice.map((item, i) => (
                  <li key={i} className="flex gap-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
