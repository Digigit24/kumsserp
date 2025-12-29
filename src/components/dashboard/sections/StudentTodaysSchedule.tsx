import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, MapPin } from 'lucide-react';

const SESSIONS = [
  { time: '09:00 AM', subject: 'Anatomy Lab', room: 'Lab 3' },
  { time: '11:00 AM', subject: 'Physiology Lecture', room: 'Hall A' },
  { time: '02:00 PM', subject: 'Biochemistry', room: 'Room 210' },
];

export const StudentTodaysSchedule: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Today&apos;s Schedule</CardTitle>
          <CardDescription>Plan your day and arrive on time</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/academic/timetables')}>
          View Timetable
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {SESSIONS.map((session) => (
          <div key={session.subject} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-semibold">{session.subject}</p>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                {session.time}
                <MapPin className="h-4 w-4" />
                {session.room}
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/student/attendance')}>
              Mark Attendance
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
