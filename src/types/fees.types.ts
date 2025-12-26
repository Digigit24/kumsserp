/**
 * Fees Module Types for KUMSS ERP
 * All types matching Django backend models
 */

import { UserBasic } from './accounts.types';

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface AuditFields {
  created_by: UserBasic | null;
  updated_by: UserBasic | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// FEE MASTER TYPES
// ============================================================================

export interface FeeMaster extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  fee_type: string;
  name: string;
  code: string;
  description: string | null;
  is_mandatory: boolean;
  is_refundable: boolean;
  display_order: number;
  is_active: boolean;
}

export interface FeeMasterListItem {
  id: number;
  name: string;
  code: string;
  college: number;
  college_name: string;
  fee_type: string;
  is_mandatory: boolean;
  is_refundable: boolean;
  is_active: boolean;
}

export interface FeeMasterCreateInput {
  college: number;
  fee_type: string;
  name: string;
  code: string;
  description?: string | null;
  is_mandatory?: boolean;
  is_refundable?: boolean;
  display_order?: number;
  is_active?: boolean;
}

export interface FeeMasterUpdateInput extends Partial<FeeMasterCreateInput> {}

// ============================================================================
// FEE STRUCTURE TYPES
// ============================================================================

export interface FeeStructureItem {
  fee_master: number;
  fee_master_name: string;
  amount: number;
  due_date: string | null;
}

export interface FeeStructure extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  academic_session: number;
  session_name: string;
  program: number;
  program_name: string;
  class_obj: number | null;
  class_name: string | null;
  semester: number | null;
  name: string;
  fee_items: FeeStructureItem[];
  total_amount: number;
  effective_from: string;
  effective_to: string | null;
  is_active: boolean;
}

export interface FeeStructureListItem {
  id: number;
  name: string;
  college: number;
  college_name: string;
  academic_session: number;
  session_name: string;
  program: number;
  program_name: string;
  class_obj: number | null;
  class_name: string | null;
  semester: number | null;
  total_amount: number;
  effective_from: string;
  is_active: boolean;
}

export interface FeeStructureCreateInput {
  college: number;
  academic_session: number;
  program: number;
  class_obj?: number | null;
  semester?: number | null;
  name: string;
  fee_items: {
    fee_master: number;
    amount: number;
    due_date?: string | null;
  }[];
  effective_from: string;
  effective_to?: string | null;
  is_active?: boolean;
}

export interface FeeStructureUpdateInput extends Partial<FeeStructureCreateInput> {}

// ============================================================================
// FEE DISCOUNT TYPES
// ============================================================================

export interface FeeDiscount extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  name: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  description: string | null;
  applicable_fee_types: number[]; // Fee master IDs
  applicable_fee_types_details: FeeMasterListItem[];
  max_discount_amount: number | null;
  eligibility_criteria: string | null;
  is_active: boolean;
}

export interface FeeDiscountListItem {
  id: number;
  name: string;
  code: string;
  college: number;
  college_name: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
}

export interface FeeDiscountCreateInput {
  college: number;
  name: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  description?: string | null;
  applicable_fee_types: number[];
  max_discount_amount?: number | null;
  eligibility_criteria?: string | null;
  is_active?: boolean;
}

export interface FeeDiscountUpdateInput extends Partial<FeeDiscountCreateInput> {}

// ============================================================================
// FEE FINE TYPES
// ============================================================================

export interface FeeFine extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  name: string;
  fine_type: 'late_payment' | 'damage' | 'library' | 'other';
  calculation_type: 'percentage' | 'fixed' | 'per_day';
  amount: number;
  description: string | null;
  grace_period_days: number;
  max_fine_amount: number | null;
  is_active: boolean;
}

export interface FeeFineListItem {
  id: number;
  name: string;
  college: number;
  college_name: string;
  fine_type: string;
  calculation_type: string;
  amount: number;
  grace_period_days: number;
  is_active: boolean;
}

