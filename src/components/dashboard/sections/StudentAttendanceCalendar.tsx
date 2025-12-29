import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const WEEK = [
  { day: 'Mon', status: 'Present' },
  { day: 'Tue', status: 'Present' },
  { day: 'Wed', status: 'Present' },
  { day: 'Thu', status: 'Absent' },
  { day: 'Fri', status: 'Present' },
];

const statusColor: Record<string, string> = {
  Present: 'bg-emerald-500',
  Absent: 'bg-rose-500',
  Late: 'bg-amber-500',
};

export const StudentAttendanceCalendar: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance This Week</CardTitle>
        <CardDescription>Stay consistent to maintain eligibility</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-3">
          {WEEK.map(({ day, status }) => (
            <div key={day} className="p-3 border rounded-lg text-center">
              <p className="text-sm font-medium mb-2">{day}</p>
              <div className={`h-2 rounded-full ${statusColor[status]}`} />
              <Badge className="mt-2" variant="outline">{status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
