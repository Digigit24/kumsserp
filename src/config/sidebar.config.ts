import {
  BarChart,
  Bell,
  BookOpen,
  Briefcase,
  Bug,
  Building2,
  Calendar,
  CheckSquare,
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  Home,
  Library,
  MessageSquare,
  PenTool,
  School,
  Settings,
  Shield,
  Store,
  Users,
} from "lucide-react";

export interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  roles?: string[]; // Which roles can see this item (simple role-based)
  permissions?: string[]; // Which permissions needed (flexible permission-based)
  requireAllPermissions?: boolean; // If true, user needs ALL permissions. If false, needs ANY. Default: false
}

export interface SidebarGroup {
  group: string;
  icon: any;
  items: SidebarItem[];
  roles?: string[]; // Which roles can see this group (simple role-based)
  permissions?: string[]; // Which permissions needed (flexible permission-based)
  requireAllPermissions?: boolean; // If true, user needs ALL permissions. If false, needs ANY. Default: false
}

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  // ================= DASHBOARD (ALL ROLES) =================
  {
    group: "Dashboard",
    icon: Home,
    roles: ["super_admin", "college_admin", "teacher", "student", "parent"], // ALL roles
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: Home,
        roles: ["super_admin", "college_admin", "teacher", "student", "parent"], // ALL
      },
    ],
  },

  // ================= MY ACADEMICS (STUDENT ONLY) =================
  {
    group: "My Academics",
    icon: BookOpen,
    roles: ["student"],
    items: [
      {
        name: "My Subjects",
        href: "/student/academics/subjects",
        icon: BookOpen,
        roles: ["student"],
      },
      {
        name: "My Timetable",
        href: "/student/academics/timetable",
        icon: Calendar,
        roles: ["student"],
      },
      {
        name: "My Attendance",
        href: "/student/academics/attendance",
        icon: ClipboardList,
        roles: ["student"],
      },
      {
        name: "My Assignments",
        href: "/student/academics/assignments",
        icon: FileText,
        roles: ["student"],
      },
    ],
  },

  // ================= MY CLASSES (TEACHER ONLY) =================
  {
    group: "My Classes",
    icon: School,
    roles: ["teacher"],
    items: [
      {
        name: "Attendance",
        href: "/teacher/attendance",
        icon: ClipboardList,
        roles: ["teacher"],
      },
      {
        name: "Students",
        href: "/teacher/students",
        icon: Users,
        roles: ["teacher"],
      },
      {
        name: "Subjects",
        href: "/teacher/subjects",
        icon: BookOpen,
        roles: ["teacher"],
      },
    ],
  },

  // ================= ASSIGNMENTS (TEACHER) =================
  {
    group: "Assignments",
    icon: FileText,
    roles: ["teacher"],
    items: [
      {
        name: "Create Assignment",
        href: "/assignments/create",
        icon: FileText,
        roles: ["teacher"],
      },
      {
        name: "My Assignments",
        href: "/assignments/list",
        icon: FileText,
        roles: ["teacher"],
      },
      {
        name: "Submissions",
        href: "/assignments/submissions",
        icon: ClipboardList,
        roles: ["teacher"],
      },
    ],
  },

  // ================= CORE (ADMIN ONLY) =================
  {
    group: "Core",
    icon: Settings,
    roles: ["super_admin", "college_admin"], // ADMIN ONLY
    items: [
      {
        name: "Colleges",
        href: "/core/colleges",
        icon: Building2,
        roles: ["super_admin"], // SUPER ADMIN ONLY
      },
      {
        name: "Academic Years",
        href: "/core/academic-years",
        icon: Calendar,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Academic Sessions",
        href: "/core/academic-sessions",
        icon: GraduationCap,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Holidays",
        href: "/core/holidays",
        icon: Calendar,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Weekends",
        href: "/core/weekends",
        icon: Calendar,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Notification Settings",
        href: "/core/notification-settings",
        icon: Bell,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "System Settings",
        href: "/core/system-settings",
        icon: Settings,
        roles: ["super_admin"],
      },
      {
        name: "Activity Logs",
        href: "/core/activity-logs",
        icon: FileText,
        roles: ["super_admin", "college_admin"],
      },
    ],
  },

  // ================= ACCOUNTS (ADMIN ONLY) =================
  {
    group: "Accounts",
    icon: Users,
    roles: ["super_admin", "college_admin"],
    items: [
      {
        name: "Users",
        href: "/accounts/users",
        icon: Users,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Roles",
        href: "/accounts/roles",
        icon: Shield,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "User Role Assignments",
        href: "/accounts/user-roles",
        icon: Shield,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Departments",
        href: "/accounts/departments",
        icon: Building2,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "User Profiles",
        href: "/accounts/user-profiles",
        icon: Users,
        roles: ["super_admin", "college_admin"],
      },
    ],
  },

  // ================= ACADEMIC MANAGEMENT (ADMIN + TEACHER) =================
  {
    group: "Academic Management",
    icon: School,
    roles: ["super_admin", "college_admin", "teacher"],
    items: [
      {
        name: "Class Teachers",
        href: "/academic/class-teachers",
        icon: Users,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Class Times",
        href: "/academic/class-times",
        icon: Calendar,
        roles: ["super_admin", "college_admin", "teacher"], // Teachers can view
      },
      {
        name: "Classes",
        href: "/academic/classes",
        icon: School,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Classrooms",
        href: "/academic/classrooms",
        icon: Building2,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Faculties",
        href: "/academic/faculties",
        icon: Users,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Lab Schedules",
        href: "/academic/lab-schedules",
        icon: Calendar,
        roles: ["super_admin", "college_admin", "teacher"],
      },
      {
        name: "Optional Subject Groups",
        href: "/academic/optional-subjects",
        icon: BookOpen,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Programs",
        href: "/academic/programs",
        icon: GraduationCap,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Sections",
        href: "/academic/sections",
        icon: School,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Subject Assignments",
        href: "/academic/subject-assignments",
        icon: BookOpen,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Subjects",
        href: "/academic/subjects",
        icon: BookOpen,
        roles: ["super_admin", "college_admin", "teacher"], // Teachers can view
      },
      {
        name: "Timetables",
        href: "/academic/timetables",
        icon: Calendar,
        roles: ["super_admin", "college_admin", "teacher", "student"], // All can view
      },
    ],
  },

  // ================= STUDENTS (ADMIN + TEACHER) =================
  {
    group: "Student Management",
    icon: GraduationCap,
    roles: ["super_admin", "college_admin", "teacher"],
    items: [
      {
        name: "Students",
        href: "/students/list",
        icon: GraduationCap,
        roles: ["super_admin", "college_admin", "teacher"],
      },
      {
        name: "Guardians",
        href: "/students/guardians",
        icon: Users,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Student Categories",
        href: "/students/categories",
        icon: ClipboardList,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Student Groups",
        href: "/students/groups",
        icon: Users,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Student Documents",
        href: "/students/documents",
        icon: FileText,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Student Addresses",
        href: "/students/addresses",
        icon: Building2,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Student Medical Records",
        href: "/students/medical-records",
        icon: FileText,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Student Promotions",
        href: "/students/promotions",
        icon: GraduationCap,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Certificates",
        href: "/students/certificates",
        icon: FileText,
        roles: ["super_admin", "college_admin"],
      },
    ],
  },

  // ================= ATTENDANCE (ADMIN + TEACHER) =================
  {
    group: "Attendance Management",
    icon: ClipboardList,
    roles: ["super_admin", "college_admin", "teacher"],
    items: [
      {
        name: "Student Attendance",
        href: "/attendance/students",
        icon: ClipboardList,
        roles: ["super_admin", "college_admin", "teacher"], // Teachers mark attendance
      },
      {
        name: "Staff Attendance",
        href: "/attendance/staff",
        icon: ClipboardList,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Subject Attendance",
        href: "/attendance/subjects",
        icon: ClipboardList,
        roles: ["super_admin", "college_admin", "teacher"],
      },
      {
        name: "Attendance Notifications",
        href: "/attendance/notifications",
        icon: Bell,
        roles: ["super_admin", "college_admin"],
      },
    ],
  },

  // ================= EXAMINATIONS (ADMIN + TEACHER + STUDENT) =================
  {
    group: "Examinations",
    icon: PenTool,
    roles: ["super_admin", "college_admin", "teacher", "student"],
    items: [
      {
        name: "Exams",
        href: "/exams/exams",
        icon: PenTool,
        roles: ["super_admin", "college_admin", "teacher"],
      },
      {
        name: "Exam Types",
        href: "/exams/types",
        icon: PenTool,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Exam Schedules",
        href: "/exams/schedules",
        icon: Calendar,
        roles: ["super_admin", "college_admin", "teacher", "student"], // All can view
      },
      {
        name: "Marks Entry",
        href: "/exams/marks-entry",
        icon: PenTool,
        roles: ["teacher"], // Teacher-specific marks entry
      },
      {
        name: "Marking",
        href: "/exams/marking",
        icon: CheckSquare,
        roles: ["teacher"], // Teacher-specific marking
      },
      {
        name: "Grade Sheets",
        href: "/exams/grade-sheets",
        icon: FileText,
        roles: ["teacher"], // Teacher can view grade sheets
      },
      {
        name: "Marks Registers",
        href: "/exams/marks-registers",
        icon: FileText,
        roles: ["super_admin", "college_admin", "teacher"],
      },
      {
        name: "Progress Cards",
        href: "/exams/progress-cards",
        icon: FileText,
        roles: ["super_admin", "college_admin", "teacher"],
      },
      {
        name: "Tabulation Sheets",
        href: "/exams/tabulation-sheets",
        icon: FileText,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "My Results", // NEW for students
        href: "/exams/my-results",
        icon: FileText,
        roles: ["student"],
      },
    ],
  },

  // ================= FEES (ADMIN + STUDENT) =================
  {
    group: "Fees",
    icon: CreditCard,
    roles: ["super_admin", "college_admin", "student", "parent"],
    items: [
      {
        name: "Fee Masters",
        href: "/fees/masters",
        icon: CreditCard,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Fee Collections",
        href: "/fees/collections",
        icon: CreditCard,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Fee Discounts",
        href: "/fees/discounts",
        icon: CreditCard,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Fee Fines",
        href: "/fees/fines",
        icon: CreditCard,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Fee Structures",
        href: "/fees/structures",
        icon: CreditCard,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "My Fees", // NEW for students
        href: "/fees/my-fees",
        icon: CreditCard,
        roles: ["student", "parent"],
      },
    ],
  },

  // ================= LIBRARY (ADMIN + TEACHER + STUDENT) =================
  {
    group: "Library Management",
    icon: Library,
    roles: ["super_admin", "college_admin", "teacher", "student"],
    items: [
      {
        name: "Books",
        href: "/library/books",
        icon: BookOpen,
        roles: ["super_admin", "college_admin", "teacher", "student"], // All can view
      },
      {
        name: "Book Issues",
        href: "/library/issues",
        icon: ClipboardList,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Book Returns",
        href: "/library/returns",
        icon: ClipboardList,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Library Members",
        href: "/library/members",
        icon: Users,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "My Books", // NEW for students
        href: "/library/my-books",
        icon: BookOpen,
        roles: ["student", "teacher"],
      },
      {
        name: "Student Library", // Comprehensive library page for students
        href: "/library/student",
        icon: Library,
        roles: ["student"],
      },
    ],
  },

  // ================= HR (ADMIN ONLY) =================
  {
    group: "HR Management",
    icon: Briefcase,
    roles: ["super_admin", "college_admin"],
    items: [
      {
        name: "Leave Applications",
        href: "/hr/leave-applications",
        icon: FileText,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Leave Approvals",
        href: "/hr/leave-approvals",
        icon: FileText,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Payrolls",
        href: "/hr/payrolls",
        icon: CreditCard,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Salary Structures",
        href: "/hr/salary-structures",
        icon: CreditCard,
        roles: ["super_admin", "college_admin"],
      },
    ],
  },

  // ================= REPORTS (ADMIN + TEACHER) =================
  {
    group: "Reports",
    icon: BarChart,
    roles: ["super_admin", "college_admin", "teacher"],
    items: [
      {
        name: "Generated Reports",
        href: "/reports/generated",
        icon: BarChart,
        roles: ["super_admin", "college_admin", "teacher"],
      },
      {
        name: "Report Templates",
        href: "/reports/templates",
        icon: FileText,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Saved Reports",
        href: "/reports/saved",
        icon: FileText,
        roles: ["super_admin", "college_admin", "teacher"],
      },
    ],
  },

  // ================= STORE (ADMIN ONLY) =================
  {
    group: "Store Management",
    icon: Store,
    roles: ["super_admin", "college_admin"],
    items: [
      {
        name: "Store Items",
        href: "/store/items",
        icon: Store,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Print Requests",
        href: "/store/print-requests",
        icon: FileText,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Vendors",
        href: "/store/vendors",
        icon: Users,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Stock Receives",
        href: "/store/receives",
        icon: ClipboardList,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Store Sales",
        href: "/store/sales",
        icon: CreditCard,
        roles: ["super_admin", "college_admin"],
      },
    ],
  },

  // ================= COMMUNICATION (ALL) =================
  {
    group: "Communication",
    icon: MessageSquare,
    roles: ["super_admin", "college_admin", "teacher", "student", "parent"],
    items: [
      {
        name: "Communication Center",
        href: "/communication",
        icon: MessageSquare,
        roles: ["super_admin", "college_admin"], // Admin communication center
      },
      {
        name: "Teacher Messages",
        href: "/communication/teacher",
        icon: MessageSquare,
        roles: ["teacher"], // Teacher communication
      },
      {
        name: "Messages",
        href: "/communication/student",
        icon: MessageSquare,
        roles: ["student"], // Student communication
      },
      {
        name: "Notices",
        href: "/communication/notices",
        icon: Bell,
        roles: ["super_admin", "college_admin", "teacher", "student", "parent"], // All can view
      },
      {
        name: "Message Logs",
        href: "/communication/message-logs",
        icon: FileText,
        roles: ["super_admin", "college_admin"],
      },
    ],
  },

  // ================= PROFILE (ALL USERS) =================
  {
    group: "Profile",
    icon: Users,
    roles: ["super_admin", "college_admin", "teacher", "student", "parent"],
    items: [
      {
        name: "My Profile",
        href: "/profile",
        icon: Users,
        roles: ["super_admin", "college_admin", "teacher", "student", "parent"],
      },
      {
        name: "Settings",
        href: "/profile/settings",
        icon: Settings,
        roles: ["super_admin", "college_admin", "teacher", "student", "parent"],
      },
    ],
  },

  // ================= SYSTEM (ADMIN ONLY) =================
  {
    group: "System",
    icon: Settings,
    roles: ["super_admin", "college_admin"],
    items: [
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
        roles: ["super_admin", "college_admin"],
      },
      {
        name: "Debug",
        href: "/debug",
        icon: Bug,
        roles: ["super_admin"],
      },
    ],
  },
];

