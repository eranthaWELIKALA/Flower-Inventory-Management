// Replaced Supabase client with a lightweight REST API client to talk to the local MySQL + Prisma server.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export const supabase = {
  // kept name 'supabase' to minimize frontend changes; functions used in code will be replaced by REST calls
  from: (_table: string) => ({
    select: async (_q?: string) => {
      // For simple selects the components call `supabase.from('table').select('*').order(...)`
      const data = await request(`/${_table}`);
      return { data };
    },
    insert: async (payload: any) => {
      const data = await request(`/${_table}`, { method: 'POST', body: JSON.stringify(Array.isArray(payload) ? payload[0] : payload) });
      return { data };
    },
    update: async (payload: any) => {
      // update requires .eq('id', id) afterwards in code; we'll handle updates directly in components when needed via fetch
      return { data: null };
    },
    eq: () => ({})
  }),
  // simple helpers matching auth usage in AuthContext
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async ({ email, password }: any) => {
      const body = await request('/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) });
      return { data: body, error: null };
    },
    signUp: async ({ email, password }: any) => {
      const body = await request('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) });
      return { data: body, error: null };
    },
    signOut: async () => ({ data: null, error: null }),
  }
};

export type Supplier = {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type Flower = {
  id: string;
  name: string;
  variety?: string;
  color?: string;
  supplier_id?: string;
  current_stock: number;
  unit: string;
  cost_price?: number;
  selling_price?: number;
  reorder_level: number;
  image_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
};

export type Sale = {
  id: string;
  sale_date: string;
  total_amount: number;
  customer_name?: string;
  customer_phone?: string;
  payment_method: string;
  notes?: string;
  created_at: string;
};

export type SaleItem = {
  id: string;
  sale_id: string;
  flower_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  flower?: Flower;
};

export type StockMovement = {
  id: string;
  flower_id: string;
  movement_type: 'purchase' | 'sale' | 'adjustment' | 'return';
  quantity: number;
  reference_id?: string;
  notes?: string;
  created_at: string;
};
