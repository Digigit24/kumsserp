/**
 * Dashboard Sections - Modular Components
 *
 * Each section is a self-contained component that can be rendered
 * on the dashboard based on user permissions.
 *
 * To add a new section:
 * 1. Create the component file here
 * 2. Export it below
 * 3. Add it to dashboard.config.ts
 */

// Admin Sections
export { AdminQuickActions } from './AdminQuickActions';
export { AdminKeyMetrics } from './AdminKeyMetrics';
export { AdminPendingTasks } from './AdminPendingTasks';
export { AdminSystemAlerts } from './AdminSystemAlerts';
export { AdminRecentActivities } from './AdminRecentActivities';
export { AdminUpcomingEvents } from './AdminUpcomingEvents';
export { AdminInstitutionOverview } from './AdminInstitutionOverview';
export { AdminManagementLinks } from './AdminManagementLinks';

// Teacher Sections
export { TeacherQuickStats } from './TeacherQuickStats';
export { TeacherTodaysClasses } from './TeacherTodaysClasses';
export { TeacherPendingActions } from './TeacherPendingActions';
export { TeacherAssignments } from './TeacherAssignments';
export { TeacherAnnouncements } from './TeacherAnnouncements';

// Student Sections
export { StudentQuickActions } from './StudentQuickActions';
export { StudentPriorityCards } from './StudentPriorityCards';
export { StudentAttendanceCalendar } from './StudentAttendanceCalendar';
export { StudentTestMarks } from './StudentTestMarks';
export { StudentTodaysSchedule } from './StudentTodaysSchedule';
export { StudentUpcomingExams } from './StudentUpcomingExams';
export { StudentAssignments } from './StudentAssignments';

// Staff Sections
export { StaffQuickActions } from './StaffQuickActions';
export { StaffModuleStats } from './StaffModuleStats';

/**
 * Section Component Map
 *
 * Maps section component names to actual components.
 * This is used by the Dashboard to dynamically render sections.
 */
import { AdminQuickActions } from './AdminQuickActions';
import { AdminKeyMetrics } from './AdminKeyMetrics';
import { AdminPendingTasks } from './AdminPendingTasks';
import { AdminSystemAlerts } from './AdminSystemAlerts';
import { AdminRecentActivities } from './AdminRecentActivities';
import { AdminUpcomingEvents } from './AdminUpcomingEvents';
import { AdminInstitutionOverview } from './AdminInstitutionOverview';
import { AdminManagementLinks } from './AdminManagementLinks';
import { TeacherQuickStats } from './TeacherQuickStats';
import { TeacherTodaysClasses } from './TeacherTodaysClasses';
import { TeacherPendingActions } from './TeacherPendingActions';
import { TeacherAssignments } from './TeacherAssignments';
import { TeacherAnnouncements } from './TeacherAnnouncements';
import { StudentQuickActions } from './StudentQuickActions';
import { StudentPriorityCards } from './StudentPriorityCards';
import { StudentAttendanceCalendar } from './StudentAttendanceCalendar';
import { StudentTestMarks } from './StudentTestMarks';
import { StudentTodaysSchedule } from './StudentTodaysSchedule';
import { StudentUpcomingExams } from './StudentUpcomingExams';
import { StudentAssignments } from './StudentAssignments';
import { StaffQuickActions } from './StaffQuickActions';
import { StaffModuleStats } from './StaffModuleStats';

export const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  // Admin
  AdminQuickActions,
  AdminKeyMetrics,
  AdminPendingTasks,
  AdminSystemAlerts,
  AdminRecentActivities,
  AdminUpcomingEvents,
  AdminInstitutionOverview,
  AdminManagementLinks,
  // Teacher
  TeacherQuickStats,
  TeacherTodaysClasses,
  TeacherPendingActions,
  TeacherAssignments,
  TeacherAnnouncements,
  // Student
  StudentQuickActions,
  StudentPriorityCards,
  StudentAttendanceCalendar,
  StudentTestMarks,
  StudentTodaysSchedule,
  StudentUpcomingExams,
  StudentAssignments,
  // Staff
  StaffQuickActions,
  StaffModuleStats,
};
