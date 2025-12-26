/**
 * HR Module Types for KUMSS ERP
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
// LEAVE APPLICATION TYPES
// ============================================================================

export interface LeaveApplication extends AuditFields {
  id: number;
  staff: string;
  staff_details: UserBasic;
  leave_type: 'casual' | 'sick' | 'earned' | 'maternity' | 'paternity' | 'unpaid' | 'compensatory';
  from_date: string;
  to_date: string;
  total_days: number;
  half_day: boolean;
  reason: string;
  contact_during_leave: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  applied_date: string;
  remarks: string | null;
  supporting_documents: string | null;
}

export interface LeaveApplicationListItem {
  id: number;
  staff: string;
  staff_name: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  total_days: number;
  status: string;
  applied_date: string;
}

export interface LeaveApplicationCreateInput {
  staff?: string; // Optional, will use current user if not provided
  leave_type: 'casual' | 'sick' | 'earned' | 'maternity' | 'paternity' | 'unpaid' | 'compensatory';
  from_date: string;
  to_date: string;
  half_day?: boolean;
  reason: string;
  contact_during_leave?: string | null;
  supporting_documents?: string | null;
}

export interface LeaveApplicationUpdateInput extends Partial<LeaveApplicationCreateInput> {}

// ============================================================================
// LEAVE APPROVAL TYPES
// ============================================================================

export interface LeaveApproval extends AuditFields {
  id: number;
  leave_application: number;
  leave_application_details: LeaveApplicationListItem;
  approver: string;
  approver_details: UserBasic;
  approval_level: number;
  status: 'pending' | 'approved' | 'rejected';
  approved_date: string | null;
  comments: string | null;
  is_final_approval: boolean;
}

export interface LeaveApprovalListItem {
  id: number;
  leave_application: number;
  staff_name: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  total_days: number;
  approver: string;
  approver_name: string;
  approval_level: number;
  status: string;
  is_final_approval: boolean;
}

export interface LeaveApprovalCreateInput {
  leave_application: number;
  status: 'approved' | 'rejected';
  comments?: string | null;
}

export interface LeaveApprovalUpdateInput extends Partial<LeaveApprovalCreateInput> {}

// ============================================================================
// LEAVE BALANCE TYPES
// ============================================================================

export interface LeaveBalance {
  staff: string;
  staff_name: string;
  leave_type: string;
  total_leaves: number;
  used_leaves: number;
  pending_leaves: number;
  available_leaves: number;
  carried_forward: number;
  academic_year: string;
}

// ============================================================================
// SALARY STRUCTURE TYPES
// ============================================================================

export interface SalaryComponent {
  component_name: string;
  component_type: 'earning' | 'deduction';
  amount: number;
  calculation_type: 'fixed' | 'percentage';
  percentage_of?: string | null; // Component name for percentage calculation
  is_taxable: boolean;
}

export interface SalaryStructure extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  staff: string;
  staff_details: UserBasic;
  designation: string | null;
  department: number | null;
  department_name: string | null;
  basic_salary: number;
  components: SalaryComponent[];
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  effective_from: string;
  effective_to: string | null;
  is_active: boolean;
}

export interface SalaryStructureListItem {
  id: number;
  staff: string;
  staff_name: string;
  designation: string | null;
  department_name: string | null;
  basic_salary: number;
  gross_salary: number;
  net_salary: number;
  effective_from: string;
  is_active: boolean;
}

export interface SalaryStructureCreateInput {
  college: number;
  staff: string;
  designation?: string | null;
  department?: number | null;
  basic_salary: number;
  components: {
    component_name: string;
    component_type: 'earning' | 'deduction';
    amount: number;
    calculation_type: 'fixed' | 'percentage';
    percentage_of?: string | null;
    is_taxable?: boolean;
  }[];
  effective_from: string;
  effective_to?: string | null;
  is_active?: boolean;
}

export interface SalaryStructureUpdateInput extends Partial<SalaryStructureCreateInput> {}

// ============================================================================
// PAYROLL TYPES
// ============================================================================

export interface PayrollItem {
  component_name: string;
  component_type: 'earning' | 'deduction';
  amount: number;
  is_taxable: boolean;
}

export interface Payroll extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  staff: string;
  staff_details: UserBasic;
  salary_structure: number;
  month: number;
  year: number;
  payment_date: string | null;
  working_days: number;
  present_days: number;
  absent_days: number;
  leave_days: number;
  payroll_items: PayrollItem[];
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  paid_amount: number;
  payment_mode: 'bank_transfer' | 'cash' | 'cheque' | 'upi';
  transaction_id: string | null;
  status: 'draft' | 'processed' | 'paid' | 'cancelled';
  remarks: string | null;
  processed_by: UserBasic | null;
  processed_at: string | null;
}

export interface PayrollListItem {
  id: number;
  staff: string;
  staff_name: string;
  month: number;
  year: number;
  payment_date: string | null;
  present_days: number;
  gross_salary: number;
  net_salary: number;
  paid_amount: number;
  status: string;
}

export interface PayrollCreateInput {
  college: number;
  staff: string;
  salary_structure: number;
  month: number;
  year: number;
  working_days: number;
  present_days: number;
  absent_days: number;
  leave_days: number;
  payment_mode?: 'bank_transfer' | 'cash' | 'cheque' | 'upi';
  remarks?: string | null;
}

export interface PayrollUpdateInput extends Partial<PayrollCreateInput> {}

export interface ProcessPayrollInput {
  payroll_id: number;
  payment_date: string;
  paid_amount: number;
  payment_mode: 'bank_transfer' | 'cash' | 'cheque' | 'upi';
  transaction_id?: string | null;
}

// ============================================================================
// PAYSLIP TYPES
// ============================================================================

export interface Payslip {
  payroll: number;
  staff_name: string;
  staff_id: string;
  designation: string;
  department: string;
  month: string;
  year: number;
  payment_date: string;
  working_days: number;
  present_days: number;
  absent_days: number;
  leave_days: number;
  earnings: PayrollItem[];
  deductions: PayrollItem[];
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  paid_amount: number;
  payment_mode: string;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface LeaveApplicationFilters {
  page?: number;
  page_size?: number;
  staff?: string;
  leave_type?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  ordering?: string;
}

export interface LeaveApprovalFilters {
  page?: number;
  page_size?: number;
  leave_application?: number;
  approver?: string;
  status?: string;
  approval_level?: number;
  is_final_approval?: boolean;
  search?: string;
  ordering?: string;
}

export interface SalaryStructureFilters {
  page?: number;
  page_size?: number;
  college?: number;
  staff?: string;
  department?: number;
  is_active?: boolean;
  search?: string;
  ordering?: string;
}

export interface PayrollFilters {
  page?: number;
  page_size?: number;
  college?: number;
  staff?: string;
  month?: number;
  year?: number;
  status?: string;
  payment_date?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  ordering?: string;
}
