/**
 * Attendance Module Types for KUMSS ERP
 * All types matching Django backend models
 */

import { UserBasic } from './accounts.types';
import { SubjectListItem } from './academic.types';

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
// STUDENT ATTENDANCE TYPES
// ============================================================================

export interface StudentAttendance extends AuditFields {
  id: number;
  student: number;
  student_name: string;
  student_roll_number: string;
  class_obj: number;
  class_name: string;
  section: number;
  section_name: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'half_day';
  subject: number | null;
  subject_details: SubjectListItem | null;
  period: number | null;
  marked_by: UserBasic | null;
  remarks: string | null;
  is_verified: boolean;
}

export interface StudentAttendanceListItem {
  id: number;
  student: number;
  student_name: string;
  student_roll_number: string;
  class_obj: number;
  class_name: string;
  section: number;
  section_name: string;
  date: string;
  status: string;
  subject: number | null;
  subject_name: string | null;
  marked_by_name: string | null;
  is_verified: boolean;
}

export interface StudentAttendanceCreateInput {
  student: number;
  class_obj: number;
  section: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'half_day';
  check_in_time?: string | null;
  check_out_time?: string | null;
  subject?: number | null;
  period?: number | null;
  remarks?: string | null;
  marked_by?: string | null;
  is_verified?: boolean;
}

export interface StudentAttendanceUpdateInput extends Partial<StudentAttendanceCreateInput> {}

export interface BulkAttendanceEntry {
  student: number;
  status: 'present' | 'absent' | 'late' | 'excused' | 'half_day';
  remarks?: string | null;
}

export interface BulkAttendanceCreateInput {
  class_obj: number;
  section: number;
  date: string;
  subject?: number | null;
  period?: number | null;
  attendance_records: BulkAttendanceEntry[];
}

// ============================================================================
// STAFF ATTENDANCE TYPES
// ============================================================================

export interface StaffAttendance extends AuditFields {
  id: number;
  staff: string;
  staff_details: UserBasic;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: 'present' | 'absent' | 'late' | 'on_leave' | 'half_day' | 'work_from_home';
  leave_type: string | null;
  working_hours: number | null;
  remarks: string | null;
  marked_by: UserBasic | null;
  is_verified: boolean;
}

export interface StaffAttendanceListItem {
  id: number;
  staff: string;
  staff_name: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: string;
  working_hours: number | null;
  is_verified: boolean;
}

export interface StaffAttendanceCreateInput {
  staff: string;
  date: string;
  check_in_time?: string | null;
  check_out_time?: string | null;
  status: 'present' | 'absent' | 'late' | 'on_leave' | 'half_day' | 'work_from_home';
  leave_type?: string | null;
  working_hours?: number | null;
  remarks?: string | null;
  is_verified?: boolean;
}

export interface StaffAttendanceUpdateInput extends Partial<StaffAttendanceCreateInput> {}

// ============================================================================
// SUBJECT ATTENDANCE TYPES (Period-wise)
// ============================================================================

export interface SubjectAttendance extends AuditFields {
  id: number;
  subject_assignment: number;
  subject_details: SubjectListItem;
  class_obj: number;
  class_name: string;
  section: number;
  section_name: string;
  date: string;
  period: number;
  period_time: string;
  teacher: string;
  teacher_details: UserBasic;
  total_students: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  attendance_percentage: number;
  is_completed: boolean;
  remarks: string | null;
}

export interface SubjectAttendanceListItem {
  id: number;
  subject_assignment: number;
  subject_name: string;
  class_obj: number;
  class_name: string;
  section: number;
  section_name: string;
  date: string;
  period: number;
  teacher_name: string;
  present_count: number;
  absent_count: number;
  attendance_percentage: number;
  is_completed: boolean;
}

export interface SubjectAttendanceCreateInput {
  subject_assignment: number;
  class_obj: number;
  section: number;
  date: string;
  period: number;
  total_students: number;
  present_count: number;
  absent_count: number;
  late_count?: number;
  is_completed?: boolean;
  remarks?: string | null;
}

export interface SubjectAttendanceUpdateInput extends Partial<SubjectAttendanceCreateInput> {}

// ============================================================================
// ATTENDANCE NOTIFICATION TYPES
// ============================================================================

export interface AttendanceNotification extends AuditFields {
  id: number;
  student: number;
  student_name: string;
  parent_email: string | null;
  parent_phone: string | null;
  date: string;
  absence_count: number;
  total_days: number;
  attendance_percentage: number;
  notification_type: 'low_attendance' | 'consecutive_absence' | 'monthly_report' | 'custom';
  message: string;
  is_sent: boolean;
  sent_at: string | null;
  sent_via: string | null; // email, sms, both
  remarks: string | null;
}

export interface AttendanceNotificationListItem {
  id: number;
  student: number;
  student_name: string;
  date: string;
  absence_count: number;
  attendance_percentage: number;
  notification_type: string;
  is_sent: boolean;
  sent_at: string | null;
}

export interface AttendanceNotificationCreateInput {
  student: number;
  date: string;
  absence_count: number;
  total_days: number;
  notification_type: 'low_attendance' | 'consecutive_absence' | 'monthly_report' | 'custom';
  message: string;
  sent_via?: string | null;
  remarks?: string | null;
}

export interface AttendanceNotificationUpdateInput extends Partial<AttendanceNotificationCreateInput> {}

// ============================================================================
// ATTENDANCE SUMMARY TYPES
// ============================================================================

export interface AttendanceSummary {
  student: number;
  student_name: string;
  student_roll_number: string;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  excused_days: number;
  half_days: number;
  attendance_percentage: number;
}

export interface SubjectWiseAttendance {
  subject: number;
  subject_name: string;
  total_classes: number;
  attended_classes: number;
  absent_classes: number;
  late_classes: number;
  attendance_percentage: number;
}

export interface StudentAttendanceReport {
  student: number;
  student_name: string;
  student_roll_number: string;
  class_name: string;
  section_name: string;
  overall_summary: AttendanceSummary;
  subject_wise: SubjectWiseAttendance[];
  month_wise: {
    month: string;
    total_days: number;
    present_days: number;
    attendance_percentage: number;
  }[];
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface StudentAttendanceFilters {
  page?: number;
  page_size?: number;
  student?: number;
  class_obj?: number;
  section?: number;
  date?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
  subject?: number;
  is_verified?: boolean;
  search?: string;
  ordering?: string;
}

export interface StaffAttendanceFilters {
  page?: number;
  page_size?: number;
  staff?: string;
  date?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
  is_verified?: boolean;
  search?: string;
  ordering?: string;
}

export interface SubjectAttendanceFilters {
  page?: number;
  page_size?: number;
  subject_assignment?: number;
  class_obj?: number;
  section?: number;
  date?: string;
  date_from?: string;
  date_to?: string;
  teacher?: string;
  is_completed?: boolean;
  search?: string;
  ordering?: string;
}

export interface AttendanceNotificationFilters {
  page?: number;
  page_size?: number;
  student?: number;
  date?: string;
  date_from?: string;
  date_to?: string;
  notification_type?: string;
  is_sent?: boolean;
  search?: string;
  ordering?: string;
}
