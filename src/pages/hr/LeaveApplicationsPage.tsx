import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const LeaveApplicationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leave Applications</h1>
          <p className="text-muted-foreground mt-2">Manage staff leave requests</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Apply Leave
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            View and manage leave applications. Full functionality after backend integration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
