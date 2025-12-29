import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ClipboardList, Users } from 'lucide-react';

// Mock data for today's classes
const TODAYS_CLASSES = [
  {
    id: 'class-1',
    subject: 'Mathematics',
    section: 'Class 10-A',
    time: '09:00 AM - 10:00 AM',
    room: 'Room 101',
    status: 'pending',
  },
  {
    id: 'class-2',
    subject: 'Physics',
    section: 'Class 11-B',
    time: '11:00 AM - 12:00 PM',
    room: 'Lab 1',
    status: 'completed',
  },
  {
    id: 'class-3',
    subject: 'Mathematics',
    section: 'Class 12-A',
    time: '02:00 PM - 03:00 PM',
    room: 'Room 101',
    status: 'pending',
  },
];

export const TeacherAttendancePage: React.FC = () => {
  const navigate = useNavigate();

  const handleTakeAttendance = (classId: string) => {
    navigate(`/attendance/marking?session=${classId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
        <p className="text-muted-foreground mt-2">
          Mark and manage student attendance for your classes
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Classes scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Taken</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1/3</div>
            <p className="text-xs text-muted-foreground">Classes completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {TODAYS_CLASSES.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">{cls.subject} - {cls.section}</div>
                  <div className="text-sm text-muted-foreground">{cls.time} • {cls.room}</div>
                </div>
                {cls.status === 'completed' ? (
                  <Button size="sm" variant="outline" disabled>Completed</Button>
                ) : (
                  <Button size="sm" onClick={() => handleTakeAttendance(cls.id)}>
                    Take Attendance
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            View and manage attendance records for all your classes. This section will display historical attendance data once integrated with the backend API.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
