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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - Replace with actual API calls
  const stats = {
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

  const recentActivities = [
    { id: 1, type: 'admission', title: 'New student admission', description: 'John Doe admitted to Class 10-A', time: '2 hours ago', icon: UserPlus, color: 'blue' },
    { id: 2, type: 'fee', title: 'Fee payment received', description: '₹15,000 from Student ID: 1234', time: '3 hours ago', icon: DollarSign, color: 'green' },
    { id: 3, type: 'exam', title: 'Exam schedule published', description: 'Mid-term exams for all classes', time: '5 hours ago', icon: FileText, color: 'purple' },
    { id: 4, type: 'teacher', title: 'New teacher onboarded', description: 'Sarah Smith - Mathematics', time: '1 day ago', icon: UserCheck, color: 'orange' },
  ];

  const pendingTasks = [
    { id: 1, title: 'Review admission applications', count: 23, priority: 'high', route: '/students/list' },
    { id: 2, title: 'Approve leave requests', count: 8, priority: 'medium', route: '/hr/leave-approvals' },
    { id: 3, title: 'Verify exam results', count: 12, priority: 'high', route: '/exams/results' },
    { id: 4, title: 'Update fee structures', count: 5, priority: 'low', route: '/fees/structures' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Parent-Teacher Meeting', date: '2026-01-10', type: 'meeting' },
    { id: 2, title: 'Annual Sports Day', date: '2026-01-15', type: 'event' },
    { id: 3, title: 'Mid-term Exams Start', date: '2026-01-20', type: 'exam' },
    { id: 4, title: 'Teacher Training Workshop', date: '2026-01-25', type: 'training' },
  ];

  const systemAlerts = [
    { id: 1, title: 'Server maintenance scheduled', severity: 'warning', time: 'Tomorrow 2 AM' },
    { id: 2, title: 'Database backup completed', severity: 'success', time: '1 hour ago' },
    { id: 3, title: 'Low attendance in Class 11-B', severity: 'error', time: 'Today' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'admission': return UserPlus;
      case 'fee': return DollarSign;
      case 'exam': return FileText;
      case 'teacher': return UserCheck;
      default: return Activity;
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's your institution overview
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/core/system-settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => navigate('/communication/notices')}>
            <Bell className="h-4 w-4 mr-2" />
            Announcements
          </Button>
        </div>
      </div>

      {/* Quick Actions - Prominent */}
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
            <Button
              variant="outline"
              className="h-24 bg-white dark:bg-gray-950 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
              onClick={() => navigate('/students/list')}
            >
              <div className="flex flex-col items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-xs font-medium">Students</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-24 bg-white dark:bg-gray-950 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all"
              onClick={() => navigate('/accounts/users')}
            >
              <div className="flex flex-col items-center gap-2">
                <GraduationCap className="h-6 w-6 text-green-600" />
                <span className="text-xs font-medium">Teachers</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-24 bg-white dark:bg-gray-950 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all"
              onClick={() => navigate('/fees/collections')}
            >
              <div className="flex flex-col items-center gap-2">
                <DollarSign className="h-6 w-6 text-purple-600" />
                <span className="text-xs font-medium">Fees</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-24 bg-white dark:bg-gray-950 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all"
              onClick={() => navigate('/attendance/students')}
            >
              <div className="flex flex-col items-center gap-2">
                <ClipboardList className="h-6 w-6 text-orange-600" />
                <span className="text-xs font-medium">Attendance</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-24 bg-white dark:bg-gray-950 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-all"
              onClick={() => navigate('/exams/list')}
            >
              <div className="flex flex-col items-center gap-2">
                <Award className="h-6 w-6 text-pink-600" />
                <span className="text-xs font-medium">Examinations</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-24 bg-white dark:bg-gray-950 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-all"
              onClick={() => navigate('/academic/classes')}
            >
              <div className="flex flex-col items-center gap-2">
                <BookOpen className="h-6 w-6 text-cyan-600" />
                <span className="text-xs font-medium">Classes</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics - Top Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/students/list')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">+{stats.studentsThisMonth} this month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/accounts/users')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teaching Staff</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">+{stats.teachersThisMonth} this month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/fees/collections')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (This Year)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">+{stats.revenueGrowth}% growth</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/attendance/students')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageAttendance}%</div>
            <Badge variant={stats.averageAttendance >= 85 ? 'success' : 'warning'} className="mt-1">
              {stats.averageAttendance >= 85 ? 'Excellent' : 'Needs Attention'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
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
              {pendingTasks.map((task) => (
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
              {systemAlerts.map((alert) => (
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
              {recentActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
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
              {upcomingEvents.map((event) => (
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
                <div className="text-2xl font-bold">{stats.totalClasses}</div>
                <p className="text-sm text-muted-foreground">Total Classes</p>
              </div>
              <div className="p-4 rounded-lg border text-center hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/academic/classes')}>
                <Activity className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold">{stats.activeClasses}</div>
                <p className="text-sm text-muted-foreground">Active Today</p>
              </div>
              <div className="p-4 rounded-lg border text-center hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/students/list')}>
                <UserPlus className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <div className="text-2xl font-bold">{stats.pendingAdmissions}</div>
                <p className="text-sm text-muted-foreground">Pending Admissions</p>
              </div>
              <div className="p-4 rounded-lg border text-center hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/fees/collections')}>
                <DollarSign className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                <div className="text-2xl font-bold">₹{(stats.pendingFees / 100000).toFixed(1)}L</div>
                <p className="text-sm text-muted-foreground">Pending Fees</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Quick Links */}
      <Card>
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
  );
};

export default AdminDashboard;
