import { ComponentType, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageLoader } from "../components/common/LoadingComponents";

// Layouts & Guards
import { MainLayout } from "../components/layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../pages/Login";

// ============================================================================
// LAZY LOADING HELPER
// ============================================================================

/**
 * Wrapper component for lazy-loaded routes with Suspense
 */
const LazyRoute = ({ component: Component }: { component: ComponentType }) => (
    <Suspense fallback={<PageLoader />}>
        <Component />
    </Suspense>
);

// ============================================================================
// LAZY LOADED PAGES
// ============================================================================

// Core Pages
const Dashboard = lazy(() => import("../pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Settings = lazy(() => import("../pages/Settings"));
const DebugPage = lazy(() => import("../pages/debug/DebugPage").then(m => ({ default: m.DebugPage })));

// Core Module
const PermissionsPage = lazy(() => import("../pages/core/PermissionsPage"));
const CollegesPage = lazy(() => import("../pages/core/CollegesPage"));
const AcademicYearsPage = lazy(() => import("../pages/core/AcademicYearsPage"));
const AcademicSessionsPage = lazy(() => import("../pages/core/AcademicSessionsPage"));
const HolidaysPage = lazy(() => import("../pages/core/HolidaysPage"));
const WeekendsPage = lazy(() => import("../pages/core/WeekendsPage"));
const SystemSettingsPage = lazy(() => import("../pages/core/SystemSettingsPage"));
const NotificationSettingsPage = lazy(() => import("../pages/core/NotificationSettingsPage"));
const ActivityLogsPage = lazy(() => import("../pages/core/ActivityLogsPage"));

// Accounts Module
const UsersPage = lazy(() => import("../pages/accounts/UsersPage"));
const RolesPage = lazy(() => import("../pages/accounts/RolesPage"));
const UserRolesPage = lazy(() => import("../pages/accounts/UserRolesPage"));
const DepartmentsPage = lazy(() => import("../pages/accounts/DepartmentsPage"));
const UserProfilesPage = lazy(() => import("../pages/accounts/UserProfilesPage"));
const RoleHierarchyPage = lazy(() => import("../pages/accounts/RoleHierarchyPage").then(m => ({ default: m.RoleHierarchyPage })));

// Academic Module
const FacultiesPage = lazy(() => import("../pages/academic").then(m => ({ default: m.FacultiesPage })));
const ProgramsPage = lazy(() => import("../pages/academic").then(m => ({ default: m.ProgramsPage })));
const ClassesPage = lazy(() => import("../pages/academic").then(m => ({ default: m.ClassesPage })));
const SectionsPage = lazy(() => import("../pages/academic").then(m => ({ default: m.SectionsPage })));
const SubjectsPage = lazy(() => import("../pages/academic").then(m => ({ default: m.SubjectsPage })));
const OptionalSubjectsPage = lazy(() => import("../pages/academic").then(m => ({ default: m.OptionalSubjectsPage })));
const SubjectAssignmentsPage = lazy(() => import("../pages/academic").then(m => ({ default: m.SubjectAssignmentsPage })));
const ClassroomsPage = lazy(() => import("../pages/academic").then(m => ({ default: m.ClassroomsPage })));
const ClassTimesPage = lazy(() => import("../pages/academic").then(m => ({ default: m.ClassTimesPage })));
const TimetablesPage = lazy(() => import("../pages/academic").then(m => ({ default: m.TimetablesPage })));
const LabSchedulesPage = lazy(() => import("../pages/academic").then(m => ({ default: m.LabSchedulesPage })));
const ClassTeachersPage = lazy(() => import("../pages/academic").then(m => ({ default: m.ClassTeachersPage })));

// Students Module
const StudentsPage = lazy(() => import("../pages/students").then(m => ({ default: m.StudentsPage })));
const StudentDetailPage = lazy(() => import("../pages/students/StudentDetailPage").then(m => ({ default: m.StudentDetailPage })));
const StudentCategoriesPage = lazy(() => import("../pages/students").then(m => ({ default: m.StudentCategoriesPage })));
const StudentGroupsPage = lazy(() => import("../pages/students").then(m => ({ default: m.StudentGroupsPage })));
const GuardiansPage = lazy(() => import("../pages/students").then(m => ({ default: m.GuardiansPage })));
const StudentAddressesPage = lazy(() => import("../pages/students").then(m => ({ default: m.StudentAddressesPage })));
const StudentDocumentsPage = lazy(() => import("../pages/students").then(m => ({ default: m.StudentDocumentsPage })));
const MedicalRecordsPage = lazy(() => import("../pages/students").then(m => ({ default: m.MedicalRecordsPage })));
const PreviousAcademicRecordsPage = lazy(() => import("../pages/students").then(m => ({ default: m.PreviousAcademicRecordsPage })));
const StudentPromotionsPage = lazy(() => import("../pages/students").then(m => ({ default: m.StudentPromotionsPage })));
const CertificatesPage = lazy(() => import("../pages/students").then(m => ({ default: m.CertificatesPage })));
const StudentIDCardsPage = lazy(() => import("../pages/students").then(m => ({ default: m.StudentIDCardsPage })));

// Student Portal (removed StudentDashboard - using unified /dashboard instead)
const MyProfile = lazy(() => import("../pages/student").then(m => ({ default: m.MyProfile })));
const Attendance = lazy(() => import("../pages/student").then(m => ({ default: m.Attendance })));
const Subjects = lazy(() => import("../pages/student").then(m => ({ default: m.Subjects })));
const Assignments = lazy(() => import("../pages/student").then(m => ({ default: m.Assignments })));
const Timetable = lazy(() => import("../pages/student").then(m => ({ default: m.Timetable })));
const ExamForm = lazy(() => import("../pages/student").then(m => ({ default: m.ExamForm })));
const Results = lazy(() => import("../pages/student").then(m => ({ default: m.Results })));
const Fees = lazy(() => import("../pages/student").then(m => ({ default: m.Fees })));
const StudentCertificates = lazy(() => import("../pages/student").then(m => ({ default: m.Certificates })));
const Notices = lazy(() => import("../pages/student").then(m => ({ default: m.Notices })));
const Support = lazy(() => import("../pages/student").then(m => ({ default: m.Support })));

// Teacher Portal
const TeacherAttendancePage = lazy(() => import("../pages/teacher").then(m => ({ default: m.TeacherAttendancePage })));
const TeacherStudentsPage = lazy(() => import("../pages/teacher").then(m => ({ default: m.TeacherStudentsPage })));
const TeacherSubjectsPage = lazy(() => import("../pages/teacher").then(m => ({ default: m.TeacherSubjectsPage })));

// Assignments
const CreateAssignmentPage = lazy(() => import("../pages/assignments").then(m => ({ default: m.CreateAssignmentPage })));
const AssignmentsListPage = lazy(() => import("../pages/assignments").then(m => ({ default: m.AssignmentsListPage })));
const SubmissionsPage = lazy(() => import("../pages/assignments").then(m => ({ default: m.SubmissionsPage })));

// Approvals Module
const PendingApprovalsPage = lazy(() => import("../pages/approvals/PendingApprovalsPage"));
const MyRequestsPage = lazy(() => import("../pages/approvals/MyRequestsPage"));
const ApprovalDetailPage = lazy(() => import("../pages/approvals/ApprovalDetailPage"));

// Examinations Module
const ExamsPage = lazy(() => import("../pages/exams/ExamsPage"));
const ExamTypesPage = lazy(() => import("../pages/exams/ExamTypesPage"));
const ExamSchedulesPage = lazy(() => import("../pages/exams/ExamSchedulesPage"));
const MarksEntryPage = lazy(() => import("../pages/exams/MarksEntryPage"));
const GradeSheetsPage = lazy(() => import("../pages/exams/GradeSheetsPage"));
const MarksRegistersPage = lazy(() => import("../pages/exams/MarksRegistersPage"));
const ProgressCardsPage = lazy(() => import("../pages/exams/ProgressCardsPage"));
const TabulationSheetsPage = lazy(() => import("../pages/exams/TabulationSheetsPage"));
const CreateTestPage = lazy(() => import("../pages/exams/CreateTestPage"));
const MarkingPage = lazy(() => import("../pages/exams/MarkingPage"));
const MarkingRegisterPage = lazy(() => import("../pages/exams/MarkingRegisterPage"));

// Attendance Module
const StudentAttendancePage = lazy(() => import("../pages/attendance/StudentAttendancePage"));
const StaffAttendancePage = lazy(() => import("../pages/attendance/StaffAttendancePage"));
const SubjectAttendancePage = lazy(() => import("../pages/attendance/SubjectAttendancePage"));
const AttendanceNotificationsPage = lazy(() => import("../pages/attendance/AttendanceNotificationsPage"));
const AttendanceMarkingPage = lazy(() => import("../pages/attendance/AttendanceMarkingPage"));
const TeacherAttendanceMarkingPage = lazy(() => import("../pages/attendance/TeacherAttendanceMarkingPage").then(m => ({ default: m.TeacherAttendanceMarkingPage })));
const MyAttendancePage = lazy(() => import("../pages/attendance/MyAttendancePage"));

// Fees Module
const FeeTypesPage = lazy(() => import("../pages/fees/FeeTypesPage"));
const FeeGroupsPage = lazy(() => import("../pages/fees/FeeGroupsPage"));
const FeeMastersPage = lazy(() => import("../pages/fees/FeeMastersPage"));
const FeeStructuresPage = lazy(() => import("../pages/fees/FeeStructuresPage"));
const FeeInstallmentsPage = lazy(() => import("../pages/fees/FeeInstallmentsPage"));
const FeeCollectionsPage = lazy(() => import("../pages/fees/FeeCollectionsPage"));
const FeeDiscountsPage = lazy(() => import("../pages/fees/FeeDiscountsPage"));
const FeeFinesPage = lazy(() => import("../pages/fees/FeeFinesPage"));
const FeeReceiptsPage = lazy(() => import("../pages/fees/FeeReceiptsPage"));
const StudentFeeDiscountsPage = lazy(() => import("../pages/fees/StudentFeeDiscountsPage"));
const FeeRefundsPage = lazy(() => import("../pages/fees/FeeRefundsPage"));
const FeeRemindersPage = lazy(() => import("../pages/fees/FeeRemindersPage"));
const BankPaymentsPage = lazy(() => import("../pages/fees/BankPaymentsPage"));
const OnlinePaymentsPage = lazy(() => import("../pages/fees/OnlinePaymentsPage"));

// Library Module
const BooksPage = lazy(() => import("../pages/library/BooksPage"));
const BookCategoriesPage = lazy(() => import("../pages/library/BookCategoriesPage"));
const LibraryMembersPage = lazy(() => import("../pages/library/LibraryMembersPage"));
const BookIssuesPage = lazy(() => import("../pages/library/BookIssuesPage"));
const BookReturnsPage = lazy(() => import("../pages/library/BookReturnsPage"));
const MyBooksPage = lazy(() => import("../pages/library/MyBooksPage"));

// Hostel Module
const HostelsPage = lazy(() => import("../pages/hostel").then(m => ({ default: m.HostelsPage })));
const RoomTypesPage = lazy(() => import("../pages/hostel").then(m => ({ default: m.RoomTypesPage })));
const RoomsPage = lazy(() => import("../pages/hostel").then(m => ({ default: m.RoomsPage })));
const AllocationsPage = lazy(() => import("../pages/hostel").then(m => ({ default: m.AllocationsPage })));
const BedsPage = lazy(() => import("../pages/hostel").then(m => ({ default: m.BedsPage })));
const FeesPage = lazy(() => import("../pages/hostel").then(m => ({ default: m.FeesPage })));

// HR Module
const DeductionsPage = lazy(() => import("../pages/hr/DeductionsPage"));
const LeaveTypesPage = lazy(() => import("../pages/hr/LeaveTypesPage"));
const LeaveApplicationsPage = lazy(() => import("../pages/hr/LeaveApplicationsPage"));
const LeaveApprovalsPage = lazy(() => import("../pages/hr/LeaveApprovalsPage"));
const LeaveBalancesPage = lazy(() => import("../pages/hr/LeaveBalancesPage"));
const SalaryStructuresPage = lazy(() => import("../pages/hr/SalaryStructuresPage"));
const SalaryComponentsPage = lazy(() => import("../pages/hr/SalaryComponentsPage"));
const PayrollsPage = lazy(() => import("../pages/hr/PayrollsPage"));
const PayrollItemsPage = lazy(() => import("../pages/hr/PayrollItemsPage"));
const PayslipsPage = lazy(() => import("../pages/hr/PayslipsPage"));

// Reports Module
const ReportTemplatesPage = lazy(() => import("../pages/reports/ReportTemplatesPage"));
const GeneratedReportsPage = lazy(() => import("../pages/reports/GeneratedReportsPage"));
const SavedReportsPage = lazy(() => import("../pages/reports/SavedReportsPage"));

// Profile Module
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
const ProfileSettingsPage = lazy(() => import("../pages/profile/ProfileSettingsPage"));

// Communication Module
const CommunicationPage = lazy(() => import("../pages/communication/CommunicationPage"));
const StudentCommunicationPage = lazy(() => import("../pages/communication/StudentCommunicationPage"));
const TeacherCommunicationPage = lazy(() => import("../pages/communication/TeacherCommunicationPage"));
const BulkMessagesPage = lazy(() => import("../pages/communication").then(m => ({ default: m.BulkMessagesPage })));
const ChatsPage = lazy(() => import("../pages/communication").then(m => ({ default: m.ChatsPage })));
const ChatPage = lazy(() => import("../pages/ChatPage").then(m => ({ default: m.ChatPage })));
const EventsPage = lazy(() => import("../pages/communication").then(m => ({ default: m.EventsPage })));
const EventRegistrationsPage = lazy(() => import("../pages/communication").then(m => ({ default: m.EventRegistrationsPage })));
const MessageLogsPage = lazy(() => import("../pages/communication").then(m => ({ default: m.MessageLogsPage })));
const NoticesPage = lazy(() => import("../pages/communication").then(m => ({ default: m.NoticesPage })));
const NotificationRulesPage = lazy(() => import("../pages/communication").then(m => ({ default: m.NotificationRulesPage })));
const MessageTemplatesPage = lazy(() => import("../pages/communication").then(m => ({ default: m.MessageTemplatesPage })));
const NoticeVisibilityPage = lazy(() => import("../pages/communication").then(m => ({ default: m.NoticeVisibilityPage })));

// Store Module
const StoreItemsPage = lazy(() => import("../pages/store/StoreItemsPage"));
const CategoriesPage = lazy(() => import("../pages/store/CategoriesPage"));
const CreditsPage = lazy(() => import("../pages/store/CreditsPage"));
const SalesPage = lazy(() => import("../pages/store/SalesPage"));
const PrintRequestsPage = lazy(() => import("../pages/store/PrintRequestsPage"));
const SaleItemsPage = lazy(() => import("../pages/store/SaleItemsPage"));
const VendorsPage = lazy(() => import("../pages/store/VendorsPage"));
const StockReceiptsPage = lazy(() => import("../pages/store/StockReceiptsPage"));
const CollegeStoresPage = lazy(() => import("../pages/store/CollegeStoresPage").then(m => ({ default: m.CollegeStoresPage })));
const CentralStoresPage = lazy(() => import("../pages/store/CentralStoresPage").then(m => ({ default: m.CentralStoresPage })));
const CentralInventoryPage = lazy(() => import("../pages/store/CentralInventoryPage").then(m => ({ default: m.CentralInventoryPage })));
const MaterialIssuesPage = lazy(() => import("../pages/store/MaterialIssuesPage").then(m => ({ default: m.MaterialIssuesPage })));
const StoreIndentsPage = lazy(() => import("../pages/store/StoreIndentsPage").then(m => ({ default: m.StoreIndentsPage })));
const CollegeAdminApprovalsPage = lazy(() => import("../pages/store/CollegeAdminApprovalsPage").then(m => ({ default: m.CollegeAdminApprovalsPage })));
const SuperAdminApprovalsPage = lazy(() => import("../pages/store/SuperAdminApprovalsPage").then(m => ({ default: m.SuperAdminApprovalsPage })));
const MaterialIssuancePage = lazy(() => import("../pages/store/MaterialIssuancePage").then(m => ({ default: m.MaterialIssuancePage })));

// New Workflow-First Store Pages
const IndentsPipelinePage = lazy(() => import("../pages/store/IndentsPipelinePage").then(m => ({ default: m.IndentsPipelinePage })));
const TransfersWorkflowPage = lazy(() => import("../pages/store/TransfersWorkflowPage").then(m => ({ default: m.TransfersWorkflowPage })));
const UnifiedApprovalsPage = lazy(() => import("../pages/store/UnifiedApprovalsPage").then(m => ({ default: m.UnifiedApprovalsPage })));
const InventoryPage = lazy(() => import("../pages/store/InventoryPage").then(m => ({ default: m.InventoryPage })));
const StoreHierarchyPage = lazy(() => import("../pages/store/StoreHierarchyPage").then(m => ({ default: m.StoreHierarchyPage })));

// Procurement Module
const RequirementsPage = lazy(() => import("../pages/store/procurement/RequirementsPage").then(m => ({ default: m.RequirementsPage })));
const QuotationsPage = lazy(() => import("../pages/store/procurement/QuotationsPage").then(m => ({ default: m.QuotationsPage })));
const PurchaseOrdersPage = lazy(() => import("../pages/store/procurement/PurchaseOrdersPage").then(m => ({ default: m.PurchaseOrdersPage })));
const GoodsReceiptsPage = lazy(() => import("../pages/store/procurement/GoodsReceiptsPage").then(m => ({ default: m.GoodsReceiptsPage })));
const InspectionsPage = lazy(() => import("../pages/store/procurement/InspectionsPage").then(m => ({ default: m.InspectionsPage })));
const ProcurementPipelinePage = lazy(() => import("../pages/store/procurement/ProcurementPipelinePage").then(m => ({ default: m.ProcurementPipelinePage })));

// Library Student Module
const StudentLibraryPage = lazy(() => import("../pages/library/StudentLibraryPage"));

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />

                    {/* Core */}
                    <Route path="dashboard" element={<LazyRoute component={Dashboard} />} />
                    <Route path="settings" element={<LazyRoute component={Settings} />} />
                    <Route path="debug" element={<LazyRoute component={DebugPage} />} />

                    {/* System Module */}
                    <Route path="system/permissions" element={<LazyRoute component={PermissionsPage} />} />

                    {/* Core Module */}
                    <Route path="core/colleges" element={<LazyRoute component={CollegesPage} />} />
                    <Route path="core/academic-years" element={<LazyRoute component={AcademicYearsPage} />} />
                    <Route path="core/academic-sessions" element={<LazyRoute component={AcademicSessionsPage} />} />
                    <Route path="core/holidays" element={<LazyRoute component={HolidaysPage} />} />
                    <Route path="core/weekends" element={<LazyRoute component={WeekendsPage} />} />
                    <Route path="core/system-settings" element={<LazyRoute component={SystemSettingsPage} />} />
                    <Route path="core/notification-settings" element={<LazyRoute component={NotificationSettingsPage} />} />
                    <Route path="core/activity-logs" element={<LazyRoute component={ActivityLogsPage} />} />
                    <Route path="core/permissions" element={<LazyRoute component={PermissionsPage} />} />

                    {/* Accounts Module */}
                    <Route path="accounts/users" element={<LazyRoute component={UsersPage} />} />
                    <Route path="accounts/roles" element={<LazyRoute component={RolesPage} />} />
                    <Route path="accounts/user-roles" element={<LazyRoute component={UserRolesPage} />} />
                    <Route path="accounts/departments" element={<LazyRoute component={DepartmentsPage} />} />
                    <Route path="accounts/user-profiles" element={<LazyRoute component={UserProfilesPage} />} />
                    <Route path="accounts/hierarchy" element={<LazyRoute component={RoleHierarchyPage} />} />

                    {/* Students Module */}
                    <Route path="students/list" element={<LazyRoute component={StudentsPage} />} />
                    <Route path="students/:id" element={<LazyRoute component={StudentDetailPage} />} />
                    <Route path="students/categories" element={<LazyRoute component={StudentCategoriesPage} />} />
                    <Route path="students/groups" element={<LazyRoute component={StudentGroupsPage} />} />
                    <Route path="students/guardians" element={<LazyRoute component={GuardiansPage} />} />
                    <Route path="students/addresses" element={<LazyRoute component={StudentAddressesPage} />} />
                    <Route path="students/documents" element={<LazyRoute component={StudentDocumentsPage} />} />
                    <Route path="students/medical-records" element={<LazyRoute component={MedicalRecordsPage} />} />
                    <Route path="students/previous-records" element={<LazyRoute component={PreviousAcademicRecordsPage} />} />
                    <Route path="students/promotions" element={<LazyRoute component={StudentPromotionsPage} />} />
                    <Route path="students/certificates" element={<LazyRoute component={CertificatesPage} />} />
                    <Route path="students/id-cards" element={<LazyRoute component={StudentIDCardsPage} />} />

                    {/* Academic Module */}
                    <Route path="academic/faculties" element={<LazyRoute component={FacultiesPage} />} />
                    <Route path="academic/programs" element={<LazyRoute component={ProgramsPage} />} />
                    <Route path="academic/classes" element={<LazyRoute component={ClassesPage} />} />
                    <Route path="academic/sections" element={<LazyRoute component={SectionsPage} />} />
                    <Route path="academic/subjects" element={<LazyRoute component={SubjectsPage} />} />
                    <Route path="academic/optional-subjects" element={<LazyRoute component={OptionalSubjectsPage} />} />
                    <Route path="academic/subject-assignments" element={<LazyRoute component={SubjectAssignmentsPage} />} />
                    <Route path="academic/classrooms" element={<LazyRoute component={ClassroomsPage} />} />
                    <Route path="academic/class-times" element={<LazyRoute component={ClassTimesPage} />} />
                    <Route path="academic/timetables" element={<LazyRoute component={TimetablesPage} />} />
                    <Route path="academic/lab-schedules" element={<LazyRoute component={LabSchedulesPage} />} />
                    <Route path="academic/class-teachers" element={<LazyRoute component={ClassTeachersPage} />} />

                    {/* Student Portal */}
                    <Route path="student/profile" element={<LazyRoute component={MyProfile} />} />
                    <Route path="student/academics/attendance" element={<LazyRoute component={Attendance} />} />
                    <Route path="student/academics/subjects" element={<LazyRoute component={Subjects} />} />
                    <Route path="student/academics/assignments" element={<LazyRoute component={Assignments} />} />
                    <Route path="student/academics/timetable" element={<LazyRoute component={Timetable} />} />
                    <Route path="student/examinations/exam-form" element={<LazyRoute component={ExamForm} />} />
                    <Route path="student/examinations/results" element={<LazyRoute component={Results} />} />
                    <Route path="student/fees" element={<LazyRoute component={Fees} />} />
                    <Route path="student/certificates" element={<LazyRoute component={StudentCertificates} />} />
                    <Route path="student/notices" element={<LazyRoute component={Notices} />} />
                    <Route path="student/support" element={<LazyRoute component={Support} />} />

                    {/* Teacher Portal */}
                    <Route path="teacher/attendance" element={<LazyRoute component={TeacherAttendancePage} />} />
                    <Route path="teacher/students" element={<LazyRoute component={TeacherStudentsPage} />} />
                    <Route path="teacher/subjects" element={<LazyRoute component={TeacherSubjectsPage} />} />

                    {/* Assignments */}
                    <Route path="assignments/create" element={<LazyRoute component={CreateAssignmentPage} />} />
                    <Route path="assignments/list" element={<LazyRoute component={AssignmentsListPage} />} />
                    <Route path="assignments/submissions" element={<LazyRoute component={SubmissionsPage} />} />

                    {/* Approvals Module */}
                    <Route path="approvals/pending" element={<LazyRoute component={PendingApprovalsPage} />} />
                    <Route path="approvals/my-requests" element={<LazyRoute component={MyRequestsPage} />} />
                    <Route path="approvals/:id" element={<LazyRoute component={ApprovalDetailPage} />} />

                    {/* Examinations Module */}
                    <Route path="exams/exams" element={<LazyRoute component={ExamsPage} />} />
                    <Route path="exams/types" element={<LazyRoute component={ExamTypesPage} />} />
                    <Route path="exams/schedules" element={<LazyRoute component={ExamSchedulesPage} />} />
                    <Route path="exams/marks-entry" element={<LazyRoute component={MarksEntryPage} />} />
                    <Route path="exams/grade-sheets" element={<LazyRoute component={GradeSheetsPage} />} />
                    <Route path="exams/marks-registers" element={<LazyRoute component={MarksRegistersPage} />} />
                    <Route path="exams/progress-cards" element={<LazyRoute component={ProgressCardsPage} />} />
                    <Route path="exams/tabulation-sheets" element={<LazyRoute component={TabulationSheetsPage} />} />
                    <Route path="exams/create-test" element={<LazyRoute component={CreateTestPage} />} />
                    <Route path="exams/marking" element={<LazyRoute component={MarkingPage} />} />
                    <Route path="exams/marking/:questionPaperId" element={<LazyRoute component={MarkingRegisterPage} />} />

                    {/* Attendance Module */}
                    <Route path="attendance/students" element={<LazyRoute component={StudentAttendancePage} />} />
                    <Route path="attendance/staff" element={<LazyRoute component={StaffAttendancePage} />} />
                    <Route path="attendance/subjects" element={<LazyRoute component={SubjectAttendancePage} />} />
                    <Route path="attendance/notifications" element={<LazyRoute component={AttendanceNotificationsPage} />} />
                    <Route path="attendance/marking" element={<LazyRoute component={AttendanceMarkingPage} />} />
                    <Route path="attendance/teacher-marking" element={<LazyRoute component={TeacherAttendanceMarkingPage} />} />
                    <Route path="attendance/my-attendance" element={<LazyRoute component={MyAttendancePage} />} />

                    {/* Fees Module */}
                    <Route path="fees/types" element={<LazyRoute component={FeeTypesPage} />} />
                    <Route path="fees/masters" element={<LazyRoute component={FeeMastersPage} />} />
                    <Route path="fees/groups" element={<LazyRoute component={FeeGroupsPage} />} />
                    <Route path="fees/structures" element={<LazyRoute component={FeeStructuresPage} />} />
                    <Route path="fees/installments" element={<LazyRoute component={FeeInstallmentsPage} />} />
                    <Route path="fees/collections" element={<LazyRoute component={FeeCollectionsPage} />} />
                    <Route path="fees/discounts" element={<LazyRoute component={FeeDiscountsPage} />} />
                    <Route path="fees/fines" element={<LazyRoute component={FeeFinesPage} />} />
                    <Route path="fees/receipts" element={<LazyRoute component={FeeReceiptsPage} />} />
                    <Route path="fees/student-fee-discounts" element={<LazyRoute component={StudentFeeDiscountsPage} />} />
                    <Route path="fees/refunds" element={<LazyRoute component={FeeRefundsPage} />} />
                    <Route path="fees/reminders" element={<LazyRoute component={FeeRemindersPage} />} />
                    <Route path="fees/bank-payments" element={<LazyRoute component={BankPaymentsPage} />} />
                    <Route path="fees/online-payments" element={<LazyRoute component={OnlinePaymentsPage} />} />
                    <Route path="fees/my-fees" element={<LazyRoute component={Fees} />} />

                    {/* Library Module */}
                    <Route path="library/books" element={<LazyRoute component={BooksPage} />} />
                    <Route path="library/categories" element={<LazyRoute component={BookCategoriesPage} />} />
                    <Route path="library/members" element={<LazyRoute component={LibraryMembersPage} />} />
                    <Route path="library/issues" element={<LazyRoute component={BookIssuesPage} />} />
                    <Route path="library/returns" element={<LazyRoute component={BookReturnsPage} />} />
                    <Route path="library/my-books" element={<LazyRoute component={MyBooksPage} />} />
                    <Route path="library/student" element={<LazyRoute component={StudentLibraryPage} />} />

                    {/* Hostel Module */}
                    <Route path="hostel/hostels" element={<LazyRoute component={HostelsPage} />} />
                    <Route path="hostel/room-types" element={<LazyRoute component={RoomTypesPage} />} />
                    <Route path="hostel/rooms" element={<LazyRoute component={RoomsPage} />} />
                    <Route path="hostel/allocations" element={<LazyRoute component={AllocationsPage} />} />
                    <Route path="hostel/beds" element={<LazyRoute component={BedsPage} />} />
                    <Route path="hostel/fees" element={<LazyRoute component={FeesPage} />} />

                    {/* HR Module */}
                    <Route path="hr/deductions" element={<LazyRoute component={DeductionsPage} />} />
                    <Route path="hr/leave-types" element={<LazyRoute component={LeaveTypesPage} />} />
                    <Route path="hr/leave-applications" element={<LazyRoute component={LeaveApplicationsPage} />} />
                    <Route path="hr/leave-approvals" element={<LazyRoute component={LeaveApprovalsPage} />} />
                    <Route path="hr/leave-balances" element={<LazyRoute component={LeaveBalancesPage} />} />
                    <Route path="hr/salary-structures" element={<LazyRoute component={SalaryStructuresPage} />} />
                    <Route path="hr/salary-components" element={<LazyRoute component={SalaryComponentsPage} />} />
                    <Route path="hr/payrolls" element={<LazyRoute component={PayrollsPage} />} />
                    <Route path="hr/payroll-items" element={<LazyRoute component={PayrollItemsPage} />} />
                    <Route path="hr/payslips" element={<LazyRoute component={PayslipsPage} />} />

                    {/* Reports Module */}
                    <Route path="reports/templates" element={<LazyRoute component={ReportTemplatesPage} />} />
                    <Route path="reports/generated" element={<LazyRoute component={GeneratedReportsPage} />} />
                    <Route path="reports/saved" element={<LazyRoute component={SavedReportsPage} />} />

                    {/* Profile Module */}
                    <Route path="profile" element={<LazyRoute component={ProfilePage} />} />
                    <Route path="profile/settings" element={<LazyRoute component={ProfileSettingsPage} />} />

                    {/* Communication Module */}
                    <Route path="communication/bulk-messages" element={<LazyRoute component={BulkMessagesPage} />} />
                    <Route path="communication/chats" element={<LazyRoute component={ChatsPage} />} />
                    <Route path="communication/chat-sse" element={<LazyRoute component={ChatPage} />} />
                    <Route path="communication/events" element={<LazyRoute component={EventsPage} />} />
                    <Route path="communication/event-registrations" element={<LazyRoute component={EventRegistrationsPage} />} />
                    <Route path="communication/message-logs" element={<LazyRoute component={MessageLogsPage} />} />
                    <Route path="communication/notices" element={<LazyRoute component={NoticesPage} />} />
                    <Route path="communication/notification-rules" element={<LazyRoute component={NotificationRulesPage} />} />
                    <Route path="communication/message-templates" element={<LazyRoute component={MessageTemplatesPage} />} />
                    <Route path="communication/notice-visibility" element={<LazyRoute component={NoticeVisibilityPage} />} />

                    {/* Store Module - Workflow-First Pages */}
                    <Route path="store/indents-pipeline" element={<LazyRoute component={IndentsPipelinePage} />} />
                    <Route path="store/transfers-workflow" element={<LazyRoute component={TransfersWorkflowPage} />} />
                    <Route path="store/approvals" element={<LazyRoute component={UnifiedApprovalsPage} />} />
                    <Route path="store/inventory" element={<LazyRoute component={InventoryPage} />} />
                    <Route path="store/procurement-pipeline" element={<LazyRoute component={ProcurementPipelinePage} />} />

                    {/* Store Module - Legacy/Admin Pages */}
                    <Route path="store/hierarchy" element={<LazyRoute component={StoreHierarchyPage} />} />
                    <Route path="store/college-stores" element={<LazyRoute component={CollegeStoresPage} />} />
                    <Route path="store/central-stores" element={<LazyRoute component={CentralStoresPage} />} />
                    <Route path="store/central-inventory" element={<LazyRoute component={CentralInventoryPage} />} />
                    <Route path="store/material-issues" element={<LazyRoute component={MaterialIssuesPage} />} />
                    <Route path="store/indents" element={<LazyRoute component={StoreIndentsPage} />} />
                    <Route path="store/college-approvals" element={<LazyRoute component={CollegeAdminApprovalsPage} />} />
                    <Route path="store/super-admin-approvals" element={<LazyRoute component={SuperAdminApprovalsPage} />} />
                    <Route path="store/material-issuance" element={<LazyRoute component={MaterialIssuancePage} />} />
                    <Route path="store/items" element={<LazyRoute component={StoreItemsPage} />} />
                    <Route path="store/categories" element={<LazyRoute component={CategoriesPage} />} />
                    <Route path="store/credits" element={<LazyRoute component={CreditsPage} />} />

                    {/* Procurement Module */}
                    <Route path="procurement/requirements" element={<LazyRoute component={RequirementsPage} />} />
                    <Route path="procurement/quotations" element={<LazyRoute component={QuotationsPage} />} />
                    <Route path="procurement/purchase-orders" element={<LazyRoute component={PurchaseOrdersPage} />} />
                    <Route path="procurement/goods-receipts" element={<LazyRoute component={GoodsReceiptsPage} />} />
                    <Route path="procurement/inspections" element={<LazyRoute component={InspectionsPage} />} />
                    <Route path="store/sales" element={<LazyRoute component={SalesPage} />} />
                    <Route path="store/sale-items" element={<LazyRoute component={SaleItemsPage} />} />
                    <Route path="store/print-requests" element={<LazyRoute component={PrintRequestsPage} />} />
                    <Route path="store/vendors" element={<LazyRoute component={VendorsPage} />} />
                    <Route path="store/stock-receipts" element={<LazyRoute component={StockReceiptsPage} />} />

                    {/* Demo Routes */}
                    <Route path="demo/tetris" element={<LazyRoute component={lazy(() => import("../pages/demo/TetrisDemoPage"))} />} />
                </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}