import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MainLayout } from "./components/layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import Settings from "./pages/Settings";
import { DebugPage } from "./pages/debug/DebugPage";

// Core Module Pages
import CollegesPage from "./pages/core/CollegesPage";
import AcademicYearsPage from "./pages/core/AcademicYearsPage";
import AcademicSessionsPage from "./pages/core/AcademicSessionsPage";
import HolidaysPage from "./pages/core/HolidaysPage";
import WeekendsPage from "./pages/core/WeekendsPage";
import SystemSettingsPage from "./pages/core/SystemSettingsPage";
import NotificationSettingsPage from "./pages/core/NotificationSettingsPage";
import ActivityLogsPage from "./pages/core/ActivityLogsPage";

// Accounts Module Pages
import UsersPage from "./pages/accounts/UsersPage";
import RolesPage from "./pages/accounts/RolesPage";
import UserRolesPage from "./pages/accounts/UserRolesPage";
import DepartmentsPage from "./pages/accounts/DepartmentsPage";
import UserProfilesPage from "./pages/accounts/UserProfilesPage";

// Students Module Pages
import {
  StudentsPage,
  StudentCategoriesPage,
  StudentGroupsPage,
  GuardiansPage,
  StudentAddressesPage,
  StudentDocumentsPage,
  MedicalRecordsPage,
  PreviousAcademicRecordsPage,
  StudentPromotionsPage,
  CertificatesPage,
  StudentIDCardsPage,
} from "./pages/students";
import { StudentDetailPage } from "./pages/students/StudentDetailPage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
              <Route path="debug" element={<DebugPage />} />

              {/* Core Module Routes */}
              <Route path="core/colleges" element={<CollegesPage />} />
              <Route path="core/academic-years" element={<AcademicYearsPage />} />
              <Route path="core/academic-sessions" element={<AcademicSessionsPage />} />
              <Route path="core/holidays" element={<HolidaysPage />} />
              <Route path="core/weekends" element={<WeekendsPage />} />
              <Route path="core/system-settings" element={<SystemSettingsPage />} />
              <Route path="core/notification-settings" element={<NotificationSettingsPage />} />
              <Route path="core/activity-logs" element={<ActivityLogsPage />} />

              {/* Accounts Module Routes */}
              <Route path="accounts/users" element={<UsersPage />} />
              <Route path="accounts/roles" element={<RolesPage />} />
              <Route path="accounts/user-roles" element={<UserRolesPage />} />
              <Route path="accounts/departments" element={<DepartmentsPage />} />
              <Route path="accounts/user-profiles" element={<UserProfilesPage />} />

              {/* Students Module Routes */}
              <Route path="students/list" element={<StudentsPage />} />
              <Route path="students/:id" element={<StudentDetailPage />} />
              <Route path="students/categories" element={<StudentCategoriesPage />} />
              <Route path="students/groups" element={<StudentGroupsPage />} />
              <Route path="students/guardians" element={<GuardiansPage />} />
              <Route path="students/addresses" element={<StudentAddressesPage />} />
              <Route path="students/documents" element={<StudentDocumentsPage />} />
              <Route path="students/medical-records" element={<MedicalRecordsPage />} />
              <Route path="students/previous-records" element={<PreviousAcademicRecordsPage />} />
              <Route path="students/promotions" element={<StudentPromotionsPage />} />
              <Route path="students/certificates" element={<CertificatesPage />} />
              <Route path="students/id-cards" element={<StudentIDCardsPage />} />
            </Route>
          </Route>

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
