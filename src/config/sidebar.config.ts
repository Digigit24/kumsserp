import {
    BarChart,
    Bell,
    BookOpen,
    Briefcase,
    Bug,
    Building2,
    Calendar,
    CheckCircle2,
    ClipboardList,
    CreditCard,
    FileText,
    GraduationCap,
    HelpCircle,
    Home,
    Library,
    MessageSquare,
    PenTool,
    School,
    Settings,
    Shield,
    Store,
    Trophy,
    User,
    Users,
} from "lucide-react";

export interface SidebarItem {
  name: string;
  href: string;
  icon: any;
}

export interface SidebarGroup {
  group: string;
  icon: any;
  items: SidebarItem[];
}

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    group: "Dashboard",
    icon: Home,
    items: [{ name: "Dashboard", href: "/dashboard", icon: Home }],
  },

  // ================= STUDENT PORTAL =================
  {
    group: "Student Portal",
    icon: GraduationCap,
    items: [
      { name: "Student Dashboard", href: "/student/dashboard", icon: Home },
      { name: "My Profile", href: "/student/profile", icon: User },
    ],
  },

  // ================= ACADEMICS (STUDENT) =================
  {
    group: "Academics",
    icon: BookOpen,
    items: [
      { name: "Attendance", href: "/student/academics/attendance", icon: CheckCircle2 },
      { name: "Subjects", href: "/student/academics/subjects", icon: BookOpen },
      { name: "Assignments", href: "/student/academics/assignments", icon: FileText },
    ],
  },

  // ================= EXAMINATIONS (STUDENT) =================
  {
    group: "Examinations",
    icon: Trophy,
    items: [
      { name: "Exam Form", href: "/student/examinations/exam-form", icon: FileText },
      { name: "Results", href: "/student/examinations/results", icon: Trophy },
    ],
  },

  // ================= STUDENT SERVICES =================
  {
    group: "Student Services",
    icon: FileText,
    items: [
      { name: "Fees", href: "/student/fees", icon: CreditCard },
      { name: "Certificates / Requests", href: "/student/certificates", icon: FileText },
      { name: "Notices", href: "/student/notices", icon: Bell },
      { name: "Support / Helpdesk", href: "/student/support", icon: HelpCircle },
    ],
  },

  // ================= CORE =================
  {
    group: "Core",
    icon: Settings,
    items: [
      { name: "Colleges", href: "/core/colleges", icon: Building2 },
      { name: "Academic Years", href: "/core/academic-years", icon: Calendar },
      {
        name: "Academic Sessions",
        href: "/core/academic-sessions",
        icon: GraduationCap,
      },
      { name: "Holidays", href: "/core/holidays", icon: Calendar },
      { name: "Weekends", href: "/core/weekends", icon: Calendar },
      {
        name: "Notification Settings",
        href: "/core/notification-settings",
        icon: Bell,
      },
      {
        name: "System Settings",
        href: "/core/system-settings",
        icon: Settings,
      },
      { name: "Activity Logs", href: "/core/activity-logs", icon: FileText },
    ],
  },

  // ================= ACCOUNTS =================
  {
    group: "Accounts",
    icon: Users,
    items: [
      { name: "Users", href: "/accounts/users", icon: Users },
      { name: "Roles", href: "/accounts/roles", icon: Shield },
      {
        name: "User Role Assignments",
        href: "/accounts/user-roles",
        icon: Shield,
      },
      { name: "Departments", href: "/accounts/departments", icon: Building2 },
      { name: "User Profiles", href: "/accounts/user-profiles", icon: Users },
    ],
  },

  // ================= ACADEMIC MANAGEMENT =================
  {
    group: "Academic Management",
    icon: School,
    items: [
      { name: "Class Teachers", href: "/academic/class-teachers", icon: Users },
      { name: "Class Times", href: "/academic/class-times", icon: Calendar },
      { name: "Classes", href: "/academic/classes", icon: School },
      { name: "Classrooms", href: "/academic/classrooms", icon: Building2 },
      { name: "Faculties", href: "/academic/faculties", icon: Users },
      {
        name: "Lab Schedules",
        href: "/academic/lab-schedules",
        icon: Calendar,
      },
      {
        name: "Optional Subject Groups",
        href: "/academic/optional-subjects",
        icon: BookOpen,
      },
      { name: "Programs", href: "/academic/programs", icon: GraduationCap },
      { name: "Sections", href: "/academic/sections", icon: School },
      {
        name: "Subject Assignments",
        href: "/academic/subject-assignments",
        icon: BookOpen,
      },
      { name: "Subjects", href: "/academic/subjects", icon: BookOpen },
      { name: "Timetables", href: "/academic/timetables", icon: Calendar },
    ],
  },

  // ================= STUDENTS =================
  {
    group: "Student Management",
    icon: GraduationCap,
    items: [
      { name: "Students", href: "/students/list", icon: GraduationCap },
      { name: "Guardians", href: "/students/guardians", icon: Users },
      {
        name: "Student Categories",
        href: "/students/categories",
        icon: ClipboardList,
      },
      { name: "Student Groups", href: "/students/groups", icon: Users },
      {
        name: "Student Documents",
        href: "/students/documents",
        icon: FileText,
      },
      {
        name: "Student Addresses",
        href: "/students/addresses",
        icon: Building2,
      },
      {
        name: "Student Medical Records",
        href: "/students/medical-records",
        icon: FileText,
      },
      {
        name: "Student Promotions",
        href: "/students/promotions",
        icon: GraduationCap,
      },
      { name: "Certificates", href: "/students/certificates", icon: FileText },
    ],
  },

  // ================= ATTENDANCE =================
  {
    group: "Attendance Management",
    icon: ClipboardList,
    items: [
      {
        name: "Student Attendance",
        href: "/attendance/students",
        icon: ClipboardList,
      },
      {
        name: "Staff Attendance",
        href: "/attendance/staff",
        icon: ClipboardList,
      },
      {
        name: "Subject Attendance",
        href: "/attendance/subjects",
        icon: ClipboardList,
      },
      {
        name: "Attendance Notifications",
        href: "/attendance/notifications",
        icon: Bell,
      },
    ],
  },

  // ================= EXAMINATIONS =================
  {
    group: "Examinations",
    icon: PenTool,
    items: [
      { name: "Exams", href: "/exams/exams", icon: PenTool },
      { name: "Exam Types", href: "/exams/types", icon: PenTool },
      { name: "Exam Schedules", href: "/exams/schedules", icon: Calendar },
      {
        name: "Marks Registers",
        href: "/exams/marks-registers",
        icon: FileText,
      },
      { name: "Progress Cards", href: "/exams/progress-cards", icon: FileText },
      {
        name: "Tabulation Sheets",
        href: "/exams/tabulation-sheets",
        icon: FileText,
      },
    ],
  },

  // ================= FEES =================
  {
    group: "Fees",
    icon: CreditCard,
    items: [
      { name: "Fee Masters", href: "/fees/masters", icon: CreditCard },
      { name: "Fee Collections", href: "/fees/collections", icon: CreditCard },
      { name: "Fee Discounts", href: "/fees/discounts", icon: CreditCard },
      { name: "Fee Fines", href: "/fees/fines", icon: CreditCard },
      { name: "Fee Structures", href: "/fees/structures", icon: CreditCard },
    ],
  },

  // ================= LIBRARY =================
  {
    group: "Library Management",
    icon: Library,
    items: [
      { name: "Books", href: "/library/books", icon: BookOpen },
      { name: "Book Issues", href: "/library/issues", icon: ClipboardList },
      { name: "Book Returns", href: "/library/returns", icon: ClipboardList },
      { name: "Library Members", href: "/library/members", icon: Users },
    ],
  },

  // ================= HR =================
  {
    group: "HR Management",
    icon: Briefcase,
    items: [
      {
        name: "Leave Applications",
        href: "/hr/leave-applications",
        icon: FileText,
      },
      { name: "Leave Approvals", href: "/hr/leave-approvals", icon: FileText },
      { name: "Payrolls", href: "/hr/payrolls", icon: CreditCard },
      {
        name: "Salary Structures",
        href: "/hr/salary-structures",
        icon: CreditCard,
      },
    ],
  },

  // ================= REPORTS =================
  {
    group: "Reports",
    icon: BarChart,
    items: [
      { name: "Generated Reports", href: "/reports/generated", icon: BarChart },
      { name: "Report Templates", href: "/reports/templates", icon: FileText },
      { name: "Saved Reports", href: "/reports/saved", icon: FileText },
    ],
  },

  // ================= STORE =================
  {
    group: "Store Management",
    icon: Store,
    items: [
      { name: "Store Items", href: "/store/items", icon: Store },
      { name: "Vendors", href: "/store/vendors", icon: Users },
      { name: "Stock Receives", href: "/store/receives", icon: ClipboardList },
      { name: "Store Sales", href: "/store/sales", icon: CreditCard },
    ],
  },

  // ================= COMMUNICATION =================
  {
    group: "Communication",
    icon: MessageSquare,
    items: [
      { name: "Notices", href: "/communication/notices", icon: MessageSquare },
      {
        name: "Bulk Messages",
        href: "/communication/bulk-messages",
        icon: MessageSquare,
      },
      {
        name: "Message Logs",
        href: "/communication/message-logs",
        icon: FileText,
      },
    ],
  },
  // ================= SYSTEM =================
  {
    group: "System",
    icon: Settings,
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
      { name: "Debug", href: "/debug", icon: Bug },
    ],
  },
];
