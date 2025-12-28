import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const AdminPendingTasks: React.FC = () => {
  const navigate = useNavigate();

  const pendingTasks = [
    { id: 1, title: 'Review admission applications', count: 23, priority: 'high' as const, route: '/students/list' },
    { id: 2, title: 'Approve leave requests', count: 8, priority: 'medium' as const, route: '/hr/leave-approvals' },
    { id: 3, title: 'Verify exam results', count: 12, priority: 'high' as const, route: '/exams/exams' },
    { id: 4, title: 'Update fee structures', count: 5, priority: 'low' as const, route: '/fees/structures' },
  ];

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Pending Tasks
        </CardTitle>
        <CardDescription>Items requiring your attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => navigate(task.route)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{task.title}</p>
                  <Badge
                    variant={
                      task.priority === 'high' ? 'destructive' :
                      task.priority === 'medium' ? 'warning' : 'default'
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{task.count} pending items</p>
              </div>
              <div className="text-2xl font-bold text-primary">{task.count}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
