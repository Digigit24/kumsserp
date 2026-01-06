/**
 * Dashboard Configuration
 *
 * This file controls which dashboard sections are rendered for different roles/permissions.
 * Each section can specify which roles can see it, making it easy to customize
 * dashboards for different user types (including custom roles like HOD, etc.)
 *
 * To add a new dashboard section:
 * 1. Create the component in src/components/dashboard/sections/
 * 2. Add it to the DASHBOARD_SECTIONS array below
 * 3. Specify which roles should see it in the 'allowedRoles' array
 */

export interface DashboardSection {
  id: string;
  component: string; // Component name to import
  allowedRoles: string[]; // Which roles can see this section
  order: number; // Display order (lower = earlier)
}

/**
 * Dashboard Sections Configuration
 *
 * Add or remove sections here to control what appears on the dashboard.
 * Each section will only render if the user has one of the allowedRoles.
 */
export const DASHBOARD_SECTIONS: DashboardSection[] = [
  // ============== ADMIN SECTIONS ==============
  {
    id: 'admin-quick-actions',
    component: 'AdminQuickActions',
    allowedRoles: ['super_admin', 'college_admin'],
    order: 1,
  },
  {
    id: 'admin-key-metrics',
    component: 'AdminKeyMetrics',
    allowedRoles: ['super_admin', 'college_admin'],
    order: 2,
  },
  {
    id: 'admin-pending-tasks',
    component: 'AdminPendingTasks',
    allowedRoles: ['super_admin', 'college_admin'],
    order: 3,
  },
  {
    id: 'admin-system-alerts',
    component: 'AdminSystemAlerts',
    allowedRoles: ['super_admin', 'college_admin'],
    order: 4,
  },
  {
    id: 'admin-recent-activities',
    component: 'AdminRecentActivities',
    allowedRoles: ['super_admin', 'college_admin'],
    order: 5,
  },
  {
    id: 'admin-upcoming-events',
    component: 'AdminUpcomingEvents',
    allowedRoles: ['super_admin', 'college_admin'],
    order: 6,
  },
  {
    id: 'admin-institution-overview',
    component: 'AdminInstitutionOverview',
    allowedRoles: ['super_admin', 'college_admin'],
    order: 7,
  },
  {
    id: 'admin-management-links',
    component: 'AdminManagementLinks',
    allowedRoles: ['super_admin', 'college_admin'],
    order: 8,
  },

  // ============== TEACHER SECTIONS ==============
  {
    id: 'teacher-quick-stats',
    component: 'TeacherQuickStats',
    allowedRoles: ['teacher'],
    order: 1,
  },
  {
    id: 'teacher-todays-classes',
    component: 'TeacherTodaysClasses',
    allowedRoles: ['teacher'],
    order: 2,
  },
  {
    id: 'teacher-pending-actions',
    component: 'TeacherPendingActions',
    allowedRoles: ['teacher'],
    order: 3,
  },
  {
    id: 'teacher-assignments',
    component: 'TeacherAssignments',
    allowedRoles: ['teacher'],
    order: 4,
  },
  {
    id: 'teacher-announcements',
    component: 'TeacherAnnouncements',
    allowedRoles: ['teacher'],
    order: 5,
  },

  // ============== STUDENT SECTIONS ==============
  {
    id: 'student-quick-actions',
    component: 'StudentQuickActions',
    allowedRoles: ['student'],
    order: 1,
  },
  {
    id: 'student-priority-cards',
    component: 'StudentPriorityCards',
    allowedRoles: ['student'],
    order: 2,
  },
  {
    id: 'student-attendance-calendar',
    component: 'StudentAttendanceCalendar',
    allowedRoles: ['student'],
    order: 3,
  },
  {
    id: 'student-test-marks',
    component: 'StudentTestMarks',
    allowedRoles: ['student'],
    order: 4,
  },
  {
    id: 'student-todays-schedule',
    component: 'StudentTodaysSchedule',
    allowedRoles: ['student'],
    order: 5,
  },
  {
    id: 'student-upcoming-exams',
    component: 'StudentUpcomingExams',
    allowedRoles: ['student'],
    order: 6,
  },
  {
    id: 'student-assignments',
    component: 'StudentAssignments',
    allowedRoles: ['student'],
    order: 7,
  },

  // ============== STAFF SECTIONS ==============
  {
    id: 'staff-quick-actions',
    component: 'StaffQuickActions',
    allowedRoles: ['staff', 'hr', 'store_manager', 'library_manager'],
    order: 1,
  },
  {
    id: 'staff-module-stats',
    component: 'StaffModuleStats',
    allowedRoles: ['staff', 'hr', 'store_manager', 'library_manager'],
    order: 2,
  },

  // ============== CENTRAL STORE MANAGER SECTIONS ==============
  {
    id: 'central-store-stats',
    component: 'CentralStoreStats',
    allowedRoles: ['central_manager', 'super_admin'],
    order: 1,
  },
  {
    id: 'central-store-quick-actions',
    component: 'CentralStoreQuickActions',
    allowedRoles: ['central_manager', 'super_admin'],
    order: 2,
  },
  {
    id: 'central-store-communication',
    component: 'CentralStoreCommunication',
    allowedRoles: ['central_manager', 'super_admin'],
    order: 3,
  },
];

/**
 * Get sections for a specific role
 */
export function getSectionsForRole(userRole: string): DashboardSection[] {
  return DASHBOARD_SECTIONS
    .filter(section => section.allowedRoles.includes(userRole))
    .sort((a, b) => a.order - b.order);
}

/**
 * Check if a section should be rendered for a user
 */
export function shouldRenderSection(sectionId: string, userRole: string): boolean {
  const section = DASHBOARD_SECTIONS.find(s => s.id === sectionId);
  if (!section) return false;
  return section.allowedRoles.includes(userRole);
}

/**
 * Example: How to add a new role (like HOD - Head of Department)
 *
 * 1. Add HOD-specific sections or modify existing allowedRoles:
 *
 * {
 *   id: 'hod-department-overview',
 *   component: 'HODDepartmentOverview',
 *   allowedRoles: ['hod', 'super_admin'], // HOD and admin can see this
 *   order: 1,
 * },
 *
 * 2. Give HOD access to teacher sections:
 *
 * {
 *   id: 'teacher-todays-classes',
 *   component: 'TeacherTodaysClasses',
 *   allowedRoles: ['teacher', 'hod'], // Now HOD can see this too
 *   order: 2,
 * },
 *
 * 3. Create the HODDepartmentOverview component in sections/
 *
 * This makes it very easy to customize permissions without touching
 * the main Dashboard component!
 */
