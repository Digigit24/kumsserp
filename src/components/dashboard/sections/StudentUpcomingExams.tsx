import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const EXAMS = [
  { name: 'Pathology Internal', date: 'Mar 12', type: 'Internal' },
  { name: 'Community Medicine Viva', date: 'Mar 18', type: 'Viva' },
  { name: 'Pharmacology Mid-term', date: 'Mar 25', type: 'Mid-term' },
];

export const StudentUpcomingExams: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Upcoming Exams</CardTitle>
          <CardDescription>Dates to keep on your radar</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/exams/exam-schedules')}>
          Full Schedule
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {EXAMS.map((exam) => (
          <div key={exam.name} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-semibold">{exam.name}</p>
              <p className="text-sm text-muted-foreground">Date: {exam.date}</p>
            </div>
            <Badge variant="outline">{exam.type}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
