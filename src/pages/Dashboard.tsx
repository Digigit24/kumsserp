import React from 'react';
import { TeacherDashboard } from '@/components/dashboard/TeacherDashboard';
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
  if (userType === 'teacher') {
    return <TeacherDashboard />;
  }

  if (userType === 'student') {
    return <StudentDashboard />;
  }

  // Default dashboard for other user types
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your dashboard
        </p>
      </div>

      {/* Empty dashboard content - ready for your custom content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Add your dashboard widgets here */}
      </div>
    </div>
  );
};
