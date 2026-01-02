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
// ============================================================================
// CENTRAL STORE TYPES
// ============================================================================

export interface CentralStore {
  id: number;
  name: string;
  code: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  contact_phone: string;
  contact_email: string;
  is_active: boolean;
  manager: string;
  manager_name?: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface CentralStoreCreateInput {
  name: string;
  code: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  contact_phone: string;
  contact_email: string;
  is_active?: boolean;
  manager: string;
}

export interface CentralStoreUpdateInput {
  name?: string;
  code?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contact_phone?: string;
  contact_email?: string;
  is_active?: boolean;
  manager?: string;
}

export interface CentralStoreFilters {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  is_active?: boolean;
}

export interface CentralStoreInventory {
  item_name: string;
  quantity: number;
  unit: string;
  last_updated: string;
}

export interface CentralStoreStockSummary {
  total_items: number;
  total_value: number;
  low_stock_items: number;
  out_of_stock_items: number;
}
// ============================================================================
// CENTRAL INVENTORY TYPES
// ============================================================================

export interface CentralInventory {
  id: number;
  central_store: number;
  central_store_name?: string;
  item: number;
  item_name?: string;
  quantity_on_hand: number;
  quantity_allocated: number;
  quantity_available: number;
  min_stock_level: number;
  reorder_point: number;
  max_stock_level: number;
  unit_cost: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface CentralInventoryCreateInput {
  central_store: number;
  item: number;
  quantity_on_hand: number;
  quantity_allocated?: number;
  quantity_available?: number;
  min_stock_level: number;
  reorder_point: number;
  max_stock_level: number;
  unit_cost: string;
  is_active?: boolean;
}

export interface CentralInventoryUpdateInput {
  central_store?: number;
  item?: number;
  quantity_on_hand?: number;
  quantity_allocated?: number;
  quantity_available?: number;
  min_stock_level?: number;
  reorder_point?: number;
  max_stock_level?: number;
  unit_cost?: string;
  is_active?: boolean;
}

export interface CentralInventoryFilters {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  central_store?: number;
  item?: number;
  is_active?: boolean;
}
