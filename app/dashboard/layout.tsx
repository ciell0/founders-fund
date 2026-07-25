// app/dashboard/layout.tsx
"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  getUser, 
  getStartups, 
  createStartup, 
  signOut, 
  isMockMode 
} from "@/lib/supabase";
import { 
  TrendingUp, 
  Wallet, 
  BarChart3, 
  ClipboardCheck, 
  LogOut, 
  Menu, 
  X, 
  Building, 
  Plus, 
  Loader2, 
  ChevronDown 
} from "lucide-react";

interface Startup {
  id: string;
  name: string;
  industry: string;
}

interface DashboardContextType {
  startups: Startup[];
  activeStartup: Startup | null;
  setActiveStartup: (startup: Startup) => void;
  refreshStartups: () => Promise<void>;
  loading: boolean;
}

export const DashboardContext = React.createContext<DashboardContextType>({
  startups: [],
  activeStartup: null,
  setActiveStartup: () => {},
  refreshStartups: async () => {},
  loading: true,
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<any>(null);
  const [startups, setStartups] = React.useState<Startup[]>([]);
  const [activeStartup, setActiveStartupState] = React.useState<Startup | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  
  // Create startup form state
  const [newStartupName, setNewStartupName] = React.useState("");
  const [newStartupIndustry, setNewStartupIndustry] = React.useState("");
  const [createLoading, setCreateLoading] = React.useState(false);
  const [createError, setCreateError] = React.useState<string | null>(null);

  const fetchUserData = React.useCallback(async () => {
    setLoading(true);
    const { data: { user: currentUser } } = await getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);

    // Fetch startups
    const { data: startupList, error } = await getStartups();
    if (!error && startupList) {
      setStartups(startupList);
      
      // Auto-select startup
      if (startupList.length > 0) {
        // Try to load active startup ID from localStorage
        const savedId = typeof window !== 'undefined' ? localStorage.getItem('foundersfund_active_id') : null;
        const matched = startupList.find(s => s.id === savedId);
        setActiveStartupState(matched || startupList[0]);
      } else {
        setActiveStartupState(null);
      }
    }
    setLoading(false);
  }, [router]);

  React.useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const setActiveStartup = (startup: Startup) => {
    setActiveStartupState(startup);
    if (typeof window !== 'undefined') {
      localStorage.setItem('foundersfund_active_id', startup.id);
    }
    setShowDropdown(false);
  };

  const refreshStartups = async () => {
    const { data: startupList } = await getStartups();
    if (startupList) {
      setStartups(startupList);
      if (startupList.length > 0) {
        if (!activeStartup || !startupList.some(s => s.id === activeStartup.id)) {
          setActiveStartup(startupList[0]);
        }
      }
    }
  };

  const handleCreateStartup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStartupName.trim()) return;
    setCreateLoading(true);
    setCreateError(null);

    const { data, error } = await createStartup(newStartupName, newStartupIndustry);
    if (error) {
      setCreateError(error.message);
      setCreateLoading(false);
    } else if (data) {
      const created: Startup = data;
      setNewStartupName("");
      setNewStartupIndustry("");
      setShowCreateModal(false);
      setCreateLoading(false);
      
      // Refresh and select
      await refreshStartups();
      setActiveStartup(created);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const menuItems = [
    { name: "Runway & Transaksi", href: "/dashboard", icon: Wallet },
    { name: "AI Financial Projection", href: "/dashboard/projections", icon: BarChart3 },
    { name: "Literacy Checklist", href: "/dashboard/checklist", icon: ClipboardCheck },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <span className="text-sm font-medium">Memuat data keuangan...</span>
        </div>
      </div>
    );
  }

  // ONBOARDING SCREEN: If logged in but has no startups registered
  if (startups.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-950">
        <div className="absolute -top-16 -left-16 h-80 w-80 rounded-full bg-violet-600/10 blur-[90px]" />
        
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-md shadow-2xl relative">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 mb-4 animate-bounce">
              <Building className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">Daftarkan Startup-mu</h2>
            <p className="mt-1.5 text-sm text-zinc-400">
              Sebelum memproyeksikan keuangan, masukkan detail startup tim Anda terlebih dahulu.
            </p>
          </div>

          {createError && (
            <div className="mb-4 rounded-lg bg-rose-500/15 border border-rose-500/30 p-3 text-sm text-rose-400">
              {createError}
            </div>
          )}

          <form onSubmit={handleCreateStartup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Nama Startup / Proyek
              </label>
              <input
                type="text"
                required
                value={newStartupName}
                onChange={(e) => setNewStartupName(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 px-3.5 text-sm text-zinc-100 placeholder-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Misal: AgriTech Pintar, EduFun"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Sektor Industri / Kategori
              </label>
              <input
                type="text"
                required
                value={newStartupIndustry}
                onChange={(e) => setNewStartupIndustry(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 px-3.5 text-sm text-zinc-100 placeholder-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Misal: Pertanian, EdTech, Fintech"
              />
            </div>

            <button
              type="submit"
              disabled={createLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-all"
            >
              {createLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mendaftarkan...
                </>
              ) : (
                <>
                  Buat Profil Startup
                  <Plus className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <button
            onClick={handleLogout}
            className="mt-6 flex w-full items-center justify-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar Akun
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={{ startups, activeStartup, setActiveStartup, refreshStartups, loading }}>
      <div className="flex min-h-screen bg-zinc-950">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 h-screen p-4 z-20">
          <div className="flex items-center gap-2.5 px-2 mb-8">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
            <span className="font-bold text-lg text-white">FoundersFund</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-violet-600/10 border-l-2 border-violet-500 text-violet-300"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer User Info */}
          <div className="border-t border-zinc-900 pt-4 mt-auto">
            <div className="px-2 mb-3">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Pengguna</p>
              <p className="text-xs font-medium text-zinc-300 truncate mt-0.5">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative flex flex-col w-64 max-w-xs bg-zinc-950 border-r border-zinc-900 p-5 z-10 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-violet-400" />
                  <span className="font-bold text-lg text-white">FoundersFund</span>
                </div>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5 text-zinc-400" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-violet-600/10 border-l-2 border-violet-500 text-violet-300"
                          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-zinc-900 pt-4 mt-auto">
                <div className="px-2 mb-3">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Pengguna</p>
                  <p className="text-xs font-medium text-zinc-300 truncate mt-0.5">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header Dashboard */}
          <header className="sticky top-0 z-30 h-16 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-900"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {/* Startup Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-zinc-900 transition-colors"
                >
                  <Building className="h-4 w-4 text-violet-400" />
                  <span>{activeStartup?.name}</span>
                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                    <div className="absolute left-0 mt-2 w-56 rounded-lg border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl z-50">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-2 py-1">Pilih Startup</p>
                      <div className="max-h-48 overflow-y-auto space-y-0.5">
                        {startups.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setActiveStartup(s)}
                            className={`w-full flex items-center justify-between rounded-md px-2 py-1.5 text-left text-xs sm:text-sm transition-colors ${
                              activeStartup?.id === s.id
                                ? "bg-violet-600/15 text-violet-300 font-medium"
                                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                            }`}
                          >
                            <span>{s.name}</span>
                            <span className="text-[10px] text-zinc-500">{s.industry}</span>
                          </button>
                        ))}
                      </div>
                      
                      <div className="border-t border-zinc-900 my-1" />
                      <button
                        onClick={() => {
                          setShowCreateModal(true);
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs sm:text-sm font-semibold text-violet-400 hover:bg-violet-500/10 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Tambah Startup Baru
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isMockMode() && (
                <span className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                  Demo Mode
                </span>
              )}
              <span className="hidden sm:inline-flex items-center rounded-full bg-violet-600/10 border border-violet-500/20 px-2.5 py-0.5 text-xs font-semibold text-violet-300">
                10th IndonesiaNEXT
              </span>
            </div>
          </header>

          {/* Main Panel */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>

        {/* Create Startup Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />
            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
                <h3 className="text-lg font-bold text-white">Tambah Startup Baru</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {createError && (
                <div className="mb-4 rounded-lg bg-rose-500/15 border border-rose-500/30 p-3 text-sm text-rose-400">
                  {createError}
                </div>
              )}

              <form onSubmit={handleCreateStartup} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Nama Startup / Proyek
                  </label>
                  <input
                    type="text"
                    required
                    value={newStartupName}
                    onChange={(e) => setNewStartupName(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 px-3 text-sm text-zinc-100 placeholder-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    placeholder="Misal: AgriTech Pintar"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Sektor Industri
                  </label>
                  <input
                    type="text"
                    required
                    value={newStartupIndustry}
                    onChange={(e) => setNewStartupIndustry(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 px-3 text-sm text-zinc-100 placeholder-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    placeholder="Misal: Pertanian"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-500 transition-colors"
                  >
                    {createLoading ? (
                      <>
                        <Loader2 className="h-3 animate-spin" />
                        Membuat...
                      </>
                    ) : (
                      <>
                        Buat Startup
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
    </DashboardContext.Provider>
  );
}