export interface FeeFineCreateInput {
  college: number;
  name: string;
  fine_type: 'late_payment' | 'damage' | 'library' | 'other';
  calculation_type: 'percentage' | 'fixed' | 'per_day';
  amount: number;
  description?: string | null;
  grace_period_days?: number;
  max_fine_amount?: number | null;
  is_active?: boolean;
}

export interface FeeFineUpdateInput extends Partial<FeeFineCreateInput> {}

// ============================================================================
// FEE COLLECTION TYPES
// ============================================================================

export interface FeeCollectionItem {
  fee_master: number;
  fee_master_name: string;
  amount: number;
  discount_amount: number;
  fine_amount: number;
  net_amount: number;
}

export interface FeeCollection extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  student: number;
  student_name: string;
  student_roll_number: string;
  academic_session: number;
  session_name: string;
  receipt_number: string;
  payment_date: string;
  fee_items: FeeCollectionItem[];
  total_amount: number;
  discount_amount: number;
  fine_amount: number;
  net_amount: number;
  amount_paid: number;
  payment_mode: 'cash' | 'card' | 'upi' | 'net_banking' | 'cheque' | 'demand_draft';
  transaction_id: string | null;
  remarks: string | null;
  collected_by: UserBasic | null;
  is_cancelled: boolean;
  cancelled_at: string | null;
  cancelled_by: UserBasic | null;
  cancellation_reason: string | null;
}

export interface FeeCollectionListItem {
  id: number;
  receipt_number: string;
  student: number;
  student_name: string;
  student_roll_number: string;
  payment_date: string;
  net_amount: number;
  amount_paid: number;
  payment_mode: string;
  collected_by_name: string | null;
  is_cancelled: boolean;
}

export interface FeeCollectionCreateInput {
  college: number;
  student: number;
  academic_session: number;
  payment_date: string;
  fee_items: {
    fee_master: number;
    amount: number;
    discount_amount?: number;
    fine_amount?: number;
  }[];
  amount_paid: number;
  payment_mode: 'cash' | 'card' | 'upi' | 'net_banking' | 'cheque' | 'demand_draft';
  transaction_id?: string | null;
  remarks?: string | null;
}

export interface FeeCollectionUpdateInput extends Partial<FeeCollectionCreateInput> {}

// ============================================================================
// STUDENT FEE STATUS TYPES
// ============================================================================

export interface StudentFeeStatus {
  student: number;
  student_name: string;
  student_roll_number: string;
  academic_session: number;
  session_name: string;
  total_fee_amount: number;
  total_paid_amount: number;
  total_discount_amount: number;
  total_fine_amount: number;
  balance_amount: number;
  fee_status: 'paid' | 'partial' | 'pending' | 'overdue';
  last_payment_date: string | null;
  fee_items: {
    fee_master: number;
    fee_master_name: string;
    amount: number;
    paid_amount: number;
    due_date: string | null;
    status: string;
  }[];
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface FeeMasterFilters {
  page?: number;
  page_size?: number;
  college?: number;
  fee_type?: string;
  is_mandatory?: boolean;
  is_active?: boolean;
  search?: string;
  ordering?: string;
}

export interface FeeStructureFilters {
  page?: number;
  page_size?: number;
  college?: number;
  academic_session?: number;
  program?: number;
  class_obj?: number;
  semester?: number;
  is_active?: boolean;
  search?: string;
  ordering?: string;
}

export interface FeeDiscountFilters {
  page?: number;
  page_size?: number;
  college?: number;
  discount_type?: string;
  is_active?: boolean;
  search?: string;
  ordering?: string;
}

export interface FeeFineFilters {
  page?: number;
  page_size?: number;
  college?: number;
  fine_type?: string;
  is_active?: boolean;
  search?: string;
  ordering?: string;
}

export interface FeeCollectionFilters {
  page?: number;
  page_size?: number;
  college?: number;
  student?: number;
  academic_session?: number;
  payment_date?: string;
  date_from?: string;
  date_to?: string;
  payment_mode?: string;
  is_cancelled?: boolean;
  search?: string;
  ordering?: string;
}
