/**
 * Store Module Types
 */

import type { PaginatedResponse } from './core.types';

// ============================================================================
// VENDOR TYPES
// ============================================================================

export interface Vendor {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  college: number;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface VendorCreateInput {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
  college: number;
  is_active?: boolean;
  created_by?: string;
  updated_by?: string;
}

export interface VendorUpdateInput {
  name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  gstin?: string;
  college?: number;
  is_active?: boolean;
  updated_by?: string;
}

export interface VendorFilters {
  page?: number;
  page_size?: number;
  search?: string;
  college?: number;
  is_active?: boolean;
}

// ============================================================================
// STOCK RECEIPT TYPES
// ============================================================================

export interface StockReceipt {
  id: number;
  item: number;
  item_name?: string;
  vendor: number;
  vendor_name?: string;
  quantity: number;
  unit_price: string;
  total_amount: string;
  receive_date: string;
  invoice_number: string;
  invoice_file?: string;
  remarks?: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface StockReceiptCreateInput {
  item: number;
  vendor: number;
  quantity: number;
  unit_price: string;
  total_amount: string;
  receive_date: string;
  invoice_number: string;
  invoice_file?: string;
  remarks?: string;
  is_active?: boolean;
  created_by?: string;
  updated_by?: string;
}

export interface StockReceiptUpdateInput {
  item?: number;
  vendor?: number;
  quantity?: number;
  unit_price?: string;
  total_amount?: string;
  receive_date?: string;
  invoice_number?: string;
  invoice_file?: string;
  remarks?: string;
  is_active?: boolean;
  updated_by?: string;
}

export interface StockReceiptFilters {
  page?: number;
  page_size?: number;
  search?: string;
  item?: number;
  vendor?: number;
  receive_date?: string;
  is_active?: boolean;
}
