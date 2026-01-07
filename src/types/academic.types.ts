/**
 * Academic Module Types for KUMSS ERP
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
// FACULTY TYPES
// ============================================================================

export interface Faculty extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  code: string;
  name: string;
  short_name: string;
  description: string | null;
  hod: string | null;
  hod_details: UserBasic | null;
  display_order: number;
  is_active: boolean;
}

export interface FacultyListItem {
  id: number;
  code: string;
  name: string;
  short_name: string;
  college: number;
  college_name: string;
  hod: string | null;
  hod_name: string | null;
  is_active: boolean;
}

export interface FacultyCreateInput {
  college: number;
  code: string;
  name: string;
  short_name: string;
  description?: string | null;
  hod?: string | null;
  display_order?: number;
  is_active?: boolean;
}

export interface FacultyUpdateInput extends Partial<FacultyCreateInput> {}

// ============================================================================
// PROGRAM TYPES
// ============================================================================

export interface Program extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  faculty: number;
  faculty_name: string;
  code: string;
  name: string;
  short_name: string;
  program_type: string;
  duration: number;
  duration_type: string;
  total_credits: number | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

export interface ProgramListItem {
  id: number;
  code: string;
  name: string;
  short_name: string;
  college: number;
  college_name: string;
  faculty: number;
  faculty_name: string;
  program_type: string;
  is_active: boolean;
}

export interface ProgramCreateInput {
  college: number;
  faculty: number;
  code: string;
  name: string;
  short_name: string;
  program_type: string;
  duration: number;
  duration_type: string;
  total_credits?: number | null;
  description?: string | null;
  display_order?: number;
  is_active?: boolean;
}

export interface ProgramUpdateInput extends Partial<ProgramCreateInput> {}

// ============================================================================
// CLASS TYPES
// ============================================================================

export interface Class extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  program: number;
  program_name: string;
  academic_session: number;
  session_name: string;
  name: string;
  semester: number;
  year: number;
  max_students: number;
  is_active: boolean;
}

export interface ClassListItem {
  id: number;
  name: string;
  college: number;
  college_name: string;
  program: number;
  program_name: string;
  academic_session: number;
  session_name: string;
  semester: number;
  year: number;
  is_active: boolean;
}

export interface ClassCreateInput {
  college: number;
  program: number;
  academic_session: number;
  name: string;
  semester: number;
  year: number;
  max_students?: number;
  is_active?: boolean;
}

export interface ClassUpdateInput extends Partial<ClassCreateInput> {}

// ============================================================================
// SECTION TYPES
// ============================================================================

export interface Section extends AuditFields {
  id: number;
  class_obj: number;
  class_name: string;
  name: string;
  max_students: number;
  is_active: boolean;
}

export interface SectionCreateInput {
  class_obj: number;
  name: string;
  max_students?: number;
  is_active?: boolean;
  college?: number;
}

export interface SectionUpdateInput extends Partial<SectionCreateInput> {}

// ============================================================================
// SUBJECT TYPES
// ============================================================================

export interface Subject extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  code: string;
  name: string;
  short_name: string;
  subject_type: string;
  credits: number;
  theory_hours: number;
  practical_hours: number;
  max_marks: number;
  pass_marks: number;
  description: string | null;
  is_active: boolean;
}

export interface SubjectListItem {
  id: number;
  code: string;
  name: string;
  short_name: string;
  college: number;
  college_name: string;
  subject_type: string;
  credits: number;
  is_active: boolean;
}

export interface SubjectCreateInput {
  college: number;
  code: string;
  name: string;
  short_name: string;
  subject_type: string;
  credits: number;
  theory_hours?: number;
  practical_hours?: number;
  max_marks: number;
  pass_marks: number;
  description?: string | null;
  is_active?: boolean;
}

export interface SubjectUpdateInput extends Partial<SubjectCreateInput> {}

// ============================================================================
// OPTIONAL SUBJECT TYPES
// ============================================================================

export interface OptionalSubject extends AuditFields {
  id: number;
  class_obj: number;
  class_name: string;
  name: string;
  description: string | null;
  subjects: number[];
  subjects_list: SubjectListItem[];
  min_selection: number;
  max_selection: number;
  is_active: boolean;
}

export interface OptionalSubjectCreateInput {
  class_obj: number;
  name: string;
  description?: string | null;
  subjects: number[];
  min_selection?: number;
  max_selection?: number;
  is_active?: boolean;
  college?: number;
}

export interface OptionalSubjectUpdateInput extends Partial<OptionalSubjectCreateInput> {}

// ============================================================================
// SUBJECT ASSIGNMENT TYPES
// ============================================================================

export interface SubjectAssignment extends AuditFields {
  id: number;
  subject: number;
  subject_details: SubjectListItem;
  class_obj: number;
  class_name: string;
  section: number | null;
  section_name: string | null;
  teacher: string | null;
  teacher_details: UserBasic | null;
  lab_instructor: string | null;
  lab_instructor_details: UserBasic | null;
  is_optional: boolean;
  is_active: boolean;
}

export interface SubjectAssignmentListItem {
  id: number;
  subject: number;
  subject_name: string;
  class_obj: number;
  class_name: string;
  section: number | null;
  section_name: string | null;
  teacher: string | null;
  teacher_name: string | null;
  is_optional: boolean;
  is_active: boolean;
}

export interface SubjectAssignmentCreateInput {
  subject: number;
  class_obj: number;
  section?: number | null;
  teacher?: string | null;
  lab_instructor?: string | null;
  is_optional?: boolean;
  is_active?: boolean;
  college?: number;
}

export interface SubjectAssignmentUpdateInput extends Partial<SubjectAssignmentCreateInput> {}

// ============================================================================
// CLASSROOM TYPES
// ============================================================================

export interface Classroom extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  code: string;
  name: string;
  room_type: string;
  building: string | null;
  floor: string | null;
  capacity: number;
  has_projector: boolean;
  has_ac: boolean;
  has_computer: boolean;
  is_active: boolean;
}

export interface ClassroomListItem {
  id: number;
  code: string;
  name: string;
  college: number;
  college_name: string;
  room_type: string;
  capacity: number;
  is_active: boolean;
}

export interface ClassroomCreateInput {
  college: number;
  code: string;
  name: string;
  room_type: string;
  building?: string | null;
  floor?: string | null;
  capacity: number;
  has_projector?: boolean;
  has_ac?: boolean;
  has_computer?: boolean;
  is_active?: boolean;
}

export interface ClassroomUpdateInput extends Partial<ClassroomCreateInput> {}

// ============================================================================
// CLASS TIME TYPES
// ============================================================================

export interface ClassTime extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  period_number: number;
  start_time: string;
  end_time: string;
  is_break: boolean;
  break_name: string | null;
  is_active: boolean;
}

export interface ClassTimeCreateInput {
  college: number;
  period_number: number;
  start_time: string;
  end_time: string;
  is_break?: boolean;
  break_name?: string | null;
  is_active?: boolean;
}

export interface ClassTimeUpdateInput extends Partial<ClassTimeCreateInput> {}

// ============================================================================
// TIMETABLE TYPES
// ============================================================================

export interface Timetable extends AuditFields {
  id: number;
  college: number;
  class_obj: number;
  class_name: string;
  section: number;
  section_name: string;
  subject_assignment: number;
  subject_details: SubjectListItem;
  teacher_details: UserBasic | null;
  day_of_week: number;
  class_time: number;
  time_details: ClassTime;
  classroom: number | null;
  classroom_details: ClassroomListItem | null;
  effective_from: string;
  effective_to: string | null;
  is_active: boolean;
}

export interface TimetableListItem {
  id: number;
  class_obj: number;
  class_name: string;
  section: number;
  section_name: string;
  subject_assignment: number;
  subject_name: string;
  teacher_name: string | null;
  day_of_week: number;
  class_time: number;
  time_slot: string;
  classroom: number | null;
  classroom_name: string | null;
  effective_from: string;
  is_active: boolean;
}

export interface TimetableCreateInput {
  class_obj: number;
  college: number;
  section: number;
  subject_assignment: number;
  day_of_week: number;
  class_time: number;
  classroom?: number | null;
  effective_from: string;
  effective_to?: string | null;
  is_active?: boolean;
}

export interface TimetableUpdateInput extends Partial<TimetableCreateInput> {}

// ============================================================================
// LAB SCHEDULE TYPES
// ============================================================================

export interface LabSchedule extends AuditFields {
  id: number;
  subject_assignment: number;
  subject_name: string;
  section: number;
  section_name: string;
  teacher_name: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
  classroom: number | null;
  classroom_name: string | null;
  batch_name: string | null;
  effective_from: string;
  effective_to: string | null;
  is_active: boolean;
}

export interface LabScheduleCreateInput {
  subject_assignment: number;
  section: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  classroom?: number | null;
  batch_name?: string | null;
  effective_from: string;
  effective_to?: string | null;
  is_active?: boolean;
  college?: number;
}

export interface LabScheduleUpdateInput extends Partial<LabScheduleCreateInput> {}

// ============================================================================
// CLASS TEACHER TYPES
// ============================================================================

export interface ClassTeacher extends AuditFields {
  id: number;
  class_obj: number;
  class_name: string;
  section: number;
  section_name: string;
  teacher: string;
  teacher_details: UserBasic;
  assigned_from: string;
  assigned_to: string | null;
  is_current: boolean;
  is_active: boolean;
}

export interface ClassTeacherCreateInput {
  class_obj: number;
  section: number;
  teacher: string;
  assigned_from: string;
  assigned_to?: string | null;
  is_current?: boolean;
  academic_session: number;
  is_active?: boolean;
  college?: number;
}

export interface ClassTeacherUpdateInput extends Partial<ClassTeacherCreateInput> {}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface FacultyFilters {
  page?: number;
  page_size?: number;
  is_active?: boolean;
  hod?: string;
  search?: string;
  ordering?: string;
}

export interface ProgramFilters {
  page?: number;
  page_size?: number;
  faculty?: number;
  program_type?: string;
  is_active?: boolean;
  search?: string;
  ordering?: string;
}

export interface ClassFilters {
  page?: number;
  page_size?: number;
  program?: number;
  academic_session?: number;
  semester?: number;
  year?: number;
  is_active?: boolean;
  search?: string;
  ordering?: string;
}

export interface SectionFilters {
  page?: number;
  page_size?: number;
  class_obj?: number;
  is_active?: boolean;
  search?: string;
  ordering?: string;
}

export interface SubjectFilters {
  page?: number;
  page_size?: number;
  subject_type?: string;
  is_active?: boolean;
  search?: string;
  ordering?: string;
}

export interface OptionalSubjectFilters {
  page?: number;
  page_size?: number;
  class_obj?: number;
  is_active?: boolean;
  search?: string;
  ordering?: string;
}

export interface SubjectAssignmentFilters {
  page?: number;
  page_size?: number;
  subject?: number;
  class_obj?: number;
  section?: number;
  teacher?: string;
  is_optional?: boolean;
  is_active?: boolean;
  search?: string;
  ordering?: string;
}

export interface ClassroomFilters {
  page?: number;
  page_size?: number;
  room_type?: string;
  building?: string;
  has_projector?: boolean;
  has_ac?: boolean;
  has_computer?: boolean;
  is_active?: boolean;
  search?: string;
  ordering?: string;
}

export interface ClassTimeFilters {
  page?: number;
  page_size?: number;
  is_break?: boolean;
  is_active?: boolean;
  ordering?: string;
}

export interface TimetableFilters {
  page?: number;
  page_size?: number;
  section?: number;
  day_of_week?: number;
  class_time?: number;
  classroom?: number;
  is_active?: boolean;
  ordering?: string;
}

export interface LabScheduleFilters {
  page?: number;
  page_size?: number;
  subject_assignment?: number;
  section?: number;
  day_of_week?: number;
  classroom?: number;
  is_active?: boolean;
  ordering?: string;
}

export interface ClassTeacherFilters {
  page?: number;
  page_size?: number;
  class_obj?: number;
  section?: number;
  teacher?: string;
  is_current?: boolean;
  is_active?: boolean;
  ordering?: string;
}
