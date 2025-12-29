import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ASSIGNMENTS = [
  { title: 'Case Study: Cardiology', due: 'Due in 2 days', status: 'Pending' },
  { title: 'Lab Report: Hematology', due: 'Due in 5 days', status: 'In Progress' },
  { title: 'MCQ Set: Anatomy', due: 'Submitted', status: 'Submitted' },
];

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  Pending: 'default',
  'In Progress': 'secondary',
  Submitted: 'outline',
};

export const StudentAssignments: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Assignments</CardTitle>
          <CardDescription>Stay ahead on coursework</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/student/assignments')}>
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {ASSIGNMENTS.map((assignment) => (
          <div key={assignment.title} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-semibold">{assignment.title}</p>
              <p className="text-sm text-muted-foreground">{assignment.due}</p>
            </div>
            <Badge variant={statusVariant[assignment.status] || 'outline'}>{assignment.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
