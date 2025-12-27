import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Bell } from 'lucide-react';

export const NoticesPage: React.FC = () => {
  const notices = [
    {
      id: '1',
      title: 'Parent-Teacher Meeting',
      content: 'PTM scheduled for Friday, December 28, 2025',
      date: '2025-12-26',
      type: 'event',
    },
    {
      id: '2',
      title: 'Holiday Announcement',
      content: 'College will be closed on January 1, 2026',
      date: '2025-12-25',
      type: 'announcement',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notices & Announcements</h1>
          <p className="text-muted-foreground mt-2">View and manage notices</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Notice
        </Button>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>{notice.title}</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(notice.date).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{notice.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
