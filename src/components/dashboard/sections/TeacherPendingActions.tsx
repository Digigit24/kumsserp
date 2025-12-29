import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, FileCheck2, Mail } from 'lucide-react';

const ACTIONS = [
  { title: 'Grade submissions', detail: '3 assignments waiting for review', badge: 'Assessments', href: '/assignments/submissions' },
  { title: 'Publish attendance', detail: '2 classes marked, publish to students', badge: 'Attendance', href: '/teacher/attendance' },
  { title: 'Reply to messages', detail: '5 unread student queries', badge: 'Communication', href: '/communication/teacher' },
];

export const TeacherPendingActions: React.FC = () => {
  const navigate = useNavigate();

  const badgeIcon: Record<string, JSX.Element> = {
    Assessments: <ClipboardList className="h-4 w-4" />,
    Attendance: <FileCheck2 className="h-4 w-4" />,
    Communication: <Mail className="h-4 w-4" />,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Actions</CardTitle>
        <CardDescription>Finish these items to stay on track</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {ACTIONS.map((action) => (
          <div key={action.title} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  {badgeIcon[action.badge]}
                  {action.badge}
                </Badge>
                <p className="font-semibold">{action.title}</p>
              </div>
              <p className="text-sm text-muted-foreground">{action.detail}</p>
            </div>
            <Button size="sm" onClick={() => navigate(action.href)}>
              Go
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