/**
 * Check if user has access based on roles or permissions
 */
function hasAccess(
  userType: string,
  userPermissions: string[] = [],
  item: { roles?: string[]; permissions?: string[]; requireAllPermissions?: boolean }
): boolean {
  // If no roles and no permissions specified, visible to all
  if (!item.roles && !item.permissions) return true;

  // Check role-based access (backward compatibility)
  if (item.roles && item.roles.includes(userType)) {
    return true;
  }

  // Check permission-based access
  if (item.permissions && item.permissions.length > 0) {
    if (item.requireAllPermissions) {
      // User must have ALL permissions
      return item.permissions.every(perm => userPermissions.includes(perm));
    } else {
      // User must have ANY permission
      return item.permissions.some(perm => userPermissions.includes(perm));
    }
  }

  return false;
}

/**
 * Filter sidebar groups and items based on user role and permissions
 *
 * @param userType - User's role (e.g., 'super_admin', 'teacher', 'hod')
 * @param userPermissions - Array of permission strings (e.g., ['view_students', 'manage_department'])
 */
export function getFilteredSidebarGroups(
  userType: string,
  userPermissions: string[] = []
): SidebarGroup[] {
  return SIDEBAR_GROUPS.filter((group) => {
    // Filter groups by role or permissions
    return hasAccess(userType, userPermissions, group);
  })
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        // Filter items by role or permissions
        return hasAccess(userType, userPermissions, item);
      }),
    }))
    .filter((group) => group.items.length > 0); // Remove empty groups
}
