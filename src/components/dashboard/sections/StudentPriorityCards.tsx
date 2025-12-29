import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, CreditCard, GraduationCap } from 'lucide-react';

export const StudentPriorityCards: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-emerald-600" />
            Attendance Snapshot
          </CardTitle>
          <CardDescription>Your attendance health for this week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">94%</span>
            <Badge variant="success">On Track</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Keep above 90% to remain eligible for upcoming exams.
          </p>
          <Button variant="outline" onClick={() => navigate('/student/attendance')}>
            View Attendance
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber-600" />
            Fees & Payments
          </CardTitle>
          <CardDescription>Track dues and download invoices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">₹0</span>
            <Badge variant="outline">No dues</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Stay updated on installments and receipts.
          </p>
          <Button variant="outline" onClick={() => navigate('/fees/my-fees')}>
            Go to Fees
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            Upcoming Exam
          </CardTitle>
          <CardDescription>Next scheduled assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">Mar 12</span>
            <Badge>Internal</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Pharmacology mid-term, 10:00 AM in Hall B.
          </p>
          <Button variant="outline" onClick={() => navigate('/exams/exam-schedules')}>
            View Exam Schedule
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
