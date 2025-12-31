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
// FEE TYPE TYPES
// ============================================================================

export interface FeeType extends AuditFields {
  id: number;
  college: number;
  college_name?: string;
  fee_group: number;
  fee_group_name?: string;
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
}

export interface FeeTypeCreateInput {
  college: number;
  fee_group: number;
  name: string;
  code: string;
  description?: string | null;
  is_active?: boolean;
  created_by?: string;
  updated_by?: string;
}

export interface FeeTypeUpdateInput extends Partial<FeeTypeCreateInput> {}

// ============================================================================
// FEE GROUP TYPES
// ============================================================================

export interface FeeGroup extends AuditFields {
  id: number;
  college: number;
  college_name?: string;
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
}

export interface FeeGroupCreateInput {
  college: number;
  name: string;
  code: string;
  description?: string | null;
  is_active?: boolean;
  created_by?: string;
  updated_by?: string;
}

export interface FeeGroupUpdateInput extends Partial<FeeGroupCreateInput> {}

// ============================================================================
// FEE MASTER TYPES
// ============================================================================

export interface FeeMaster extends AuditFields {
  id: number;
  is_active: boolean;
  semester: number;
  amount: string;
  college: number;
  college_name?: string;
  program: number;
  program_name?: string;
  academic_year: number;
  academic_year_name?: string;
  fee_type: number;
  fee_type_name?: string;
}

export interface FeeMasterListItem {
  id: number;
  semester: number;
  amount: string;
  college: number;
  college_name: string;
  program: number;
  program_name: string;
  academic_year: number;
  fee_type: number;
  fee_type_name: string;
  is_active: boolean;
}

export interface FeeMasterCreateInput {
  is_active?: boolean;
  semester: number;
  amount: string;
  college: number;
  program: number;
  academic_year: number;
  fee_type: number;
  created_by?: string;
  updated_by?: string;
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
// FEE INSTALLMENT TYPES
// ============================================================================

export interface FeeInstallment extends AuditFields {
  id: number;
  college: number;
  college_name?: string;
  fee_structure: number;
  fee_structure_name?: string;
  installment_number: number;
  installment_name: string;
  amount: string;
  due_date: string;
  is_active: boolean;
}

export interface FeeInstallmentCreateInput {
  college: number;
  fee_structure: number;
  installment_number: number;
  installment_name: string;
  amount: string;
  due_date: string;
  is_active?: boolean;
  created_by?: string;
  updated_by?: string;
}

export interface FeeInstallmentUpdateInput extends Partial<FeeInstallmentCreateInput> {}

// ============================================================================
// FEE RECEIPT TYPES
// ============================================================================

export interface FeeReceipt extends AuditFields {
  id: number;
  college: number;
  college_name?: string;
  receipt_number: string;
  fee_collection: number;
  student: number;
  student_name?: string;
  amount: string;
  payment_date: string;
  payment_mode: string;
  is_active: boolean;
}

export interface FeeReceiptCreateInput {
  college: number;
  receipt_number: string;
  fee_collection: number;
  student: number;
  amount: string;
  payment_date: string;
  payment_mode: string;
  is_active?: boolean;
  created_by?: string;
  updated_by?: string;
}

export interface FeeReceiptUpdateInput extends Partial<FeeReceiptCreateInput> {}

// ============================================================================
// STUDENT DISCOUNT TYPES
// ============================================================================

export interface StudentDiscount extends AuditFields {
  id: number;
  college: number;
  college_name?: string;
  student: number;
  student_name?: string;
  fee_discount: number;
  fee_discount_name?: string;
  academic_year: number;
  academic_year_name?: string;
  discount_amount: string;
  reason: string | null;
  approved_by: number | null;
  approved_by_name?: string;
  is_active: boolean;
}

export interface StudentDiscountCreateInput {
  college: number;
  student: number;
  fee_discount: number;
  academic_year: number;
  discount_amount: string;
  reason?: string | null;
  approved_by?: number | null;
  is_active?: boolean;
  created_by?: string;
  updated_by?: string;
}

export interface StudentDiscountUpdateInput extends Partial<StudentDiscountCreateInput> {}

// ============================================================================
// FEE REFUND TYPES
// ============================================================================

export interface FeeRefund extends AuditFields {
  id: number;
  college: number;
  college_name?: string;
  fee_collection: number;
  student: number;
  student_name?: string;
  refund_amount: string;
  refund_date: string;
  refund_mode: string;
  reason: string | null;
  approved_by: number | null;
  approved_by_name?: string;
  is_active: boolean;
}

export interface FeeRefundCreateInput {
  college: number;
  fee_collection: number;
  student: number;
  refund_amount: string;
  refund_date: string;
  refund_mode: string;
  reason?: string | null;
  approved_by?: number | null;
  is_active?: boolean;
  created_by?: string;
  updated_by?: string;
}

export interface FeeRefundUpdateInput extends Partial<FeeRefundCreateInput> {}

// ============================================================================
// FEE REMINDER TYPES
// ============================================================================

export interface FeeReminder extends AuditFields {
  id: number;
  college: number;
  college_name?: string;
  student: number;
  student_name?: string;
  reminder_date: string;
  reminder_type: string;
  message: string;
  sent_by: number | null;
  sent_by_name?: string;
  is_sent: boolean;
  is_active: boolean;
}

export interface FeeReminderCreateInput {
  college: number;
  student: number;
  reminder_date: string;
  reminder_type: string;
  message: string;
  sent_by?: number | null;
  is_sent?: boolean;
  is_active?: boolean;
  created_by?: string;
  updated_by?: string;
}

export interface FeeReminderUpdateInput extends Partial<FeeReminderCreateInput> {}

// ============================================================================
// BANK PAYMENT TYPES
// ============================================================================

export interface BankPayment extends AuditFields {
  id: number;
  college: number;
  college_name?: string;
  fee_collection: number;
  bank_name: string;
  account_number: string;
  transaction_id: string;
  payment_date: string;
  amount: string;
  status: string;
  is_active: boolean;
}

export interface BankPaymentCreateInput {
  college: number;
  fee_collection: number;
  bank_name: string;
  account_number: string;
  transaction_id: string;
  payment_date: string;
  amount: string;
  status: string;
  is_active?: boolean;
  created_by?: string;
  updated_by?: string;
}

export interface BankPaymentUpdateInput extends Partial<BankPaymentCreateInput> {}

// ============================================================================
// ONLINE PAYMENT TYPES
// ============================================================================

export interface OnlinePayment extends AuditFields {
  id: number;
  college: number;
  college_name?: string;
  fee_collection: number;
  payment_gateway: string;
  transaction_id: string;
  payment_date: string;
  amount: string;
  status: string;
  is_active: boolean;
}

export interface OnlinePaymentCreateInput {
  college: number;
  fee_collection: number;
  payment_gateway: string;
  transaction_id: string;
  payment_date: string;
  amount: string;
  status: string;
  is_active?: boolean;
  created_by?: string;
  updated_by?: string;
}

export interface OnlinePaymentUpdateInput extends Partial<OnlinePaymentCreateInput> {}

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
