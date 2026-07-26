// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase only if credentials exist
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isMockMode = () => !supabase;

// Mock database structures for local fallback
interface MockUser {
  id: string;
  email: string;
}

interface MockStartup {
  id: string;
  user_id: string;
  name: string;
  industry: string;
  created_at: string;
}

interface MockTransaction {
  id: string;
  startup_id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  created_at: string;
}

interface MockProjection {
  id: string;
  startup_id: string;
  projection_data: any;
  created_at: string;
}

interface MockAnalysis {
  id: string;
  startup_id: string;
  analysis_data: any;
  created_at: string;
}

interface MockChecklistItem {
  id: string;
  startup_id: string;
  item_key: string;
  is_completed: boolean;
  created_at: string;
}

// LocalStorage helpers for mock mode
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const item = localStorage.getItem(`foundersfund_${key}`);
  return item ? JSON.parse(item) : defaultValue;
};

const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`foundersfund_${key}`, JSON.stringify(value));
};

// --- AUTHENTICATION ---

export const signUp = async (email: string, password: string) => {
  if (!supabase) {
    // Mock Sign Up
    const users = getStorageItem<MockUser[]>('users', []);
    if (users.some(u => u.email === email)) {
      return { data: { user: null }, error: { message: 'User already exists' } };
    }
    const newUser: MockUser = { id: Math.random().toString(36).substr(2, 9), email };
    users.push(newUser);
    setStorageItem('users', users);
    setStorageItem('current_user', newUser);
    return { data: { user: newUser }, error: null };
  }

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  } catch (err: any) {
    return { data: { user: null }, error: { message: err.message || 'Signup failed' } };
  }
};

export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    // Mock Sign In
    const users = getStorageItem<MockUser[]>('users', []);
    const user = users.find(u => u.email === email);
    if (!user) {
      return { data: { user: null }, error: { message: 'Invalid credentials' } };
    }
    setStorageItem('current_user', user);
    return { data: { user }, error: null };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  } catch (err: any) {
    return { data: { user: null }, error: { message: err.message || 'Signin failed' } };
  }
};

export const signOut = async () => {
  if (!supabase) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('foundersfund_current_user');
    }
    return { error: null };
  }

  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getUser = async () => {
  if (!supabase) {
    const user = getStorageItem<MockUser | null>('current_user', null);
    return { data: { user }, error: null };
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { data: { user }, error };
  } catch (err) {
    return { data: { user: null }, error: err };
  }
};

// --- STARTUPS ---

export const getStartups = async () => {
  if (!supabase) {
    const user = getStorageItem<MockUser | null>('current_user', null);
    if (!user) return { data: [], error: { message: 'Unauthorized' } };
    const startups = getStorageItem<MockStartup[]>('startups', []);
    const userStartups = startups.filter(s => s.user_id === user.id);
    return { data: userStartups, error: null };
  }

  const { data, error } = await supabase
    .from('startups')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data || [], error };
};

export const createStartup = async (name: string, industry: string) => {
  if (!supabase) {
    const user = getStorageItem<MockUser | null>('current_user', null);
    if (!user) return { data: null, error: { message: 'Unauthorized' } };
    const startups = getStorageItem<MockStartup[]>('startups', []);
    const newStartup: MockStartup = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: user.id,
      name,
      industry,
      created_at: new Date().toISOString(),
    };
    startups.push(newStartup);
    setStorageItem('startups', startups);
    return { data: newStartup, error: null };
  }

  const { data, error } = await supabase
    .from('startups')
    .insert([{ name, industry }])
    .select()
    .single();
  return { data, error };
};

// --- TRANSACTIONS ---

