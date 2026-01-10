/**
 * Hostel Module Types for KUMSS ERP
 * All types matching Django backend models
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface AuditFields {
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// HOSTEL TYPES
// ============================================================================

export interface Hostel extends AuditFields {
  id: number;
  is_active: boolean;
  name: string;
  hostel_type: string;
  address: string;
  capacity: number;
  contact_number: string;
  college: number;
  college_name?: string;
  warden: number;
  warden_name?: string;
}

export interface HostelCreateInput {
  is_active?: boolean;
  name: string;
  hostel_type: string;
  address: string;
  capacity: number;
  contact_number: string;
  college: number;
  warden: number;
  created_by?: string;
  updated_by?: string;
}

export interface HostelUpdateInput extends Partial<HostelCreateInput> {}

export interface HostelFilters {
  page?: number;
  page_size?: number;
  search?: string;
  hostel_type?: string;
  college?: number;
  is_active?: boolean;
  ordering?: string;
}

// ============================================================================
// ROOM TYPE TYPES
// ============================================================================

export interface RoomType extends AuditFields {
  id: number;
  is_active: boolean;
  name: string;
  capacity: number;
  features: string;
  monthly_fee: string;
  hostel: number;
  hostel_name?: string;
}

export interface RoomTypeCreateInput {
  is_active?: boolean;
  name: string;
  capacity: number;
  features: string;
  monthly_fee: string;
  hostel: number;
  created_by?: string;
  updated_by?: string;
}

export interface RoomTypeUpdateInput extends Partial<RoomTypeCreateInput> {}

export interface RoomTypeFilters {
  page?: number;
  page_size?: number;
  search?: string;
  hostel?: number;
  is_active?: boolean;
  ordering?: string;
}

// ============================================================================
// HOSTEL ALLOCATION TYPES
// ============================================================================

export interface HostelAllocation extends AuditFields {
  id: number;
  is_active: boolean;
  from_date: string;
  to_date: string;
  is_current: boolean;
  remarks: string;
  student: number;
  student_name?: string;
  hostel: number;
  hostel_name?: string;
  room: number;
  room_number?: string;
  bed: number;
  bed_number?: string;
}

export interface HostelAllocationCreateInput {
  is_active?: boolean;
  from_date: string;
  to_date: string;
  is_current?: boolean;
  remarks?: string;
  student: number;
  hostel: number;
  room: number;
  bed: number;
  created_by?: string;
  updated_by?: string;
}

export interface HostelAllocationUpdateInput extends Partial<HostelAllocationCreateInput> {}

export interface HostelAllocationFilters {
  page?: number;
  page_size?: number;
  search?: string;
  student?: number;
  hostel?: number;
  room?: number;
  bed?: number;
  is_current?: boolean;
  is_active?: boolean;
  from_date?: string;
  to_date?: string;
  ordering?: string;
}

// ============================================================================
// HOSTEL BED TYPES
// ============================================================================

export interface HostelBed extends AuditFields {
  id: number;
  is_active: boolean;
  bed_number: string;
  status: string;
  room: number;
  room_number?: string;
}

export interface HostelBedCreateInput {
  is_active?: boolean;
  bed_number: string;
  status: string;
  room: number;
  created_by?: string;
  updated_by?: string;
}

export interface HostelBedUpdateInput extends Partial<HostelBedCreateInput> {}

export interface HostelBedFilters {
  page?: number;
  page_size?: number;
  search?: string;
  room?: number;
  status?: string;
  is_active?: boolean;
  ordering?: string;
}

// ============================================================================
// HOSTEL FEE TYPES
// ============================================================================

export interface HostelFee extends AuditFields {
  id: number;
  is_active: boolean;
  month: number;
  year: number;
  amount: string;
  due_date: string;
  is_paid: boolean;
  paid_date: string;
  remarks: string;
  allocation: number;
  allocation_details?: HostelAllocation;
}

export interface HostelFeeCreateInput {
  is_active?: boolean;
  month: number;
  year: number;
  amount: string;
  due_date: string;
  is_paid?: boolean;
  paid_date?: string;
  remarks?: string;
  allocation: number;
  created_by?: string;
  updated_by?: string;
}

export interface HostelFeeUpdateInput extends Partial<HostelFeeCreateInput> {}

export interface HostelFeeFilters {
  page?: number;
  page_size?: number;
  search?: string;
  allocation?: number;
  month?: number;
  year?: number;
  is_paid?: boolean;
  is_active?: boolean;
  from_date?: string;
  to_date?: string;
  ordering?: string;
}
