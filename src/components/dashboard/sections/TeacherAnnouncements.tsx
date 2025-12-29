import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Megaphone } from 'lucide-react';

const ANNOUNCEMENTS = [
  { title: 'Internal exam guidelines', time: '1h ago', tag: 'Exams' },
  { title: 'Lab safety drill this Friday', time: '3h ago', tag: 'Labs' },
  { title: 'Upload attendance by 5pm', time: 'Today', tag: 'Reminder' },
];

export const TeacherAnnouncements: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>Latest updates from the administration</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/communication/teacher')}>
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {ANNOUNCEMENTS.map((note) => (
          <div key={note.title} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Megaphone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{note.title}</p>
                <p className="text-sm text-muted-foreground">{note.time}</p>
              </div>
            </div>
            <Badge variant="outline">{note.tag}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
