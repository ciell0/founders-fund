// app/dashboard/page.tsx
"use client";

import * as React from "react";
import { DashboardContext } from "./layout";
import { 
  getTransactions, 
  createTransaction, 
  deleteTransaction, 
  isMockMode 
} from "@/lib/supabase";
import { CashFlowChart } from "@/components/ui/chart";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Plus, 
  Trash2, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Loader2, 
  Info, 
  Tag 
} from "lucide-react";

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  created_at: string;
}

export default function RunwayTrackerPage() {
  const { activeStartup } = React.useContext(DashboardContext);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Chart and display preferences
  const [chartType, setChartType] = React.useState<'line' | 'bar'>('line');

  // Form states
  const [isOpenAddModal, setIsOpenAddModal] = React.useState(false);
  const [type, setType] = React.useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [category, setCategory] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [addLoading, setAddLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchTransactions = React.useCallback(async () => {
    if (!activeStartup) return;
    setLoading(true);
    const { data, error: fetchErr } = await getTransactions(activeStartup.id);
    if (!fetchErr && data) {
      // Cast amounts to number since PostgreSQL DECIMAL returns as string
      const parsed = data.map((t: any) => ({
        ...t,
        amount: Number(t.amount)
      }));
      setTransactions(parsed);
    }
    setLoading(false);
  }, [activeStartup]);

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStartup || !amount || Number(amount) <= 0) return;
    setAddLoading(true);
    setError(null);

    const { error: addErr } = await createTransaction(
      activeStartup.id,
      type,
      category,
      Number(amount),
      description
    );

    if (addErr) {
      setError(addErr.message);
      setAddLoading(false);
    } else {
      setCategory("");
      setAmount("");
      setDescription("");
      setIsOpenAddModal(false);
      setAddLoading(false);
      fetchTransactions();
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;
    const { error: delErr } = await deleteTransaction(id);
    if (!delErr) {
      fetchTransactions();
    }
  };

  // Pre-fill categories helper
  const expenseCategories = ["Sewa Cloud / Server", "Gaji Tim", "Pemasaran", "Legalitas & Lisensi", "Konsumsi & Operasional", "Perangkat Keras"];
  const incomeCategories = ["Hibah / Grant", "Hadiah Lomba", "Modal Sendiri (Bootstrapping)", "Penjualan Produk", "Pendanaan Angel"];

  // --- CALCULATE KEY METRICS ---
  
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  // Compute burn rate: Group expenses by Month-Year, then average them.
  // If there are no expenses, burn rate is 0.
  const getBurnRate = () => {
    const expenses = transactions.filter(t => t.type === 'EXPENSE');
    if (expenses.length === 0) return 0;

    const monthlyExpenses: { [key: string]: number } = {};
    expenses.forEach(e => {
      const monthYear = new Date(e.created_at).toISOString().substring(0, 7); // "YYYY-MM"
      monthlyExpenses[monthYear] = (monthlyExpenses[monthYear] || 0) + e.amount;
    });

    const months = Object.keys(monthlyExpenses);
    const sum = Object.values(monthlyExpenses).reduce((a, b) => a + b, 0);
    return sum / (months.length || 1);
  };

  const monthlyBurnRate = getBurnRate();

  // Runway calculation: runway = balance / monthly burn rate
  const getRunway = () => {
    if (currentBalance <= 0) return { val: 0, text: "0 Bulan (Habis)" };
    if (monthlyBurnRate <= 0) return { val: Infinity, text: "∞ Bulan (Aman)" };
    const runwayMonths = currentBalance / monthlyBurnRate;
    return { 
      val: runwayMonths, 
      text: `${runwayMonths.toFixed(1)} Bulan` 
    };
  };

  const runway = getRunway();

  // --- PREPARE CHART DATA ---

  const getChartData = () => {
    // Sort transactions chronological
    const sorted = [...transactions].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    if (sorted.length === 0) return [];

    if (chartType === 'line') {
      // Cumulative balance chart over transactions
      let runningBalance = 0;
      return sorted.map((t, idx) => {
        if (t.type === 'INCOME') runningBalance += t.amount;
        else runningBalance -= t.amount;
        
        return {
          label: new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
          value: runningBalance,
        };
      });
    } else {
      // Group by month to show Income vs Expense comparison
      const monthlyGroups: { [key: string]: { income: number; expense: number } } = {};
      
      sorted.forEach(t => {
        const monthLabel = new Date(t.created_at).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
        if (!monthlyGroups[monthLabel]) {
          monthlyGroups[monthLabel] = { income: 0, expense: 0 };
        }
        if (t.type === 'INCOME') {
          monthlyGroups[monthLabel].income += t.amount;
        } else {
          monthlyGroups[monthLabel].expense += t.amount;
        }
      });

      return Object.keys(monthlyGroups).map(label => ({
        label,
        value: monthlyGroups[label].income - monthlyGroups[label].expense,
        income: monthlyGroups[label].income,
        expense: monthlyGroups[label].expense,
      }));
    }
  };

  const chartData = getChartData();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (!activeStartup) return null;

  return (
    <div className="space-y-6">
      
      {/* Page Title & Add CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Runway & Ledger Dana</h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Pantau arus kas (cash flow) startup Anda secara berkala untuk menghindari kehabisan modal.
          </p>
        </div>
        <button
          onClick={() => setIsOpenAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          Tambah Transaksi
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Balance */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-3 opacity-[0.03]">
            <DollarSign className="h-24 w-24 text-white" />
          </div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Saldo Sekarang (Current Balance)</p>
          <h3 className={`text-2xl sm:text-3xl font-bold mt-2 truncate ${currentBalance >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {formatCurrency(currentBalance)}
          </h3>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-0.5 text-emerald-400">
              <ArrowUpRight className="h-3 w-3" />
              {formatCurrency(totalIncome)}
            </span>
            <span>masuk</span>
            <span className="text-zinc-600">|</span>
            <span className="inline-flex items-center gap-0.5 text-rose-400">
              <ArrowDownRight className="h-3 w-3" />
              {formatCurrency(totalExpense)}
            </span>
            <span>keluar</span>
          </div>
        </div>

        {/* Card 2: Burn Rate */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-3 opacity-[0.03]">
            <TrendingDown className="h-24 w-24 text-rose-500" />
          </div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Burn Rate Bulanan (Pengeluaran)</p>
          <h3 className="text-2xl sm:text-3xl font-bold mt-2 text-rose-400 truncate">
            {formatCurrency(monthlyBurnRate)}
          </h3>
          <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
            Rata-rata dana habis per bulan dihitung dari total biaya operasional yang keluar.
          </p>
        </div>

        {/* Card 3: Runway */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-3 opacity-[0.03]">
            <TrendingUp className="h-24 w-24 text-violet-500" />
          </div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Estimasi Runway (Sisa Waktu)</p>
          <h3 className={`text-2xl sm:text-3xl font-bold mt-2 ${runway.val < 3 ? "text-rose-400" : runway.val < 6 ? "text-amber-400" : "text-violet-400"}`}>
            {runway.text}
          </h3>
          
          {/* Progress runway safety visualization */}
          <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                runway.val < 3 ? "bg-rose-500" : runway.val < 6 ? "bg-amber-500" : "bg-violet-500"
              }`} 
              style={{ width: `${Math.min((runway.val / 12) * 100, 100)}%` }} 
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1.5">
            <span>Kritis (0 bln)</span>
            <span>Target Aman (6+ bln)</span>
          </div>
        </div>

      </div>

      {/* Cash Flow Visualizer Panel */}
      <div className="rounded-xl border border-zinc-850 bg-zinc-900/20 p-5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Visualisasi Arus Kas</h3>
            <p className="text-zinc-500 text-xs">Menunjukkan tren kas atau perbandingan pemetaan pemasukan dan pengeluaran.</p>
          </div>
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                chartType === 'line' 
                  ? 'bg-violet-600 text-white' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Tren Saldo
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                chartType === 'bar' 
                  ? 'bg-violet-600 text-white' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Masuk vs Keluar
            </button>
          </div>
        </div>

        <div className="p-2 border border-zinc-800 bg-zinc-950/40 rounded-xl">
          <CashFlowChart data={chartData} type={chartType} />
        </div>
      </div>

      {/* Ledger Table Section */}
      <div className="rounded-xl border border-zinc-850 bg-zinc-900/20 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-900 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">Buku Transaksi (Ledger)</h3>
            <p className="text-zinc-500 text-xs">Catatan detail pemasukan hibah/hadiah dan pengeluaran operasional.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center text-zinc-500 text-sm">
            <Loader2 className="h-6 w-6 animate-spin text-violet-500 mr-2" />
            Memuat tabel transaksi...
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-6">
            <Calendar className="h-8 w-8 text-zinc-600 mb-2" />
            <p className="text-sm text-zinc-400 font-medium">Belum ada transaksi terdaftar.</p>
            <p className="text-xs text-zinc-600 mt-1 max-w-sm">
              Klik &quot;Tambah Transaksi&quot; di atas untuk mencatatkan dana hibah, hadiah lomba, atau beban biaya pertama Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-950/60 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500">
                  <th className="py-3.5 px-5">Tanggal</th>
                  <th className="py-3.5 px-5">Tipe</th>
                  <th className="py-3.5 px-5">Kategori</th>
                  <th className="py-3.5 px-5">Deskripsi</th>
                  <th className="py-3.5 px-5 text-right">Jumlah</th>
                  <th className="py-3.5 px-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-xs sm:text-sm">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-900/30 transition-colors group">
                    <td className="py-3 px-5 text-zinc-400">
                      {new Date(t.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        t.type === 'INCOME' 
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                          : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                      }`}>
                        {t.type === 'INCOME' ? 'MASUK' : 'KELUAR'}
                      </span>
                    </td>
                    <td className="py-3 px-5 font-semibold text-zinc-300">
                      {t.category}
                    </td>
                    <td className="py-3 px-5 text-zinc-450 truncate max-w-[150px] sm:max-w-xs" title={t.description}>
                      {t.description || "-"}
                    </td>
                    <td className={`py-3 px-5 text-right font-bold ${
                      t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="py-3 px-5 text-center">
                      <button
                        onClick={() => handleDeleteTransaction(t.id)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-rose-950/20 hover:text-rose-400 transition-colors md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Hapus transaksi"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Transaction Dialog */}
      {isOpenAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setIsOpenAddModal(false)}
          />
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
              <h3 className="text-lg font-bold text-white">Catat Transaksi Baru</h3>
              <button 
                onClick={() => setIsOpenAddModal(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
              >
                <Trash2 className="h-4 w-4 rotate-45" /> {/* Close mark */}
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-rose-500/15 border border-rose-500/30 p-3 text-sm text-rose-400">
                {error}
              </div>
            )}

            <form onSubmit={handleAddTransaction} className="space-y-4">
              
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Tipe Aliran Dana</label>
                <div className="grid grid-cols-2 gap-2 rounded-lg border border-zinc-900 bg-zinc-950 p-1">
                  <button
                    type="button"
                    onClick={() => { setType('EXPENSE'); setCategory(""); }}
                    className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition-all ${
                      type === 'EXPENSE' 
                        ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <ArrowDownRight className="h-3.5 w-3.5" />
                    Pengeluaran
                  </button>
                  <button
                    type="button"
                    onClick={() => { setType('INCOME'); setCategory(""); }}
                    className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition-all ${
                      type === 'INCOME' 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    Pemasukan
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Jumlah (Rupiah)</label>
                <div className="mt-1.5 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 text-xs font-bold">Rp</span>
                  <input
                    type="number"
                    required
                    min="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    placeholder="1500000"
                  />
                </div>
              </div>

              {/* Category selector / text input */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Kategori</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 px-3 text-sm text-zinc-100 placeholder-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="Pilih atau ketik kategori..."
                />
                
                {/* Suggestions List */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(type === 'EXPENSE' ? expenseCategories : incomeCategories).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className="inline-flex items-center gap-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 px-2 py-1 text-[10px] text-zinc-400"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Keterangan / Memo</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="mt-1.5 block w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 px-3 text-sm text-zinc-100 placeholder-zinc-700 focus:border-violet-500 focus:outline-none"
                  placeholder="Misal: Pembayaran langganan Vercel Pro & AWS Cloud"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenAddModal(false)}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-500 transition-colors"
                >
                  {addLoading ? (
                    <>
                      <Loader2 className="h-3 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      Simpan Transaksi
                      <Plus className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
