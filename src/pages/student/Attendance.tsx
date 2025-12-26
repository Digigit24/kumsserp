import React, { useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Attendance: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock data - Replace with actual API calls
  const attendanceSummary = {
    totalDays: 80,
    present: 68,
    absent: 12,
    percentage: 85,
    requiredPercentage: 75,
  };

  const monthlyAttendance = [
    { date: '2025-12-01', status: 'present' },
    { date: '2025-12-02', status: 'present' },
    { date: '2025-12-03', status: 'absent' },
    { date: '2025-12-04', status: 'present' },
    { date: '2025-12-05', status: 'present' },
    { date: '2025-12-26', status: 'present' },
  ];

  const subjectWiseAttendance = [
    { subject: 'Mathematics', present: 20, total: 24, percentage: 83 },
    { subject: 'Physics', present: 18, total: 22, percentage: 82 },
    { subject: 'Chemistry', present: 19, total: 23, percentage: 83 },
    { subject: 'English', present: 21, total: 24, percentage: 88 },
    { subject: 'Computer Science', present: 17, total: 20, percentage: 85 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Attendance</h1>
        <p className="text-muted-foreground mt-2">
          Track your attendance and maintain required percentage
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceSummary.totalDays}</div>
            <p className="text-xs text-muted-foreground mt-1">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{attendanceSummary.present}</div>
            <p className="text-xs text-muted-foreground mt-1">Days attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{attendanceSummary.absent}</div>
            <p className="text-xs text-muted-foreground mt-1">Days missed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Percentage</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceSummary.percentage}%</div>
            <Badge
              variant={attendanceSummary.percentage >= attendanceSummary.requiredPercentage ? "success" : "destructive"}
              className="mt-1"
            >
              {attendanceSummary.percentage >= attendanceSummary.requiredPercentage ? 'Above Required' : 'Below Required'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Progress</CardTitle>
          <CardDescription>
            Required: {attendanceSummary.requiredPercentage}% | Current: {attendanceSummary.percentage}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all ${
                attendanceSummary.percentage >= attendanceSummary.requiredPercentage
                  ? 'bg-green-500'
                  : 'bg-destructive'
              }`}
              style={{ width: `${Math.min(attendanceSummary.percentage, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Attendance</CardTitle>
          <CardDescription>Your attendance in each subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectWiseAttendance.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{subject.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {subject.present} / {subject.total} classes
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={subject.percentage >= 75 ? "success" : "destructive"}>
                      {subject.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      subject.percentage >= 75 ? 'bg-green-500' : 'bg-destructive'
                    }`}
                    style={{ width: `${subject.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Attendance
          </CardTitle>
          <CardDescription>December 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {monthlyAttendance.map((day, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-center text-sm border ${
                  day.status === 'present'
                    ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/20 dark:border-green-800'
                    : day.status === 'absent'
                    ? 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/20 dark:border-red-800'
                    : 'bg-muted'
                }`}
              >
                {new Date(day.date).getDate()}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span className="text-sm">Absent</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
