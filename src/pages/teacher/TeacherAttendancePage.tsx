import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ClipboardList, Users } from 'lucide-react';

export const TeacherAttendancePage: React.FC = () => {
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
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium">Mathematics - Class 10-A</div>
                <div className="text-sm text-muted-foreground">09:00 AM - 10:00 AM • Room 101</div>
              </div>
              <Button size="sm">Take Attendance</Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium">Physics - Class 11-B</div>
                <div className="text-sm text-muted-foreground">11:00 AM - 12:00 PM • Lab 1</div>
              </div>
              <Button size="sm" variant="outline" disabled>Completed</Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium">Mathematics - Class 12-A</div>
                <div className="text-sm text-muted-foreground">02:00 PM - 03:00 PM • Room 101</div>
              </div>
              <Button size="sm">Take Attendance</Button>
            </div>
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
