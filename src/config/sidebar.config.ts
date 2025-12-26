// import {
//   BarChart,
//   Bell,
//   BookOpen,
//   Briefcase,
//   Bug,
//   Building2,
//   Calendar,
//   ClipboardList,
//   CreditCard,
//   FileText,
//   GraduationCap,
//   Home,
//   Library,
//   MessageSquare,
//   PenTool,
//   School,
//   Settings,
//   Shield,
//   Store,
//   Users,
// } from "lucide-react";

// export interface SidebarItem {
//   name: string;
//   href: string;
//   icon: any;
// }

// export interface SidebarGroup {
//   group: string;
//   icon: any;
//   items: SidebarItem[];
// }

// export const SIDEBAR_GROUPS: SidebarGroup[] = [
//   {
//     group: "Dashboard",
//     icon: Home,
//     items: [{ name: "Dashboard", href: "/dashboard", icon: Home }],
//   },

//   // ================= CORE =================
//   {
//     group: "Core",
//     icon: Settings,
//     items: [
//       { name: "Colleges", href: "/core/colleges", icon: Building2 },
//       { name: "Academic Years", href: "/core/academic-years", icon: Calendar },
//       {
//         name: "Academic Sessions",
//         href: "/core/academic-sessions",
//         icon: GraduationCap,
//       },
//       { name: "Holidays", href: "/core/holidays", icon: Calendar },
//       { name: "Weekends", href: "/core/weekends", icon: Calendar },
//       {
//         name: "Notification Settings",
//         href: "/core/notification-settings",
//         icon: Bell,
//       },
//       {
//         name: "System Settings",
//         href: "/core/system-settings",
//         icon: Settings,
//       },
//       { name: "Activity Logs", href: "/core/activity-logs", icon: FileText },
//     ],
//   },

//   // ================= ACCOUNTS =================
//   {
//     group: "Accounts",
//     icon: Users,
//     items: [
//       { name: "Users", href: "/accounts/users", icon: Users },
//       { name: "Roles", href: "/accounts/roles", icon: Shield },
//       {
//         name: "User Role Assignments",
//         href: "/accounts/user-roles",
//         icon: Shield,
//       },
//       { name: "Departments", href: "/accounts/departments", icon: Building2 },
//       { name: "User Profiles", href: "/accounts/user-profiles", icon: Users },
//     ],
//   },

//   // ================= ACADEMIC MANAGEMENT =================
//   {
//     group: "Academic Management",
//     icon: School,
//     items: [
//       { name: "Class Teachers", href: "/academic/class-teachers", icon: Users },
//       { name: "Class Times", href: "/academic/class-times", icon: Calendar },
//       { name: "Classes", href: "/academic/classes", icon: School },
//       { name: "Classrooms", href: "/academic/classrooms", icon: Building2 },
//       { name: "Faculties", href: "/academic/faculties", icon: Users },
//       {
//         name: "Lab Schedules",
//         href: "/academic/lab-schedules",
//         icon: Calendar,
//       },
//       {
//         name: "Optional Subject Groups",
//         href: "/academic/optional-subjects",
//         icon: BookOpen,
//       },
//       { name: "Programs", href: "/academic/programs", icon: GraduationCap },
//       { name: "Sections", href: "/academic/sections", icon: School },
//       {
//         name: "Subject Assignments",
//         href: "/academic/subject-assignments",
//         icon: BookOpen,
//       },
//       { name: "Subjects", href: "/academic/subjects", icon: BookOpen },
//       { name: "Timetables", href: "/academic/timetables", icon: Calendar },
//     ],
//   },

//   // ================= STUDENTS =================
//   {
//     group: "Student Management",
//     icon: GraduationCap,
//     items: [
//       { name: "Students", href: "/students/list", icon: GraduationCap },
//       { name: "Guardians", href: "/students/guardians", icon: Users },
//       {
//         name: "Student Categories",
//         href: "/students/categories",
//         icon: ClipboardList,
//       },
//       { name: "Student Groups", href: "/students/groups", icon: Users },
//       {
//         name: "Student Documents",
//         href: "/students/documents",
//         icon: FileText,
//       },
//       {
//         name: "Student Addresses",
//         href: "/students/addresses",
//         icon: Building2,
//       },
//       {
//         name: "Student Medical Records",
//         href: "/students/medical-records",
//         icon: FileText,
//       },
//       {
//         name: "Student Promotions",
//         href: "/students/promotions",
//         icon: GraduationCap,
//       },
//       { name: "Certificates", href: "/students/certificates", icon: FileText },
//     ],
//   },

//   // ================= ATTENDANCE =================
//   {
//     group: "Attendance Management",
//     icon: ClipboardList,
//     items: [
//       {
//         name: "Student Attendance",
//         href: "/attendance/students",
//         icon: ClipboardList,
//       },
//       {
//         name: "Staff Attendance",
//         href: "/attendance/staff",
//         icon: ClipboardList,
//       },
//       {
//         name: "Subject Attendance",
//         href: "/attendance/subjects",
//         icon: ClipboardList,
//       },
//       {
//         name: "Attendance Notifications",
//         href: "/attendance/notifications",
//         icon: Bell,
//       },
//     ],
//   },

