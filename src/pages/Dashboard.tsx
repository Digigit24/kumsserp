import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  UserPlus,
  FileText,
  Settings,
  Bell,
  Calendar,
  BookOpen,
  ClipboardList,
  Award,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Building2,
  Briefcase,
  Database,
  Activity,
  PieChart,
  BarChart3,
  Shield,
  Mail,
  Clock,
  Trophy,
  CreditCard,
  FileCheck,
  UserCircle,
  MessageSquare,
  Library,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar';
import {
  isAdmin,
  isTeacher,
  isStudent,
  isParent,
  getDashboardTitle,
  getDashboardWelcome,
  hasAnyRole,
} from '@/utils/permissions';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Role checks
  const showAdminContent = isAdmin();
  const showTeacherContent = isTeacher();
  const showStudentContent = isStudent();

  // Mock data - Replace with actual API calls
  const adminStats = {
    totalStudents: 1247,
    totalTeachers: 85,
    totalStaff: 42,
    totalClasses: 36,
    studentsThisMonth: 45,
    teachersThisMonth: 3,
    averageAttendance: 87.5,
    pendingAdmissions: 23,
    totalRevenue: 2450000,
    pendingFees: 450000,
    revenueGrowth: 12.5,
    activeClasses: 28,
  };

  const teacherData = {
    todayClasses: [
      {
        id: '1',
        subject: 'Mathematics',
        class: 'Class 10-A',
        time: '09:00 AM - 10:00 AM',
        room: 'Room 101',
        attendanceTaken: false,
      },
      {
        id: '2',
        subject: 'Physics',
        class: 'Class 11-B',
        time: '11:00 AM - 12:00 PM',
        room: 'Lab 1',
        attendanceTaken: true,
        attendancePercentage: 93.33,
      },
      {
        id: '3',
        subject: 'Mathematics',
        class: 'Class 12-A',
        time: '02:00 PM - 03:00 PM',
        room: 'Room 101',
        attendanceTaken: false,
      },
    ],
    pendingItems: [
      {
        id: '1',
        type: 'attendance' as const,
        title: 'Attendance - Class 10-A',
        dueDate: 'Today',
        class: 'Class 10-A',
      },
      {
        id: '2',
        type: 'marks' as const,
        title: 'Mid-term Marks Entry',
        dueDate: '2 days left',
        class: 'Class 11-B',
      },
      {
        id: '3',
        type: 'attendance' as const,
        title: 'Attendance - Class 12-A',
        dueDate: 'Today',
        class: 'Class 12-A',
      },
    ],
    assignmentSubmissions: [
      {
        id: '1',
        title: 'Algebra Assignment',
        class: 'Class 10-A',
        submissions: 28,
        total: 35,
        dueDate: 'Tomorrow',
      },
      {
        id: '2',
        title: 'Thermodynamics Lab Report',
        class: 'Class 11-B',
        submissions: 15,
        total: 30,
        dueDate: 'In 3 days',
      },
    ],
    classPerformance: {
      averageAttendance: 87,
      averageMarks: 75,
      totalStudents: 95,
      activeAssignments: 5,
    },
  };

  const studentData = {
    todaysClasses: [
      { id: 1, subject: 'Mathematics', time: '09:00 AM', room: 'Room 101', status: 'upcoming' },
      { id: 2, subject: 'Physics', time: '11:00 AM', room: 'Lab 203', status: 'upcoming' },
      { id: 3, subject: 'English', time: '02:00 PM', room: 'Room 105', status: 'completed' },
    ],
    attendanceData: {
      percentage: 85,
      present: 68,
      absent: 12,
      total: 80,
    },
    pendingFees: {
      amount: 5000,
      dueDate: '2025-01-15',
      description: 'Semester Fee',
    },
    pendingAssignments: [
      { id: 1, subject: 'Chemistry', title: 'Lab Report', dueDate: '2025-12-28', priority: 'high' as const },
      { id: 2, subject: 'History', title: 'Essay on World War II', dueDate: '2025-12-30', priority: 'medium' as const },
    ],
    upcomingExams: [
      { id: 1, subject: 'Mathematics', date: '2026-01-05', type: 'Mid-term' },
      { id: 2, subject: 'Physics', date: '2026-01-08', type: 'Mid-term' },
    ],
    recentTestMarks: [
      { id: 1, subject: 'Mathematics', test: 'Unit Test 3', marks: 85, totalMarks: 100, grade: 'A', date: '2025-12-15' },
      { id: 2, subject: 'Physics', test: 'Mid-term Exam', marks: 78, totalMarks: 100, grade: 'B+', date: '2025-12-10' },
      { id: 3, subject: 'Chemistry', test: 'Unit Test 3', marks: 92, totalMarks: 100, grade: 'A+', date: '2025-12-08' },
      { id: 4, subject: 'English', test: 'Essay Test', marks: 88, totalMarks: 100, grade: 'A', date: '2025-12-05' },
    ],
  };

  const commonData = {
    recentActivities: [
      { id: 1, type: 'admission', title: 'New student admission', description: 'John Doe admitted to Class 10-A', time: '2 hours ago', icon: UserPlus, color: 'blue' },
      { id: 2, type: 'fee', title: 'Fee payment received', description: '₹15,000 from Student ID: 1234', time: '3 hours ago', icon: DollarSign, color: 'green' },
      { id: 3, type: 'exam', title: 'Exam schedule published', description: 'Mid-term exams for all classes', time: '5 hours ago', icon: FileText, color: 'purple' },
      { id: 4, type: 'teacher', title: 'New teacher onboarded', description: 'Sarah Smith - Mathematics', time: '1 day ago', icon: UserCheck, color: 'orange' },
    ],
    announcements: [
      {
        id: '1',
        title: 'Parent-Teacher Meeting on Friday',
        date: '2 hours ago',
        type: 'info' as const,
      },
      {
        id: '2',
        title: 'Submit Mid-term Marks by End of Week',
        date: '1 day ago',
        type: 'warning' as const,
      },
      {
        id: '3',
        title: 'Annual Day Rehearsal Schedule',
        date: '3 days ago',
        type: 'info' as const,
      },
    ],
    pendingTasks: [
      { id: 1, title: 'Review admission applications', count: 23, priority: 'high' as const, route: '/students/list' },
      { id: 2, title: 'Approve leave requests', count: 8, priority: 'medium' as const, route: '/hr/leave-approvals' },
      { id: 3, title: 'Verify exam results', count: 12, priority: 'high' as const, route: '/exams/exams' },
      { id: 4, title: 'Update fee structures', count: 5, priority: 'low' as const, route: '/fees/structures' },
    ],
    upcomingEvents: [
      { id: 1, title: 'Parent-Teacher Meeting', date: '2026-01-10', type: 'meeting' },
      { id: 2, title: 'Annual Sports Day', date: '2026-01-15', type: 'event' },
      { id: 3, title: 'Mid-term Exams Start', date: '2026-01-20', type: 'exam' },
      { id: 4, title: 'Teacher Training Workshop', date: '2026-01-25', type: 'training' },
    ],
    systemAlerts: [
      { id: 1, title: 'Server maintenance scheduled', severity: 'warning' as const, time: 'Tomorrow 2 AM' },
      { id: 2, title: 'Database backup completed', severity: 'success' as const, time: '1 hour ago' },
      { id: 3, title: 'Low attendance in Class 11-B', severity: 'error' as const, time: 'Today' },
    ],
    recentNotices: [
      { id: 1, title: 'Holiday Notice', date: '2025-12-20', type: 'important' },
      { id: 2, title: 'Sports Day Registration', date: '2025-12-18', type: 'event' },
    ],
  };

  const getActivityColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20';
      case 'green': return 'bg-green-100 text-green-600 dark:bg-green-900/20';
      case 'purple': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20';
      case 'orange': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return 'success';
    if (grade === 'B+' || grade === 'B') return 'default';
    if (grade === 'C+' || grade === 'C') return 'warning';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{getDashboardTitle()}</h1>
          <p className="text-muted-foreground mt-2">{getDashboardWelcome()}</p>
        </div>
        <div className="flex gap-2">
          {showAdminContent && (
            <>
              <Button variant="outline" onClick={() => navigate('/core/system-settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button onClick={() => navigate('/communication/notices')}>
                <Bell className="h-4 w-4 mr-2" />
                Announcements
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ADMIN CONTENT */}
      {showAdminContent && (
        <>
          {/* Quick Actions - Admin */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Frequently used administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all" onClick={() => navigate('/students/list')}>
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-6 w-6 text-blue-600" />
                    <span className="text-xs font-medium">Students</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all" onClick={() => navigate('/accounts/users')}>
                  <div className="flex flex-col items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                    <span className="text-xs font-medium">Teachers</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all" onClick={() => navigate('/fees/collections')}>
                  <div className="flex flex-col items-center gap-2">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                    <span className="text-xs font-medium">Fees</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all" onClick={() => navigate('/attendance/students')}>
                  <div className="flex flex-col items-center gap-2">
                    <ClipboardList className="h-6 w-6 text-orange-600" />
                    <span className="text-xs font-medium">Attendance</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-all" onClick={() => navigate('/exams/exams')}>
                  <div className="flex flex-col items-center gap-2">
                    <Award className="h-6 w-6 text-pink-600" />
                    <span className="text-xs font-medium">Examinations</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-all" onClick={() => navigate('/academic/classes')}>
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen className="h-6 w-6 text-cyan-600" />
                    <span className="text-xs font-medium">Classes</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics - Admin */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/students/list')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.totalStudents.toLocaleString()}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <p className="text-xs text-green-600">+{adminStats.studentsThisMonth} this month</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/accounts/users')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Teaching Staff</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.totalTeachers}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <p className="text-xs text-green-600">+{adminStats.teachersThisMonth} this month</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/fees/collections')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue (This Year)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(adminStats.totalRevenue / 100000).toFixed(1)}L</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <p className="text-xs text-green-600">+{adminStats.revenueGrowth}% growth</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/attendance/students')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.averageAttendance}%</div>
                <Badge variant={adminStats.averageAttendance >= 85 ? 'success' : 'warning'} className="mt-1">
                  {adminStats.averageAttendance >= 85 ? 'Excellent' : 'Needs Attention'}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Admin Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Pending Tasks */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Pending Tasks
                </CardTitle>
                <CardDescription>Items requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commonData.pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => navigate(task.route)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{task.title}</p>
                          <Badge
                            variant={
                              task.priority === 'high' ? 'destructive' :
                              task.priority === 'medium' ? 'warning' : 'default'
                            }
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{task.count} pending items</p>
                      </div>
                      <div className="text-2xl font-bold text-primary">{task.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  System Alerts
                </CardTitle>
                <CardDescription>Recent system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commonData.systemAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 rounded-lg border">
                      <div className="flex items-start gap-3">
                        {alert.severity === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />}
                        {alert.severity === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                        {alert.severity === 'error' && <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{alert.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/core/activity-logs')}>
                    View All Logs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
                <CardDescription>Latest activities across the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commonData.recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                        <div className={`p-2 rounded-lg ${getActivityColor(activity.color)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>Important dates and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commonData.upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{event.title}</p>
                          <Badge variant="outline" className="mt-1">{event.type}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/core/holidays')}>
                    View Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Stats */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Institution Overview
                </CardTitle>
                <CardDescription>Quick statistics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg border text-center hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/academic/classes')}>
                    <Building2 className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold">{adminStats.totalClasses}</div>
                    <p className="text-sm text-muted-foreground">Total Classes</p>
                  </div>
                  <div className="p-4 rounded-lg border text-center hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/academic/classes')}>
                    <Activity className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <div className="text-2xl font-bold">{adminStats.activeClasses}</div>
                    <p className="text-sm text-muted-foreground">Active Today</p>
                  </div>
                  <div className="p-4 rounded-lg border text-center hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/students/list')}>
                    <UserPlus className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <div className="text-2xl font-bold">{adminStats.pendingAdmissions}</div>
                    <p className="text-sm text-muted-foreground">Pending Admissions</p>
                  </div>
                  <div className="p-4 rounded-lg border text-center hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/fees/collections')}>
                    <DollarSign className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                    <div className="text-2xl font-bold">₹{(adminStats.pendingFees / 100000).toFixed(1)}L</div>
                    <p className="text-sm text-muted-foreground">Pending Fees</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Management Quick Links */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Management & Settings
                </CardTitle>
                <CardDescription>Access key management areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-16 justify-start" onClick={() => navigate('/accounts/users')}>
                    <Users className="h-5 w-5 mr-2" />
                    User Management
                  </Button>
                  <Button variant="outline" className="h-16 justify-start" onClick={() => navigate('/accounts/roles')}>
                    <Shield className="h-5 w-5 mr-2" />
                    Roles & Permissions
                  </Button>
                  <Button variant="outline" className="h-16 justify-start" onClick={() => navigate('/core/system-settings')}>
                    <Settings className="h-5 w-5 mr-2" />
                    System Settings
                  </Button>
                  <Button variant="outline" className="h-16 justify-start" onClick={() => navigate('/core/activity-logs')}>
                    <Database className="h-5 w-5 mr-2" />
                    Activity Logs
                  </Button>
                  <Button variant="outline" className="h-16 justify-start" onClick={() => navigate('/reports/templates')}>
                    <FileText className="h-5 w-5 mr-2" />
                    Reports
                  </Button>
                  <Button variant="outline" className="h-16 justify-start" onClick={() => navigate('/communication/notices')}>
                    <Mail className="h-5 w-5 mr-2" />
                    Communications
                  </Button>
                  <Button variant="outline" className="h-16 justify-start" onClick={() => navigate('/hr/leave-approvals')}>
                    <Briefcase className="h-5 w-5 mr-2" />
                    HR Management
                  </Button>
                  <Button variant="outline" className="h-16 justify-start" onClick={() => navigate('/library/books')}>
                    <BookOpen className="h-5 w-5 mr-2" />
                    Library
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* TEACHER CONTENT */}
      {showTeacherContent && (
        <>
          {/* Quick Stats - Teacher */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherData.classPerformance.totalStudents}</div>
                <p className="text-xs text-muted-foreground">Across all classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherData.classPerformance.averageAttendance}%</div>
                <p className="text-xs text-muted-foreground">+2% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Marks</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherData.classPerformance.averageMarks}%</div>
                <p className="text-xs text-muted-foreground">Last assessment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherData.classPerformance.activeAssignments}</div>
                <p className="text-xs text-muted-foreground">Pending submissions</p>
              </CardContent>
            </Card>
          </div>

          {/* Teacher Main Content Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Today's Classes */}
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teacherData.todayClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{cls.subject}</div>
                        <div className="text-sm text-muted-foreground">{cls.class}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {cls.time} • {cls.room}
                        </div>
                        {cls.attendanceTaken && cls.attendancePercentage !== undefined && (
                          <div className="text-xs font-medium text-green-600 mt-1">
                            Attendance: {cls.attendancePercentage.toFixed(2)}%
                          </div>
                        )}
                      </div>
                      {!cls.attendanceTaken ? (
                        <Button size="sm" variant="default" onClick={() => navigate(`/teacher/attendance?session=${cls.id}`)}>
                          <ClipboardList className="h-4 w-4 mr-1" />
                          Take Attendance
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm">Done</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/academic/timetables')}>
                  View Full Timetable
                </Button>
              </CardContent>
            </Card>

            {/* Pending Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teacherData.pendingItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div
                        className={`p-2 rounded-md ${
                          item.type === 'attendance'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-orange-100 text-orange-600'
                        }`}
                      >
                        {item.type === 'attendance' ? (
                          <ClipboardList className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.class}</div>
                        <div className="text-xs text-orange-600 mt-1">{item.dueDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Assignment Submissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Assignment Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teacherData.assignmentSubmissions.map((assignment) => (
                    <div key={assignment.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-sm">{assignment.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {assignment.class}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">{assignment.dueDate}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-background rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(assignment.submissions / assignment.total) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {assignment.submissions}/{assignment.total}
                        </span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/assignments/list')}>
                    View All Assignments
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commonData.announcements.map((announcement) => (
                    <div key={announcement.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-md ${
                            announcement.type === 'urgent'
                              ? 'bg-red-100 text-red-600'
                              : announcement.type === 'warning'
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          <Bell className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{announcement.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {announcement.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/communication/notices')}>
                    View All Notices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* STUDENT CONTENT */}
      {showStudentContent && (
        <>
          {/* Quick Actions - Student */}
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
                <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all" onClick={() => navigate('/attendance/my-attendance')}>
                  <div className="flex flex-col items-center gap-2">
                    <ClipboardList className="h-6 w-6 text-blue-600" />
                    <span className="text-xs font-medium">My Attendance</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all" onClick={() => navigate('/exams/my-results')}>
                  <div className="flex flex-col items-center gap-2">
                    <Trophy className="h-6 w-6 text-green-600" />
                    <span className="text-xs font-medium">My Results</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all" onClick={() => navigate('/fees/my-fees')}>
                  <div className="flex flex-col items-center gap-2">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                    <span className="text-xs font-medium">Pay Fees</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all" onClick={() => navigate('/assignments/student')}>
                  <div className="flex flex-col items-center gap-2">
                    <FileCheck className="h-6 w-6 text-orange-600" />
                    <span className="text-xs font-medium">Assignments</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-all" onClick={() => navigate('/students/certificates')}>
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-6 w-6 text-pink-600" />
                    <span className="text-xs font-medium">Certificates</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-all" onClick={() => navigate('/profile')}>
                  <div className="flex flex-col items-center gap-2">
                    <UserCircle className="h-6 w-6 text-cyan-600" />
                    <span className="text-xs font-medium">My Profile</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Priority Cards - Student */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Today's Classes Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/academic/timetables')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Classes
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentData.todaysClasses.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {studentData.todaysClasses.filter(c => c.status === 'upcoming').length} upcoming
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
                <div className="text-2xl font-bold">{studentData.attendanceData.percentage}%</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={studentData.attendanceData.percentage >= 75 ? "success" : "destructive"}>
                    {studentData.attendanceData.present}/{studentData.attendanceData.total}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Pending Fees Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/fees/my-fees')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Fees
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{studentData.pendingFees.amount}</div>
                <p className="text-xs text-destructive mt-1">
                  Due: {new Date(studentData.pendingFees.dueDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            {/* Pending Assignments Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/assignments/student')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Assignments
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentData.pendingAssignments.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {studentData.pendingAssignments.filter(a => a.priority === 'high').length} high priority
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Student Main Content - With Attendance Calendar and Test Marks */}
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
                  {studentData.recentTestMarks.map((test) => (
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
                    onClick={() => navigate('/exams/my-results')}
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
                  {studentData.todaysClasses.map((class_) => (
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
                  {studentData.upcomingExams.map((exam) => (
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
                    onClick={() => navigate('/exams/schedules')}
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
                  {studentData.pendingAssignments.map((assignment) => (
                    <div key={assignment.id} className="p-3 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-sm">{assignment.subject}</p>
                        <Badge variant={assignment.priority === 'high' ? 'destructive' : 'warning'}>
                          {assignment.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{assignment.title}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => navigate('/assignments/student')}
                  >
                    View All Assignments
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
