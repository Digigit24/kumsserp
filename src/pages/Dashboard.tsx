import React from 'react';
import { TeacherDashboard } from '@/components/dashboard/TeacherDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { StudentDashboard } from './student/StudentDashboard';

export const Dashboard: React.FC = () => {
  // Get user type from localStorage
  const getUserType = (): string => {
    try {
      const user = JSON.parse(localStorage.getItem('kumss_user') || '{}');
      return user.user_type || user.userType || 'student';
    } catch {
      return 'student';
    }
  };

  const userType = getUserType();

  // Conditional rendering based on user type
  if (userType === 'super_admin' || userType === 'college_admin') {
    return <AdminDashboard />;
  }

  if (userType === 'teacher') {
    return <TeacherDashboard />;
  }

  if (userType === 'student') {
    return <StudentDashboard />;
  }

  // Default dashboard for other user types (fallback to admin)
  return <AdminDashboard />;
};
