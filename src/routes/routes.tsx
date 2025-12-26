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

// Student Portal
const StudentDashboard = lazy(() => import("../pages/student").then(m => ({ default: m.StudentDashboard })));
const MyProfile = lazy(() => import("../pages/student").then(m => ({ default: m.MyProfile })));
const Attendance = lazy(() => import("../pages/student").then(m => ({ default: m.Attendance })));
const Subjects = lazy(() => import("../pages/student").then(m => ({ default: m.Subjects })));
const Assignments = lazy(() => import("../pages/student").then(m => ({ default: m.Assignments })));
const ExamForm = lazy(() => import("../pages/student").then(m => ({ default: m.ExamForm })));
const Results = lazy(() => import("../pages/student").then(m => ({ default: m.Results })));
const Fees = lazy(() => import("../pages/student").then(m => ({ default: m.Fees })));
const StudentCertificates = lazy(() => import("../pages/student").then(m => ({ default: m.Certificates })));
const Notices = lazy(() => import("../pages/student").then(m => ({ default: m.Notices })));
const Support = lazy(() => import("../pages/student").then(m => ({ default: m.Support })));

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

                    {/* Core Module */}
                    <Route path="core/colleges" element={<LazyRoute component={CollegesPage} />} />
                    <Route path="core/academic-years" element={<LazyRoute component={AcademicYearsPage} />} />
                    <Route path="core/academic-sessions" element={<LazyRoute component={AcademicSessionsPage} />} />
                    <Route path="core/holidays" element={<LazyRoute component={HolidaysPage} />} />
                    <Route path="core/weekends" element={<LazyRoute component={WeekendsPage} />} />
                    <Route path="core/system-settings" element={<LazyRoute component={SystemSettingsPage} />} />
                    <Route path="core/notification-settings" element={<LazyRoute component={NotificationSettingsPage} />} />
                    <Route path="core/activity-logs" element={<LazyRoute component={ActivityLogsPage} />} />

                    {/* Accounts Module */}
                    <Route path="accounts/users" element={<LazyRoute component={UsersPage} />} />
                    <Route path="accounts/roles" element={<LazyRoute component={RolesPage} />} />
                    <Route path="accounts/user-roles" element={<LazyRoute component={UserRolesPage} />} />
                    <Route path="accounts/departments" element={<LazyRoute component={DepartmentsPage} />} />
                    <Route path="accounts/user-profiles" element={<LazyRoute component={UserProfilesPage} />} />

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
                    <Route path="student/dashboard" element={<LazyRoute component={StudentDashboard} />} />
                    <Route path="student/profile" element={<LazyRoute component={MyProfile} />} />
                    <Route path="student/academics/attendance" element={<LazyRoute component={Attendance} />} />
                    <Route path="student/academics/subjects" element={<LazyRoute component={Subjects} />} />
                    <Route path="student/academics/assignments" element={<LazyRoute component={Assignments} />} />
                    <Route path="student/examinations/exam-form" element={<LazyRoute component={ExamForm} />} />
                    <Route path="student/examinations/results" element={<LazyRoute component={Results} />} />
                    <Route path="student/fees" element={<LazyRoute component={Fees} />} />
                    <Route path="student/certificates" element={<LazyRoute component={StudentCertificates} />} />
                    <Route path="student/notices" element={<LazyRoute component={Notices} />} />
                    <Route path="student/support" element={<LazyRoute component={Support} />} />
                </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}