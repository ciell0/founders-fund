// app/dashboard/checklist/page.tsx
"use client";

import * as React from "react";
import { DashboardContext } from "../layout";
import { getChecklist, updateChecklist } from "@/lib/supabase";
import { 
  CheckCircle2, 
  Circle, 
  Trophy, 
  Loader2, 
  FileText, 
  CreditCard, 
  AlertTriangle, 
  Scale, 
  BookOpen 
} from "lucide-react";

interface ChecklistItem {
  key: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  details: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    key: "equity_split",
    title: "Pembagian Equity Pendiri",
    description: "Sepakati porsi kepemilikan saham di antara para co-founder sejak awal.",
    icon: Scale,
    details: "Buat Founder Agreement tertulis yang mengatur hak suara, vesting schedule (saham dicairkan bertahap, misal 4 tahun), dan mekanisme jika salah satu co-founder mengundurkan diri agar modal & kepemilikan startup tetap terlindungi."
  },
  {
    key: "separate_accounts",
    title: "Pemisahan Rekening Tim vs Pribadi",
    description: "Pastikan dana operasional bisnis tidak bercampur dengan uang pribadi.",
    icon: CreditCard,
    details: "Buka rekening bank atas nama tim/startup atau gunakan dompet digital terdedikasi. Pencampuran rekening menyulitkan audit pajak, perhitungan profitabilitas riil, dan tidak profesional di mata investor."
  },
  {
    key: "emergency_fund",
    title: "Alokasi Dana Darurat",
    description: "Sisihkan cadangan kas minimal 3-6 bulan pengeluaran operasional tetap.",
    icon: AlertTriangle,
    details: "Gunakan Ledger di dashboard FoundersFund untuk menghitung burn rate bulanan Anda, lalu kalikan 3 atau 6. Simpan dana darurat ini di instrumen likuid (tabungan/deposito) untuk menjaga kelangsungan operasional jika terjadi krisis."
  },
  {
    key: "basic_legality",
    title: "Legalitas Dasar Rintisan (NIB/PT)",
    description: "Miliki Nomor Induk Berusaha (NIB) atau badan hukum pendukung.",
    icon: FileText,
    details: "Untuk tingkat mahasiswa, buat NIB terlebih dahulu melalui portal OSS (Gratis). Jika produk siap komersialisasi penuh, pertimbangkan mendirikan PT Perorangan (sangat ramah mahasiswa) atau CV untuk memisahkan tanggung jawab hukum bisnis."
  },
  {
    key: "financial_ledger",
    title: "Sistem Pencatatan Transaksi",
    description: "Menetapkan SOP pencatatan pengeluaran & pemasukan harian secara disiplin.",
    icon: BookOpen,
    details: "Tunjuk satu anggota tim sebagai PIC keuangan. Catat setiap transaksi sekecil apa pun (seperti langganan hosting, pembelian domain, biaya cetak pamflet) di ledger FoundersFund agar runway dana hibah Anda selalu terpantau."
  }
];

export default function ChecklistPage() {
  const { activeStartup } = React.useContext(DashboardContext);
  const [completedKeys, setCompletedKeys] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [updatingKey, setUpdatingKey] = React.useState<string | null>(null);

  const fetchChecklist = React.useCallback(async () => {
    if (!activeStartup) return;
    setLoading(true);
    const { data, error } = await getChecklist(activeStartup.id);
    if (!error && data) {
      const keys = data.filter((c: any) => c.is_completed).map((c: any) => c.item_key);
      setCompletedKeys(keys);
    }
    setLoading(false);
  }, [activeStartup]);

  React.useEffect(() => {
    fetchChecklist();
  }, [fetchChecklist]);

  const handleToggleItem = async (itemKey: string) => {
    if (!activeStartup) return;
    setUpdatingKey(itemKey);

    const isCurrentlyCompleted = completedKeys.includes(itemKey);
    const newCompletedState = !isCurrentlyCompleted;

    const { error } = await updateChecklist(activeStartup.id, itemKey, newCompletedState);

    if (!error) {
      if (newCompletedState) {
        setCompletedKeys(prev => [...prev, itemKey]);
      } else {
        setCompletedKeys(prev => prev.filter(k => k !== itemKey));
      }
    }

    setUpdatingKey(null);
  };

  const progressPercentage = Math.round((completedKeys.length / CHECKLIST_ITEMS.length) * 100);

  if (!activeStartup) return null;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-500 text-sm">
        <Loader2 className="h-6 w-6 animate-spin text-violet-500 mr-2" />
        Memuat progress checklist literasi...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Literacy & Financial Checklist</h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Bangun tata kelola keuangan startup sehat sejak dini. Centang progress untuk menyimpan status per startup.
          </p>
        </div>
      </div>

      {/* Progress Dashboard Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-[-40px] right-[-40px] h-32 w-32 rounded-full bg-violet-600/10 blur-2xl" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Progress Kesehatan Finansial</h3>
            <p className="text-xs text-zinc-400">Penuhi semua checklist untuk fondasi bisnis kokoh siap pitching.</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-violet-400">{progressPercentage}%</span>
            <span className="text-xs text-zinc-500 ml-1">Selesai</span>
          </div>
        </div>

        {/* Glow progress bar */}
        <div className="h-2.5 w-full bg-zinc-950 border border-zinc-850 rounded-full mt-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-500 transition-all duration-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Congratulations celebration banner */}
      {progressPercentage === 100 && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Selamat! Startup Anda Berada di Jalur Finansial yang Sehat!</h4>
            <p className="text-xs text-zinc-400 mt-1">
              Semua checklist literasi dasar keuangan telah terpenuhi. Unit economics dan tata kelola dana Anda kini siap dipresentasikan di hadapan juri IndonesiaNEXT Hackathon.
            </p>
          </div>
        </div>
      )}

      {/* Checklist List */}
      <div className="space-y-4">
        {CHECKLIST_ITEMS.map((item, idx) => {
          const isCompleted = completedKeys.includes(item.key);
          const Icon = item.icon;
          
          return (
            <div 
              key={item.key} 
              className={`rounded-xl border transition-all duration-300 p-5 ${
                isCompleted 
                  ? 'border-emerald-500/20 bg-emerald-500/[0.02]' 
                  : 'border-zinc-850 bg-zinc-900/10'
              }`}
            >
              <div className="flex items-start gap-4">
                
                {/* Checkbox Trigger */}
                <button
                  disabled={updatingKey === item.key}
                  onClick={() => handleToggleItem(item.key)}
                  className={`mt-1 rounded-full p-0.5 transition-colors shrink-0 ${
                    isCompleted 
                      ? 'text-emerald-400 hover:text-emerald-500' 
                      : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {updatingKey === item.key ? (
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <h3 className={`text-base font-bold flex items-center gap-2 ${
                      isCompleted ? 'text-zinc-300 line-through' : 'text-white'
                    }`}>
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${isCompleted ? 'text-emerald-400/50' : 'text-violet-400'}`} />
                      {idx + 1}. {item.title}
                    </h3>
                    <span className={`inline-flex self-start rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isCompleted 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                        : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
                    }`}>
                      {isCompleted ? 'SELESAI' : 'BELUM'}
                    </span>
                  </div>
                  
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                  
                  {/* Detailed guidance dropdown block */}
                  <div className="mt-3.5 pt-3.5 border-t border-zinc-900/60 text-xs text-zinc-500 leading-relaxed bg-zinc-950/20 p-3 rounded-lg border border-zinc-850/30">
                    <strong className="text-zinc-400 block mb-1">Panduan Praktis:</strong>
                    {item.details}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
