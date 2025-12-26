import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileText,
  Users,
  GraduationCap,
  CreditCard,
  Book,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Get user type from localStorage
  const getUserInfo = () => {
    try {
      const user = JSON.parse(localStorage.getItem('kumss_user') || '{}');
      return {
        userType: user.user_type || user.userType || 'student',
        fullName: user.full_name || user.first_name + ' ' + user.last_name || 'User',
        firstName: user.first_name || 'User',
      };
    } catch {
      return { userType: 'student', fullName: 'User', firstName: 'User' };
    }
  };

  const { userType, fullName, firstName } = getUserInfo();

  // Teacher Dashboard Content
  const TeacherDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {firstName}!</h1>
        <p className="text-muted-foreground mt-2">
          Teacher Dashboard - Quick access to your daily tasks
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Items to complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Access frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/attendance/students')}
            >
              <ClipboardCheck className="h-6 w-6" />
              <span>Mark Attendance</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/exams/marks-register')}
            >
              <FileText className="h-6 w-6" />
              <span>Enter Marks</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/academic/timetables')}
            >
              <Calendar className="h-6 w-6" />
              <span>View Timetable</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/students')}
            >
              <Users className="h-6 w-6" />
              <span>My Students</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Your classes for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '09:00 AM', subject: 'Mathematics', class: 'Class 1-A', room: 'Room 101' },
              { time: '11:00 AM', subject: 'Physics', class: 'Class 2-A', room: 'Room 202' },
              { time: '02:00 PM', subject: 'Chemistry', class: 'Class 1-B', room: 'Lab 1' },
              { time: '04:00 PM', subject: 'Mathematics', class: 'Class 2-B', room: 'Room 101' },
            ].map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium min-w-[100px]">
                    <Clock className="h-4 w-4" />
                    {schedule.time}
                  </div>
                  <div>
                    <p className="font-semibold">{schedule.subject}</p>
                    <p className="text-sm text-muted-foreground">{schedule.class} - {schedule.room}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Student Dashboard Content
  const StudentDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {firstName}!</h1>
        <p className="text-muted-foreground mt-2">
          Student Dashboard - Track your academic progress
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.5%</div>
            <p className="text-xs text-muted-foreground">Overall attendance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current CGPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.75</div>
            <p className="text-xs text-muted-foreground">Out of 4.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹60,000</div>
            <p className="text-xs text-muted-foreground">Due: 31 Jan 2026</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borrowed Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Out of 5 allowed</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Access your important information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/attendance/my-attendance')}
            >
              <ClipboardCheck className="h-6 w-6" />
              <span>My Attendance</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/exams/my-results')}
            >
              <FileText className="h-6 w-6" />
              <span>My Results</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/fees/my-fees')}
            >
              <CreditCard className="h-6 w-6" />
              <span>My Fees</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/library/my-books')}
            >
              <Book className="h-6 w-6" />
              <span>My Books</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Classes</CardTitle>
          <CardDescription>Your schedule for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '09:00 AM', subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101' },
              { time: '11:00 AM', subject: 'Physics', teacher: 'Dr. Johnson', room: 'Room 202' },
              { time: '02:00 PM', subject: 'Chemistry', teacher: 'Dr. Williams', room: 'Lab 1' },
            ].map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium min-w-[100px]">
                    <Clock className="h-4 w-4" />
                    {schedule.time}
                  </div>
                  <div>
                    <p className="font-semibold">{schedule.subject}</p>
                    <p className="text-sm text-muted-foreground">{schedule.teacher} - {schedule.room}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render based on user type
  return (
    <div className="p-4 md:p-6 animate-fade-in">
      {userType === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
    </div>
  );
};
