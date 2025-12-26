import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  ClipboardList,
  FileText,
  TrendingUp,
  Bell,
  CheckCircle,
  AlertCircle,
  Users,
  BookOpen,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TodayClass {
  id: string;
  subject: string;
  class: string;
  time: string;
  room: string;
  attendanceTaken: boolean;
}

interface PendingItem {
  id: string;
  type: 'attendance' | 'marks';
  title: string;
  dueDate: string;
  class: string;
}

interface Assignment {
  id: string;
  title: string;
  class: string;
  submissions: number;
  total: number;
  dueDate: string;
}

interface Announcement {
  id: string;
  title: string;
  date: string;
  type: 'info' | 'warning' | 'urgent';
}

export const TeacherDashboard: React.FC = () => {
  // Mock data - Replace with actual API calls
  const todayClasses: TodayClass[] = [
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
    },
    {
      id: '3',
      subject: 'Mathematics',
      class: 'Class 12-A',
      time: '02:00 PM - 03:00 PM',
      room: 'Room 101',
      attendanceTaken: false,
    },
  ];

  const pendingItems: PendingItem[] = [
    {
      id: '1',
      type: 'attendance',
      title: 'Attendance - Class 10-A',
      dueDate: 'Today',
      class: 'Class 10-A',
    },
    {
      id: '2',
      type: 'marks',
      title: 'Mid-term Marks Entry',
      dueDate: '2 days left',
      class: 'Class 11-B',
    },
    {
      id: '3',
      type: 'attendance',
      title: 'Attendance - Class 12-A',
      dueDate: 'Today',
      class: 'Class 12-A',
    },
  ];

  const assignmentSubmissions: Assignment[] = [
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
  ];

  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Parent-Teacher Meeting on Friday',
      date: '2 hours ago',
      type: 'info',
    },
    {
      id: '2',
      title: 'Submit Mid-term Marks by End of Week',
      date: '1 day ago',
      type: 'warning',
    },
    {
      id: '3',
      title: 'Annual Day Rehearsal Schedule',
      date: '3 days ago',
      type: 'info',
    },
  ];

  const classPerformance = {
    averageAttendance: 87,
    averageMarks: 75,
    totalStudents: 95,
    activeAssignments: 5,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classPerformance.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classPerformance.averageAttendance}%</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Marks</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classPerformance.averageMarks}%</div>
            <p className="text-xs text-muted-foreground">Last assessment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classPerformance.activeAssignments}</div>
            <p className="text-xs text-muted-foreground">Pending submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
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
              {todayClasses.map((cls) => (
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
                  </div>
                  {!cls.attendanceTaken ? (
                    <Link to="/teacher/attendance">
                      <Button size="sm" variant="default">
                        <ClipboardList className="h-4 w-4 mr-1" />
                        Take Attendance
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Done</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Link to="/academic/timetables">
              <Button variant="outline" className="w-full mt-4">
                View Full Timetable
              </Button>
            </Link>
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
              {pendingItems.map((item) => (
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
              {assignmentSubmissions.map((assignment) => (
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
              <Link to="/assignments/list">
                <Button variant="outline" className="w-full mt-2">
                  View All Assignments
                </Button>
              </Link>
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
              {announcements.map((announcement) => (
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
              <Link to="/communication/notices">
                <Button variant="outline" className="w-full mt-2">
                  View All Notices
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
