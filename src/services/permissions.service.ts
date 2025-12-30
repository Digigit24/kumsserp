/**
 * Permissions and Context API Service
 *
 * Provides API calls for:
 * 1. Fetching user permissions
 * 2. Fetching context options (colleges, classes, sections)
 * 3. Permission normalization
 */

import apiClient from '@/api/apiClient';
import type {
  PermissionsResponse,
  ContextOptionsResponse,
  CollegeOption,
  ClassOption,
  SectionOption,
  UserPermissionsJSON,
  NormalizedPermissions,
  UserContext,
} from '@/types/permissions.types';

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * Fetch user permissions from backend
 * This should return the complete permissions JSON for the logged-in user
 */
export async function fetchUserPermissions(): Promise<PermissionsResponse> {
  try {
    const response = await apiClient.get<PermissionsResponse>('/api/permissions/');
    return response.data;
  } catch (error: any) {
    // Fallback: construct from existing user data if endpoint doesn't exist yet
    console.warn('Permissions endpoint not found, using fallback', error);

    // Get user from localStorage
    const userStr = localStorage.getItem('kumss_user');
    const user = userStr ? JSON.parse(userStr) : null;

    return {
      user_permissions: user?.user_permissions || {},
      user_context: {
        userId: user?.id || '',
        userType: user?.user_type || 'student',
        college_id: user?.college || null,
        assigned_class_ids: [],
        assigned_section_ids: [],
        accessible_colleges: user?.accessible_colleges?.map((c: any) => c.id) || [],
      },
      user_type: user?.user_type || 'student',
      accessible_colleges: user?.accessible_colleges || [],
    };
  }
}

/**
 * Fetch available colleges for current user
 * Backend should filter based on user permissions
 */
export async function fetchContextColleges(): Promise<ContextOptionsResponse<CollegeOption>> {
  try {
    const response = await apiClient.get<ContextOptionsResponse<CollegeOption>>(
      '/api/context/colleges/'
    );
    return response.data;
  } catch (error: any) {
    // Fallback: use existing colleges endpoint
    console.warn('Context colleges endpoint not found, using fallback');
    const response = await apiClient.get('/api/core/colleges/?page_size=100&is_active=true');
    return {
      count: response.data.count || 0,
      results: response.data.results || [],
    };
  }
}

/**
 * Fetch available classes for current user and selected college
 * Backend should filter based on user permissions
 */
