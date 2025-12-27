import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const StaffAttendancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Staff Attendance</h1>
        <p className="text-muted-foreground mt-2">Track staff attendance and leaves</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            View and manage staff attendance records. Full functionality available after API integration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