export const getTransactions = async (startupId: string) => {
  if (!supabase) {
    const transactions = getStorageItem<MockTransaction[]>('transactions', []);
    const filtered = transactions.filter(t => t.startup_id === startupId);
    return { data: filtered, error: null };
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('startup_id', startupId)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
};

export const createTransaction = async (
  startupId: string,
  type: 'INCOME' | 'EXPENSE',
  category: string,
  amount: number,
  description: string
) => {
  if (!supabase) {
    const transactions = getStorageItem<MockTransaction[]>('transactions', []);
    const newTransaction: MockTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      startup_id: startupId,
      type,
      category,
      amount: Number(amount),
      description,
      created_at: new Date().toISOString(),
    };
    transactions.unshift(newTransaction);
    setStorageItem('transactions', transactions);
    return { data: newTransaction, error: null };
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert([{ startup_id: startupId, type, category, amount, description }])
    .select()
    .single();
  return { data, error };
};

export const deleteTransaction = async (id: string) => {
  if (!supabase) {
    const transactions = getStorageItem<MockTransaction[]>('transactions', []);
    const filtered = transactions.filter(t => t.id !== id);
    setStorageItem('transactions', filtered);
    return { error: null };
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  return { error };
};

// --- FINANCIAL PROJECTIONS ---

export const getProjections = async (startupId: string) => {
  if (!supabase) {
    const projections = getStorageItem<MockProjection[]>('projections', []);
    const filtered = projections.filter(p => p.startup_id === startupId);
    return { data: filtered, error: null };
  }

  const { data, error } = await supabase
    .from('financial_projections')
    .select('*')
    .eq('startup_id', startupId)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
};

export const saveProjection = async (startupId: string, projectionData: any) => {
  if (!supabase) {
    const projections = getStorageItem<MockProjection[]>('projections', []);
    // Remove old projections for this startup if we only want the latest
    const filtered = projections.filter(p => p.startup_id !== startupId);
    const newProjection: MockProjection = {
      id: Math.random().toString(36).substr(2, 9),
      startup_id: startupId,
      projection_data: projectionData,
      created_at: new Date().toISOString(),
    };
    filtered.unshift(newProjection);
    setStorageItem('projections', filtered);
    return { data: newProjection, error: null };
  }

  // Delete older projections first to keep ledger tidy
  await supabase.from('financial_projections').delete().eq('startup_id', startupId);

  const { data, error } = await supabase
    .from('financial_projections')
    .insert([{ startup_id: startupId, projection_data: projectionData }])
    .select()
    .single();
  return { data, error };
};

// --- FINANCIAL LITERACY CHECKLIST ---

export const getChecklist = async (startupId: string) => {
  if (!supabase) {
    const checklist = getStorageItem<MockChecklistItem[]>('checklist', []);
    const filtered = checklist.filter(c => c.startup_id === startupId);
    return { data: filtered, error: null };
  }

  const { data, error } = await supabase
    .from('checklist_items')
    .select('*')
    .eq('startup_id', startupId);
  return { data: data || [], error };
};

// --- AI ANALYSIS ---

export const getAnalysis = async (startupId: string) => {
  if (!supabase) {
    const analyses = getStorageItem<MockAnalysis[]>('analyses', []);
    const filtered = analyses.filter(a => a.startup_id === startupId);
    return { data: filtered, error: null };
  }

  const { data, error } = await supabase
    .from('ai_analysis')
    .select('*')
    .eq('startup_id', startupId)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
};

export const saveAnalysis = async (startupId: string, analysisData: any) => {
  if (!supabase) {
    const analyses = getStorageItem<MockAnalysis[]>('analyses', []);
    const filtered = analyses.filter(a => a.startup_id !== startupId);
    const newAnalysis: MockAnalysis = {
      id: Math.random().toString(36).substr(2, 9),
      startup_id: startupId,
      analysis_data: analysisData,
      created_at: new Date().toISOString(),
    };
    filtered.unshift(newAnalysis);
    setStorageItem('analyses', filtered);
    return { data: newAnalysis, error: null };
  }

  await supabase.from('ai_analysis').delete().eq('startup_id', startupId);

  const { data, error } = await supabase
    .from('ai_analysis')
    .insert([{ startup_id: startupId, analysis_data: analysisData }])
    .select()
    .single();
  return { data, error };
};

export const updateChecklist = async (startupId: string, itemKey: string, isCompleted: boolean) => {
  if (!supabase) {
    const checklist = getStorageItem<MockChecklistItem[]>('checklist', []);
    const idx = checklist.findIndex(c => c.startup_id === startupId && c.item_key === itemKey);
    if (idx !== -1) {
      checklist[idx].is_completed = isCompleted;
    } else {
      checklist.push({
        id: Math.random().toString(36).substr(2, 9),
        startup_id: startupId,
        item_key: itemKey,
        is_completed: isCompleted,
        created_at: new Date().toISOString(),
      });
    }
    setStorageItem('checklist', checklist);
    return { error: null };
  }

  const { error } = await supabase
    .from('checklist_items')
    .upsert({ startup_id: startupId, item_key: itemKey, is_completed: isCompleted }, { onConflict: 'startup_id,item_key' });
  return { error };
};