export async function fetchContextClasses(
  collegeId?: number
): Promise<ContextOptionsResponse<ClassOption>> {
  try {
    const params = new URLSearchParams();
    if (collegeId) params.append('college', String(collegeId));
    params.append('page_size', '100');
    params.append('is_active', 'true');

    const response = await apiClient.get<ContextOptionsResponse<ClassOption>>(
      `/api/context/classes/?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    // Fallback: use existing classes endpoint
    console.warn('Context classes endpoint not found, using fallback');
    const params = new URLSearchParams();
    if (collegeId) params.append('college', String(collegeId));
    params.append('page_size', '100');
    params.append('is_active', 'true');

    const response = await apiClient.get(`/api/academic/classes/?${params.toString()}`);
    return {
      count: response.data.count || 0,
      results: response.data.results || [],
    };
  }
}

/**
 * Fetch available sections for current user and selected class
 * Backend should filter based on user permissions
 */
export async function fetchContextSections(
  classId?: number
): Promise<ContextOptionsResponse<SectionOption>> {
  try {
    const params = new URLSearchParams();
    if (classId) params.append('class_id', String(classId));
    params.append('page_size', '100');
    params.append('is_active', 'true');

    const response = await apiClient.get<ContextOptionsResponse<SectionOption>>(
      `/api/context/sections/?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    // Fallback: use existing sections endpoint
    console.warn('Context sections endpoint not found, using fallback');
    const params = new URLSearchParams();
    if (classId) params.append('class_obj', String(classId));
    params.append('page_size', '100');
    params.append('is_active', 'true');

    const response = await apiClient.get(`/api/academic/sections/?${params.toString()}`);
    return {
      count: response.data.count || 0,
      results: response.data.results || [],
    };
  }
}

// ============================================================================
// PERMISSION NORMALIZER
// ============================================================================

/**
 * Normalizes complex permission JSON into simple boolean flags
 * This makes it easy to check permissions in UI components
 *
 * @param permissions - Raw permissions JSON from backend
 * @param userContext - User context with role and assignment info
 * @returns Normalized permission flags
 */
export function normalizePermissions(
  permissions: UserPermissionsJSON,
  userContext: UserContext
): NormalizedPermissions {
  const { userType, college_id, accessible_colleges } = userContext;

  // Helper to check if permission is enabled
  const hasPermission = (module: string, action: string): boolean => {
    const modulePerms = permissions[module];
    if (!modulePerms) return false;
    const actionPerm = modulePerms[action as keyof typeof modulePerms] as any;
    return actionPerm?.enabled === true;
  };

  // Helper to get permission scope
  const getScope = (module: string, action: string): string | null => {
    const modulePerms = permissions[module];
    if (!modulePerms) return null;
    const actionPerm = modulePerms[action as keyof typeof modulePerms] as any;
    return actionPerm?.scope || null;
  };

  // Helper to check UI permission
  const hasUIPermission = (module: string, flag: string): boolean => {
    const modulePerms = permissions[module];
    if (!modulePerms || !modulePerms.ui) return false;
    return modulePerms.ui[flag] === true;
  };

  // Determine user role flags
  const isSuperAdmin = userType === 'super_admin';
  const isCollegeAdmin = userType === 'college_admin';
  const isTeacher = userType === 'teacher';
  const isStudent = userType === 'student';

  // Context selectors visibility
  const canChooseCollege =
    isSuperAdmin || (accessible_colleges && accessible_colleges.length > 1);
  const canChooseClass =
    !isStudent &&
    (isSuperAdmin ||
      isCollegeAdmin ||
      getScope('attendance', 'read') === 'team' ||
      getScope('attendance', 'read') === 'department' ||
      getScope('attendance', 'read') === 'all');
  const canChooseSection =
    !isStudent &&
    (isSuperAdmin ||
      isCollegeAdmin ||
      getScope('attendance', 'read') === 'team' ||
      getScope('attendance', 'read') === 'all');

  return {
    // Context selectors
    canChooseCollege,
    canChooseClass,
    canChooseSection,

    // Attendance
    canViewAttendance: hasPermission('attendance', 'read') || hasPermission('student_attendance', 'read'),
    canMarkAttendance: hasPermission('attendance', 'create') || hasPermission('student_attendance', 'create'),
    canEditAttendance: hasPermission('attendance', 'update') || hasPermission('student_attendance', 'update'),
    canDeleteAttendance: hasPermission('attendance', 'delete') || hasPermission('student_attendance', 'delete'),
    canExportAttendance: hasUIPermission('attendance', 'canExport'),
    canViewAllAttendance: getScope('attendance', 'read') === 'all' || getScope('student_attendance', 'read') === 'all',

    // Students
    canViewStudents: hasPermission('students', 'read'),
    canCreateStudents: hasPermission('students', 'create'),
    canEditStudents: hasPermission('students', 'update'),
    canDeleteStudents: hasPermission('students', 'delete'),
    canViewStudentSensitiveFields: !hasUIPermission('students', 'hideSensitiveFields'),
    canExportStudents: hasUIPermission('students', 'canExport'),

    // Classes
    canViewClasses: hasPermission('classes', 'read'),
    canCreateClasses: hasPermission('classes', 'create'),
    canEditClasses: hasPermission('classes', 'update'),
    canDeleteClasses: hasPermission('classes', 'delete'),

    // Sections
    canViewSections: hasPermission('sections', 'read'),
    canCreateSections: hasPermission('sections', 'create'),
    canEditSections: hasPermission('sections', 'update'),
    canDeleteSections: hasPermission('sections', 'delete'),

    // Subjects
    canViewSubjects: hasPermission('subjects', 'read'),
    canCreateSubjects: hasPermission('subjects', 'create'),
    canEditSubjects: hasPermission('subjects', 'update'),
    canDeleteSubjects: hasPermission('subjects', 'delete'),

    // Examinations
    canViewExaminations: hasPermission('examinations', 'read'),
    canCreateExaminations: hasPermission('examinations', 'create'),
    canEditExaminations: hasPermission('examinations', 'update'),
    canDeleteExaminations: hasPermission('examinations', 'delete'),
    canViewAllResults: getScope('results', 'read') === 'all',

    // Fees
    canViewFees: hasPermission('fees', 'read') || hasPermission('fee_payments', 'read'),
    canCreateFees: hasPermission('fees', 'create') || hasPermission('fee_payments', 'create'),
    canEditFees: hasPermission('fees', 'update') || hasPermission('fee_payments', 'update'),
    canDeleteFees: hasPermission('fees', 'delete') || hasPermission('fee_payments', 'delete'),
    canViewAllFees: getScope('fees', 'read') === 'all',

    // Staff/HR
    canViewStaff: hasPermission('staff', 'read'),
    canCreateStaff: hasPermission('staff', 'create'),
    canEditStaff: hasPermission('staff', 'update'),
    canDeleteStaff: hasPermission('staff', 'delete'),

    // Reports
    canViewReports: hasPermission('reports', 'read'),
    canExportReports: hasUIPermission('reports', 'canExport'),

    // Settings
    canManageSettings: hasPermission('system_settings', 'update'),
    canManageNotifications: hasPermission('notification_settings', 'update'),

    // Role flags
    isSuperAdmin,
    isCollegeAdmin,
    isTeacher,
    isStudent,
  };
}

// ============================================================================
// DENORMALIZE (for permission editor)
// ============================================================================

/**
 * Converts normalized permission flags back to JSON structure
 * Used when saving permissions from admin panel
 */
export function denormalizePermissions(
  normalized: Partial<NormalizedPermissions>
): Partial<UserPermissionsJSON> {
  // This is a complex reverse mapping
  // For now, return empty - implement when permission editor is built
  return {};
}
