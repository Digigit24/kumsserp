import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, MapPin } from 'lucide-react';

const CLASSES = [
  { id: 'session-1', time: '09:00 AM', subject: 'Physiology', section: 'MBBS 3A', room: 'Hall 2' },
  { id: 'session-2', time: '11:00 AM', subject: 'Pharmacology', section: 'MBBS 3B', room: 'Lab 1' },
  { id: 'session-3', time: '02:30 PM', subject: 'Community Medicine', section: 'MBBS 3A', room: 'Room 204' },
];

export const TeacherTodaysClasses: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Today&apos;s Classes</CardTitle>
          <CardDescription>Stay on top of your timetable</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/academic/timetables')}>
          View Timetable
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {CLASSES.map((cls) => (
          <div key={cls.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-semibold">{cls.subject}</p>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                {cls.time}
                <MapPin className="h-4 w-4" />
                {cls.room}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{cls.section}</Badge>
              <Button size="sm" onClick={() => navigate(`/attendance/marking?session=${cls.id}`)}>
                Take Attendance
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