//   // ================= EXAMINATIONS =================
//   {
//     group: "Examinations",
//     icon: PenTool,
//     items: [
//       { name: "Exams", href: "/exams/exams", icon: PenTool },
//       { name: "Exam Types", href: "/exams/types", icon: PenTool },
//       { name: "Exam Schedules", href: "/exams/schedules", icon: Calendar },
//       {
//         name: "Marks Registers",
//         href: "/exams/marks-registers",
//         icon: FileText,
//       },
//       { name: "Progress Cards", href: "/exams/progress-cards", icon: FileText },
//       {
//         name: "Tabulation Sheets",
//         href: "/exams/tabulation-sheets",
//         icon: FileText,
//       },
//     ],
//   },

//   // ================= FEES =================
//   {
//     group: "Fees",
//     icon: CreditCard,
//     items: [
//       { name: "Fee Masters", href: "/fees/masters", icon: CreditCard },
//       { name: "Fee Collections", href: "/fees/collections", icon: CreditCard },
//       { name: "Fee Discounts", href: "/fees/discounts", icon: CreditCard },
//       { name: "Fee Fines", href: "/fees/fines", icon: CreditCard },
//       { name: "Fee Structures", href: "/fees/structures", icon: CreditCard },
//     ],
//   },

//   // ================= LIBRARY =================
//   {
//     group: "Library Management",
//     icon: Library,
//     items: [
//       { name: "Books", href: "/library/books", icon: BookOpen },
//       { name: "Book Issues", href: "/library/issues", icon: ClipboardList },
//       { name: "Book Returns", href: "/library/returns", icon: ClipboardList },
//       { name: "Library Members", href: "/library/members", icon: Users },
//     ],
//   },

//   // ================= HR =================
//   {
//     group: "HR Management",
//     icon: Briefcase,
//     items: [
//       {
//         name: "Leave Applications",
//         href: "/hr/leave-applications",
//         icon: FileText,
//       },
//       { name: "Leave Approvals", href: "/hr/leave-approvals", icon: FileText },
//       { name: "Payrolls", href: "/hr/payrolls", icon: CreditCard },
//       {
//         name: "Salary Structures",
//         href: "/hr/salary-structures",
//         icon: CreditCard,
//       },
//     ],
//   },

//   // ================= REPORTS =================
//   {
//     group: "Reports",
//     icon: BarChart,
//     items: [
//       { name: "Generated Reports", href: "/reports/generated", icon: BarChart },
//       { name: "Report Templates", href: "/reports/templates", icon: FileText },
//       { name: "Saved Reports", href: "/reports/saved", icon: FileText },
//     ],
//   },

//   // ================= STORE =================
//   {
//     group: "Store Management",
//     icon: Store,
//     items: [
//       { name: "Store Items", href: "/store/items", icon: Store },
//       { name: "Vendors", href: "/store/vendors", icon: Users },
//       { name: "Stock Receives", href: "/store/receives", icon: ClipboardList },
//       { name: "Store Sales", href: "/store/sales", icon: CreditCard },
//     ],
//   },

//   // ================= COMMUNICATION =================
//   {
//     group: "Communication",
//     icon: MessageSquare,
//     items: [
//       { name: "Notices", href: "/communication/notices", icon: MessageSquare },
//       {
//         name: "Bulk Messages",
//         href: "/communication/bulk-messages",
//         icon: MessageSquare,
//       },
//       {
//         name: "Message Logs",
//         href: "/communication/message-logs",
//         icon: FileText,
//       },
//     ],
//   },
//   // ================= SYSTEM =================
//   {
//     group: "System",
//     icon: Settings,
//     items: [
//       { name: "Settings", href: "/settings", icon: Settings },
//       { name: "Debug", href: "/debug", icon: Bug },
//     ],
//   },
// ];

import {
  BarChart,
  Bell,
  BookOpen,
  Briefcase,
  Bug,
  Building2,
  Calendar,
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
  roles?: string[]; // NEW: Which roles can see this item
}

export interface SidebarGroup {
  group: string;
  icon: any;
  items: SidebarItem[];
  roles?: string[]; // NEW: Which roles can see this group
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
    roles: ["teacher", "student"],
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
      {
        name: "View Assignments",
        href: "/assignments/student",
        icon: FileText,
        roles: ["student"],
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
    roles: ["super_admin", "college_admin", "teacher", "student"],
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
      {
        name: "My Attendance", // NEW for students
        href: "/attendance/my-attendance",
        icon: ClipboardList,
        roles: ["student"],
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
        name: "Notices",
        href: "/communication/notices",
        icon: MessageSquare,
        roles: ["super_admin", "college_admin", "teacher", "student", "parent"], // All can view
      },
      {
        name: "Bulk Messages",
        href: "/communication/bulk-messages",
        icon: MessageSquare,
        roles: ["super_admin", "college_admin", "teacher"],
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
 * Filter sidebar groups and items based on user role
 */
export function getFilteredSidebarGroups(userType: string): SidebarGroup[] {
  return SIDEBAR_GROUPS.filter((group) => {
    // Filter groups by role
    if (!group.roles) return true; // No roles = visible to all
    return group.roles.includes(userType);
  })
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        // Filter items by role
        if (!item.roles) return true; // No roles = visible to all
        return item.roles.includes(userType);
      }),
    }))
    .filter((group) => group.items.length > 0); // Remove empty groups
}
