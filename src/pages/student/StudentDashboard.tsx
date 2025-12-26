import React from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  BookOpen,
  CreditCard,
  Trophy,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();

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

  const pendingAssignments = [
    { id: 1, subject: 'Chemistry', title: 'Lab Report', dueDate: '2025-12-28', priority: 'high' },
    { id: 2, subject: 'History', title: 'Essay on World War II', dueDate: '2025-12-30', priority: 'medium' },
  ];

  const upcomingExams = [
    { id: 1, subject: 'Mathematics', date: '2026-01-05', type: 'Mid-term' },
    { id: 2, subject: 'Physics', date: '2026-01-08', type: 'Mid-term' },
  ];

  const recentNotices = [
    { id: 1, title: 'Holiday Notice', date: '2025-12-20', type: 'important' },
    { id: 2, title: 'Sports Day Registration', date: '2025-12-18', type: 'event' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's your overview for today
        </p>
      </div>

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
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/student/academics/attendance')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance (This Month)
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
              {pendingAssignments.filter(a => a.priority === 'high').length} high priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Widgets - Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Classes Detail */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysClasses.map((class_) => (
                <div key={class_.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      class_.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{class_.subject}</p>
                      <p className="text-sm text-muted-foreground">{class_.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{class_.time}</p>
                    <Badge variant={class_.status === 'completed' ? 'success' : 'default'} className="mt-1">
                      {class_.status === 'completed' ? 'Completed' : 'Upcoming'}
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
              {pendingAssignments.map((assignment) => (
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
                onClick={() => navigate('/student/academics/assignments')}
              >
                View All Assignments
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notices / Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notices
            </CardTitle>
            <CardDescription>Recent announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotices.map((notice) => (
                <div key={notice.id} className="p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-sm">{notice.title}</p>
                    {notice.type === 'important' && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notice.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate('/student/notices')}
              >
                View All Notices
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Recent Results
            </CardTitle>
            <CardDescription>Your latest exam results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Mathematics</p>
                  <Badge variant="success">85%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Mid-term Exam</p>
              </div>
              <div className="p-3 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Physics</p>
                  <Badge variant="success">78%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Mid-term Exam</p>
              </div>
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
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20" onClick={() => navigate('/student/fees')}>
              <div className="flex flex-col items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span className="text-sm">Pay Fees</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20" onClick={() => navigate('/student/certificates')}>
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="text-sm">Request Certificate</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20" onClick={() => navigate('/student/academics/attendance')}>
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm">View Attendance</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20" onClick={() => navigate('/student/support')}>
              <div className="flex flex-col items-center gap-2">
                <Bell className="h-5 w-5" />
                <span className="text-sm">Get Help</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
