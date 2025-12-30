import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  FileCheck,
  FileText,
  GraduationCap,
  Trophy,
  UserCircle
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssignments } from '@/hooks/useAssignments';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Fetch assignments from API
  const { data: assignmentsData } = useAssignments({ page_size: 10, status: 'active' });
  const assignments = assignmentsData?.results || [];

  // Filter assignments that are not yet submitted (pending)
  const today = new Date();
  const pendingAssignments = assignments.filter(a => {
    const dueDate = new Date(a.due_date);
    return dueDate >= today; // Only show assignments that haven't passed due date
  });

  // Mock data - Replace with actual API calls
  const todaysClasses = [
    { id: 1, subject: 'Mathematics', time: '09:00 AM', room: 'Room 101', status: 'upcoming' },
    { id: 2, subject: 'Physics', time: '11:00 AM', room: 'Lab 203', status: 'upcoming' },
    { id: 3, subject: 'English', time: '02:00 PM', room: 'Room 105', status: 'completed' },
  ];

  const attendanceData = {
    percentage: 85,
    present: 68,
    absent: 12,
    total: 80
  };

  const pendingFees = {
    amount: 5000,
    dueDate: '2025-01-15',
    description: 'Semester Fee'
  };

  const upcomingExams = [
    { id: 1, subject: 'Mathematics', date: '2026-01-05', type: 'Mid-term' },
    { id: 2, subject: 'Physics', date: '2026-01-08', type: 'Mid-term' },
  ];

  const recentNotices = [
    { id: 1, title: 'Holiday Notice', date: '2025-12-20', type: 'important' },
    { id: 2, title: 'Sports Day Registration', date: '2025-12-18', type: 'event' },
  ];

  // Test Marks Data
  const recentTestMarks = [
    { id: 1, subject: 'Mathematics', test: 'Unit Test 3', marks: 85, totalMarks: 100, grade: 'A', date: '2025-12-15' },
    { id: 2, subject: 'Physics', test: 'Mid-term Exam', marks: 78, totalMarks: 100, grade: 'B+', date: '2025-12-10' },
    { id: 3, subject: 'Chemistry', test: 'Unit Test 3', marks: 92, totalMarks: 100, grade: 'A+', date: '2025-12-08' },
    { id: 4, subject: 'English', test: 'Essay Test', marks: 88, totalMarks: 100, grade: 'A', date: '2025-12-05' },
  ];

  const getGradeColor = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return 'success';
    if (grade === 'B+' || grade === 'B') return 'default';
    if (grade === 'C+' || grade === 'C') return 'warning';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's your overview for today
        </p>
      </div>

      {/* Quick Actions - Prominent at Top */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>Frequently used actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Button
              variant="outline"
              className="h-24 bg-white dark:bg-gray-950 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
              onClick={() => navigate('/attendance/my-attendance')}
            >
              <div className="flex flex-col items-center gap-2">
                <ClipboardList className="h-6 w-6 text-blue-600" />
                <span className="text-xs font-medium">My Attendance</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-24 bg-white dark:bg-gray-950 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all"
              onClick={() => navigate('/student/examinations/results')}
            >
              <div className="flex flex-col items-center gap-2">
                <Trophy className="h-6 w-6 text-green-600" />
                <span className="text-xs font-medium">My Results</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-24 bg-white dark:bg-gray-950 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all"
              onClick={() => navigate('/student/fees')}
            >
              <div className="flex flex-col items-center gap-2">
                <CreditCard className="h-6 w-6 text-purple-600" />
                <span className="text-xs font-medium">Pay Fees</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-24 bg-white dark:bg-gray-950 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all"
              onClick={() => navigate('/student/academics/assignments')}
            >
              <div className="flex flex-col items-center gap-2">
                <FileCheck className="h-6 w-6 text-orange-600" />
                <span className="text-xs font-medium">Assignments</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-24 bg-white dark:bg-gray-950 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-all"
              onClick={() => navigate('/student/certificates')}
            >
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-6 w-6 text-pink-600" />
                <span className="text-xs font-medium">Certificates</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-24 bg-white dark:bg-gray-950 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-all"
              onClick={() => navigate('/student/profile')}
            >
              <div className="flex flex-col items-center gap-2">
                <UserCircle className="h-6 w-6 text-cyan-600" />
                <span className="text-xs font-medium">My Profile</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Priority Cards - Top Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's Classes Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/student/academics/subjects')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Classes
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysClasses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {todaysClasses.filter(c => c.status === 'upcoming').length} upcoming
            </p>
          </CardContent>
        </Card>

        {/* Attendance Status Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/attendance/my-attendance')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceData.percentage}%</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={attendanceData.percentage >= 75 ? "success" : "destructive"}>
                {attendanceData.present}/{attendanceData.total}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pending Fees Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/student/fees')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Fees
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{pendingFees.amount}</div>
            <p className="text-xs text-destructive mt-1">
              Due: {new Date(pendingFees.dueDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        {/* Pending Assignments Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/student/academics/assignments')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Assignments
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingAssignments.filter(a => {
                const daysUntilDue = Math.ceil((new Date(a.due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return daysUntilDue <= 3; // Due within 3 days
              }).length} due soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - With Attendance Calendar and Test Marks */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Mini Attendance Calendar - Full Width on Small, 2 cols on Large */}
        <div className="lg:col-span-2">
          <AttendanceCalendar
            showStats={true}
            showLegend={true}
            compact={false}
          />
        </div>

        {/* Test Marks Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Recent Test Marks
            </CardTitle>
            <CardDescription>Your latest test scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTestMarks.map((test) => (
                <div key={test.id} className="p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{test.subject}</p>
                      <p className="text-xs text-muted-foreground">{test.test}</p>
                    </div>
                    <Badge variant={getGradeColor(test.grade)}>
                      {test.grade}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{test.marks}</span>
                      <span className="text-sm text-muted-foreground">/ {test.totalMarks}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(test.date).toLocaleDateString()}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        test.marks / test.totalMarks >= 0.9 ? 'bg-green-500' :
                        test.marks / test.totalMarks >= 0.75 ? 'bg-blue-500' :
                        test.marks / test.totalMarks >= 0.6 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(test.marks / test.totalMarks) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate('/student/examinations/results')}
              >
                View All Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Classes Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysClasses.map((class_) => (
                <div key={class_.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      class_.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20'
                    }`}>
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{class_.subject}</p>
                      <p className="text-xs text-muted-foreground">{class_.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-xs">{class_.time}</p>
                    <Badge variant={class_.status === 'completed' ? 'success' : 'default'} className="mt-1">
                      {class_.status === 'completed' ? 'Done' : 'Upcoming'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exam Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Upcoming Exams
            </CardTitle>
            <CardDescription>Your exam schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="p-3 rounded-lg border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{exam.subject}</p>
                      <Badge variant="outline" className="mt-1">{exam.type}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(exam.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate('/student/examinations/exam-form')}
              >
                View All Exams
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Assignments Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Assignments
            </CardTitle>
            <CardDescription>Due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingAssignments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No pending assignments
                </p>
              ) : (
                pendingAssignments.slice(0, 5).map((assignment) => {
                  const daysUntilDue = Math.ceil((new Date(assignment.due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  const isUrgent = daysUntilDue <= 3;

                  return (
                    <div key={assignment.id} className="p-3 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-sm">{assignment.subject_name}</p>
                        <Badge variant={isUrgent ? 'destructive' : 'default'}>
                          {daysUntilDue === 0 ? 'Today' : daysUntilDue === 1 ? 'Tomorrow' : `${daysUntilDue} days`}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{assignment.title}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })
              )}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate('/student/academics/assignments')}
              >
                View All Assignments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
