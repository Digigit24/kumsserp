import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ASSIGNMENTS = [
  { title: 'Cardiology Case Study', submissions: 18, due: 'Closes today' },
  { title: 'Pharmacology Worksheet', submissions: 12, due: 'Closes in 2 days' },
  { title: 'Microbiology Quiz', submissions: 25, due: 'Results pending' },
];

export const TeacherAssignments: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Assignments Overview</CardTitle>
          <CardDescription>Track progress and grading</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/assignments/create')}>
            Create
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/assignments/submissions')}>
            Grade
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {ASSIGNMENTS.map((assignment) => (
          <div key={assignment.title} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-semibold">{assignment.title}</p>
              <p className="text-sm text-muted-foreground">{assignment.submissions} submissions</p>
            </div>
            <Badge variant="secondary">{assignment.due}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
