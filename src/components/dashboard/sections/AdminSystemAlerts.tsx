import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const AdminSystemAlerts: React.FC = () => {
  const navigate = useNavigate();

  const systemAlerts = [
    { id: 1, title: 'Server maintenance scheduled', severity: 'warning' as const, time: 'Tomorrow 2 AM' },
    { id: 2, title: 'Database backup completed', severity: 'success' as const, time: '1 hour ago' },
    { id: 3, title: 'Low attendance in Class 11-B', severity: 'error' as const, time: 'Today' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          System Alerts
        </CardTitle>
        <CardDescription>Recent system notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {systemAlerts.map((alert) => (
            <div key={alert.id} className="p-3 rounded-lg border">
              <div className="flex items-start gap-3">
                {alert.severity === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />}
                {alert.severity === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                {alert.severity === 'error' && <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />}
                <div className="flex-1">
                  <p className="font-medium text-sm">{alert.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/core/activity-logs')}>
            View All Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
