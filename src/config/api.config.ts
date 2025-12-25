/**
 * API Configuration for KUMSS ERP
 * Base URL and all API endpoints
 */
import type { User } from "../types/auth.types";
// Base API URL - Development
export const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: "/api/v1/auth/login/",
    logout: "/api/v1/auth/logout/",
    passwordChange: "/api/v1/auth/password/change/",
    passwordReset: "/api/v1/auth/password/reset/",
    passwordResetConfirm: "/api/v1/auth/password/reset/confirm/",
    user: "/api/v1/auth/user/",
  },

  // Core Module - Colleges
  colleges: {
    list: "/api/v1/core/colleges/",
    create: "/api/v1/core/colleges/",
    detail: (id: number) => `/api/v1/core/colleges/${id}/`,
    update: (id: number) => `/api/v1/core/colleges/${id}/`,
    patch: (id: number) => `/api/v1/core/colleges/${id}/`,
    delete: (id: number) => `/api/v1/core/colleges/${id}/`,
    active: "/api/v1/core/colleges/active/",
    bulkDelete: "/api/v1/core/colleges/bulk_delete/",
  },

  // Core Module - Academic Years
  academicYears: {
    list: "/api/v1/core/academic-years/",
    create: "/api/v1/core/academic-years/",
    detail: (id: number) => `/api/v1/core/academic-years/${id}/`,
    update: (id: number) => `/api/v1/core/academic-years/${id}/`,
    patch: (id: number) => `/api/v1/core/academic-years/${id}/`,
    delete: (id: number) => `/api/v1/core/academic-years/${id}/`,
    current: "/api/v1/core/academic-years/current/",
  },

  // Core Module - Academic Sessions
  academicSessions: {
    list: "/api/v1/core/academic-sessions/",
    create: "/api/v1/core/academic-sessions/",
    detail: (id: number) => `/api/v1/core/academic-sessions/${id}/`,
    update: (id: number) => `/api/v1/core/academic-sessions/${id}/`,
    patch: (id: number) => `/api/v1/core/academic-sessions/${id}/`,
    delete: (id: number) => `/api/v1/core/academic-sessions/${id}/`,
  },

  // Core Module - Holidays
  holidays: {
    list: "/api/v1/core/holidays/",
    create: "/api/v1/core/holidays/",
    detail: (id: number) => `/api/v1/core/holidays/${id}/`,
    update: (id: number) => `/api/v1/core/holidays/${id}/`,
    patch: (id: number) => `/api/v1/core/holidays/${id}/`,
    delete: (id: number) => `/api/v1/core/holidays/${id}/`,
  },

  // Core Module - Weekends
  weekends: {
    list: "/api/v1/core/weekends/",
    create: "/api/v1/core/weekends/",
    detail: (id: number) => `/api/v1/core/weekends/${id}/`,
    update: (id: number) => `/api/v1/core/weekends/${id}/`,
    patch: (id: number) => `/api/v1/core/weekends/${id}/`,
    delete: (id: number) => `/api/v1/core/weekends/${id}/`,
  },

  // Core Module - System Settings
  systemSettings: {
    list: "/api/v1/core/system-settings/",
    create: "/api/v1/core/system-settings/",
    detail: (id: number) => `/api/v1/core/system-settings/${id}/`,
    update: (id: number) => `/api/v1/core/system-settings/${id}/`,
    patch: (id: number) => `/api/v1/core/system-settings/${id}/`,
  },

  // Core Module - Notification Settings
  notificationSettings: {
    list: "/api/v1/core/notification-settings/",
    create: "/api/v1/core/notification-settings/",
    detail: (id: number) => `/api/v1/core/notification-settings/${id}/`,
    update: (id: number) => `/api/v1/core/notification-settings/${id}/`,
    patch: (id: number) => `/api/v1/core/notification-settings/${id}/`,
  },

  // Core Module - Activity Logs (Read-Only)
  activityLogs: {
    list: "/api/v1/core/activity-logs/",
    detail: (id: number) => `/api/v1/core/activity-logs/${id}/`,
  },

  // Accounts Module - Users
  users: {
    list: "/api/v1/accounts/users/",
    create: "/api/v1/accounts/users/",
    detail: (id: string) => `/api/v1/accounts/users/${id}/`,
    update: (id: string) => `/api/v1/accounts/users/${id}/`,
    patch: (id: string) => `/api/v1/accounts/users/${id}/`,
    delete: (id: string) => `/api/v1/accounts/users/${id}/`,
    me: "/api/v1/accounts/users/me/",
    changePassword: "/api/v1/accounts/users/change_password/",
    bulkDelete: "/api/v1/accounts/users/bulk_delete/",
    bulkActivate: "/api/v1/accounts/users/bulk_activate/",
    bulkUpdateType: "/api/v1/accounts/users/bulk_update_type/",
    byType: (type: string) => `/api/v1/accounts/users/by-type/${type}/`,
  },

  // Accounts Module - Roles
  roles: {
    list: "/api/v1/accounts/roles/",
    create: "/api/v1/accounts/roles/",
    detail: (id: number) => `/api/v1/accounts/roles/${id}/`,
    update: (id: number) => `/api/v1/accounts/roles/${id}/`,
    patch: (id: number) => `/api/v1/accounts/roles/${id}/`,
    delete: (id: number) => `/api/v1/accounts/roles/${id}/`,
  },

  // Accounts Module - User Roles
  userRoles: {
    list: "/api/v1/accounts/user-roles/",
    create: "/api/v1/accounts/user-roles/",
    detail: (id: number) => `/api/v1/accounts/user-roles/${id}/`,
    update: (id: number) => `/api/v1/accounts/user-roles/${id}/`,
    patch: (id: number) => `/api/v1/accounts/user-roles/${id}/`,
    delete: (id: number) => `/api/v1/accounts/user-roles/${id}/`,
  },

  // Accounts Module - Departments
  departments: {
    list: "/api/v1/accounts/departments/",
    create: "/api/v1/accounts/departments/",
    detail: (id: number) => `/api/v1/accounts/departments/${id}/`,
    update: (id: number) => `/api/v1/accounts/departments/${id}/`,
    patch: (id: number) => `/api/v1/accounts/departments/${id}/`,
    delete: (id: number) => `/api/v1/accounts/departments/${id}/`,
  },

  // Accounts Module - User Profiles
  userProfiles: {
    list: "/api/v1/accounts/user-profiles/",
    create: "/api/v1/accounts/user-profiles/",
    detail: (id: number) => `/api/v1/accounts/user-profiles/${id}/`,
    update: (id: number) => `/api/v1/accounts/user-profiles/${id}/`,
    patch: (id: number) => `/api/v1/accounts/user-profiles/${id}/`,
    delete: (id: number) => `/api/v1/accounts/user-profiles/${id}/`,
    me: "/api/v1/accounts/user-profiles/me/",
  },

  // Academic Module - Faculties
  faculties: {
    list: "/api/v1/academic/faculties/",
    create: "/api/v1/academic/faculties/",
    detail: (id: number) => `/api/v1/academic/faculties/${id}/`,
    update: (id: number) => `/api/v1/academic/faculties/${id}/`,
    patch: (id: number) => `/api/v1/academic/faculties/${id}/`,
    delete: (id: number) => `/api/v1/academic/faculties/${id}/`,
  },

  // Academic Module - Programs
  programs: {
    list: "/api/v1/academic/programs/",
    create: "/api/v1/academic/programs/",
    detail: (id: number) => `/api/v1/academic/programs/${id}/`,
    update: (id: number) => `/api/v1/academic/programs/${id}/`,
    patch: (id: number) => `/api/v1/academic/programs/${id}/`,
    delete: (id: number) => `/api/v1/academic/programs/${id}/`,
  },

  // Academic Module - Classes
  classes: {
    list: "/api/v1/academic/classes/",
    create: "/api/v1/academic/classes/",
    detail: (id: number) => `/api/v1/academic/classes/${id}/`,
    update: (id: number) => `/api/v1/academic/classes/${id}/`,
    patch: (id: number) => `/api/v1/academic/classes/${id}/`,
    delete: (id: number) => `/api/v1/academic/classes/${id}/`,
  },

  // Academic Module - Sections
  sections: {
    list: "/api/v1/academic/sections/",
    create: "/api/v1/academic/sections/",
    detail: (id: number) => `/api/v1/academic/sections/${id}/`,
    update: (id: number) => `/api/v1/academic/sections/${id}/`,
    patch: (id: number) => `/api/v1/academic/sections/${id}/`,
    delete: (id: number) => `/api/v1/academic/sections/${id}/`,
  },

  // Academic Module - Subjects
  subjects: {
    list: "/api/v1/academic/subjects/",
    create: "/api/v1/academic/subjects/",
    detail: (id: number) => `/api/v1/academic/subjects/${id}/`,
    update: (id: number) => `/api/v1/academic/subjects/${id}/`,
    patch: (id: number) => `/api/v1/academic/subjects/${id}/`,
    delete: (id: number) => `/api/v1/academic/subjects/${id}/`,
  },

  // Academic Module - Optional Subjects
  optionalSubjects: {
    list: "/api/v1/academic/optional-subjects/",
    create: "/api/v1/academic/optional-subjects/",
    detail: (id: number) => `/api/v1/academic/optional-subjects/${id}/`,
    update: (id: number) => `/api/v1/academic/optional-subjects/${id}/`,
    patch: (id: number) => `/api/v1/academic/optional-subjects/${id}/`,
    delete: (id: number) => `/api/v1/academic/optional-subjects/${id}/`,
  },

  // Academic Module - Subject Assignments
  subjectAssignments: {
    list: "/api/v1/academic/subject-assignments/",
    create: "/api/v1/academic/subject-assignments/",
    detail: (id: number) => `/api/v1/academic/subject-assignments/${id}/`,
    update: (id: number) => `/api/v1/academic/subject-assignments/${id}/`,
    patch: (id: number) => `/api/v1/academic/subject-assignments/${id}/`,
    delete: (id: number) => `/api/v1/academic/subject-assignments/${id}/`,
  },

  // Academic Module - Classrooms
  classrooms: {
    list: "/api/v1/academic/classrooms/",
    create: "/api/v1/academic/classrooms/",
    detail: (id: number) => `/api/v1/academic/classrooms/${id}/`,
    update: (id: number) => `/api/v1/academic/classrooms/${id}/`,
    patch: (id: number) => `/api/v1/academic/classrooms/${id}/`,
    delete: (id: number) => `/api/v1/academic/classrooms/${id}/`,
  },

  // Academic Module - Class Times
  classTimes: {
    list: "/api/v1/academic/class-times/",
    create: "/api/v1/academic/class-times/",
    detail: (id: number) => `/api/v1/academic/class-times/${id}/`,
    update: (id: number) => `/api/v1/academic/class-times/${id}/`,
    patch: (id: number) => `/api/v1/academic/class-times/${id}/`,
    delete: (id: number) => `/api/v1/academic/class-times/${id}/`,
  },

  // Academic Module - Timetable
  timetable: {
    list: "/api/v1/academic/timetable/",
    create: "/api/v1/academic/timetable/",
    detail: (id: number) => `/api/v1/academic/timetable/${id}/`,
    update: (id: number) => `/api/v1/academic/timetable/${id}/`,
    patch: (id: number) => `/api/v1/academic/timetable/${id}/`,
    delete: (id: number) => `/api/v1/academic/timetable/${id}/`,
  },

  // Academic Module - Lab Schedules
  labSchedules: {
    list: "/api/v1/academic/lab-schedules/",
    create: "/api/v1/academic/lab-schedules/",
    detail: (id: number) => `/api/v1/academic/lab-schedules/${id}/`,
    update: (id: number) => `/api/v1/academic/lab-schedules/${id}/`,
    patch: (id: number) => `/api/v1/academic/lab-schedules/${id}/`,
    delete: (id: number) => `/api/v1/academic/lab-schedules/${id}/`,
  },

  // Academic Module - Class Teachers
  classTeachers: {
    list: "/api/v1/academic/class-teachers/",
    create: "/api/v1/academic/class-teachers/",
    detail: (id: number) => `/api/v1/academic/class-teachers/${id}/`,
    update: (id: number) => `/api/v1/academic/class-teachers/${id}/`,
    patch: (id: number) => `/api/v1/academic/class-teachers/${id}/`,
    delete: (id: number) => `/api/v1/academic/class-teachers/${id}/`,
  },

  // Students Module - Categories
  studentCategories: {
    list: "/api/v1/students/categories/",
    create: "/api/v1/students/categories/",
    detail: (id: number) => `/api/v1/students/categories/${id}/`,
    update: (id: number) => `/api/v1/students/categories/${id}/`,
    patch: (id: number) => `/api/v1/students/categories/${id}/`,
    delete: (id: number) => `/api/v1/students/categories/${id}/`,
  },

  // Students Module - Groups
  studentGroups: {
    list: "/api/v1/students/groups/",
    create: "/api/v1/students/groups/",
    detail: (id: number) => `/api/v1/students/groups/${id}/`,
    update: (id: number) => `/api/v1/students/groups/${id}/`,
    patch: (id: number) => `/api/v1/students/groups/${id}/`,
    delete: (id: number) => `/api/v1/students/groups/${id}/`,
  },

  // Students Module - Students
  students: {
    list: "/api/v1/students/students/",
    create: "/api/v1/students/students/",
    detail: (id: number) => `/api/v1/students/students/${id}/`,
    update: (id: number) => `/api/v1/students/students/${id}/`,
    patch: (id: number) => `/api/v1/students/students/${id}/`,
    delete: (id: number) => `/api/v1/students/students/${id}/`,
  },

  // Students Module - Guardians
  guardians: {
    list: "/api/v1/students/guardians/",
    create: "/api/v1/students/guardians/",
    detail: (id: number) => `/api/v1/students/guardians/${id}/`,
    update: (id: number) => `/api/v1/students/guardians/${id}/`,
    patch: (id: number) => `/api/v1/students/guardians/${id}/`,
    delete: (id: number) => `/api/v1/students/guardians/${id}/`,
  },

  // Students Module - Student Guardians
  studentGuardians: {
    list: "/api/v1/students/student-guardians/",
    create: "/api/v1/students/student-guardians/",
    detail: (id: number) => `/api/v1/students/student-guardians/${id}/`,
    update: (id: number) => `/api/v1/students/student-guardians/${id}/`,
    patch: (id: number) => `/api/v1/students/student-guardians/${id}/`,
    delete: (id: number) => `/api/v1/students/student-guardians/${id}/`,
  },

  // Students Module - Addresses
  studentAddresses: {
    list: "/api/v1/students/addresses/",
    create: "/api/v1/students/addresses/",
    detail: (id: number) => `/api/v1/students/addresses/${id}/`,
    update: (id: number) => `/api/v1/students/addresses/${id}/`,
    patch: (id: number) => `/api/v1/students/addresses/${id}/`,
    delete: (id: number) => `/api/v1/students/addresses/${id}/`,
  },

  // Students Module - Documents
  studentDocuments: {
    list: "/api/v1/students/documents/",
    create: "/api/v1/students/documents/",
    detail: (id: number) => `/api/v1/students/documents/${id}/`,
    update: (id: number) => `/api/v1/students/documents/${id}/`,
    patch: (id: number) => `/api/v1/students/documents/${id}/`,
    delete: (id: number) => `/api/v1/students/documents/${id}/`,
  },

  // Students Module - Medical Records
  studentMedicalRecords: {
    list: "/api/v1/students/medical-records/",
    create: "/api/v1/students/medical-records/",
    detail: (id: number) => `/api/v1/students/medical-records/${id}/`,
    update: (id: number) => `/api/v1/students/medical-records/${id}/`,
    patch: (id: number) => `/api/v1/students/medical-records/${id}/`,
    delete: (id: number) => `/api/v1/students/medical-records/${id}/`,
  },

  // Students Module - Previous Academic Records
  previousAcademicRecords: {
    list: "/api/v1/students/previous-records/",
    create: "/api/v1/students/previous-records/",
    detail: (id: number) => `/api/v1/students/previous-records/${id}/`,
    update: (id: number) => `/api/v1/students/previous-records/${id}/`,
    patch: (id: number) => `/api/v1/students/previous-records/${id}/`,
    delete: (id: number) => `/api/v1/students/previous-records/${id}/`,
  },

  // Students Module - Promotions
  studentPromotions: {
    list: "/api/v1/students/promotions/",
    create: "/api/v1/students/promotions/",
    detail: (id: number) => `/api/v1/students/promotions/${id}/`,
    update: (id: number) => `/api/v1/students/promotions/${id}/`,
    patch: (id: number) => `/api/v1/students/promotions/${id}/`,
    delete: (id: number) => `/api/v1/students/promotions/${id}/`,
  },

  // Students Module - Certificates
  certificates: {
    list: "/api/v1/students/certificates/",
    create: "/api/v1/students/certificates/",
    detail: (id: number) => `/api/v1/students/certificates/${id}/`,
    update: (id: number) => `/api/v1/students/certificates/${id}/`,
    patch: (id: number) => `/api/v1/students/certificates/${id}/`,
    delete: (id: number) => `/api/v1/students/certificates/${id}/`,
  },

  // Students Module - ID Cards
  studentIDCards: {
    list: "/api/v1/students/id-cards/",
    create: "/api/v1/students/id-cards/",
    detail: (id: number) => `/api/v1/students/id-cards/${id}/`,
    update: (id: number) => `/api/v1/students/id-cards/${id}/`,
    patch: (id: number) => `/api/v1/students/id-cards/${id}/`,
    delete: (id: number) => `/api/v1/students/id-cards/${id}/`,
  },
};

/**
 * Get the College ID for X-College-ID header
 * Returns 'all' for super_admin users, otherwise returns the user's college ID
 */
/**
 * Get the College ID for X-College-ID header
 * Returns the user's college ID
 */
const getCollegeId = (): string => {
  try {
    const storedUser = localStorage.getItem('kumss_user');
    if (!storedUser) {
      return 'all';
    }

    const user = JSON.parse(storedUser) as User;
   if (user.userType === 'super_admin') {
      return 'all';
    }

        if (user.college === 0 || user.college === null || user.college === undefined) {
      return 'all';
    }

    // Return the user's college ID if available
    if (user.college) {
      return String(user.college);
    }

    return 'all';
  } catch (error) {
    console.error('Error parsing user data for college ID:', error);
    return 'all';
  }
};

/**
 * Default Headers for API requests
 */
export const getDefaultHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-College-ID": getCollegeId(),
  };

  // Add Authorization header if token exists
  const token = localStorage.getItem("kumss_auth_token");
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  return headers;
};

/**
 * Build full API URL
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
