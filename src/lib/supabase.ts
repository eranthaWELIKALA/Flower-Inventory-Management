import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
