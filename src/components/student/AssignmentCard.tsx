import React from 'react';
import { FileText, Clock, AlertCircle, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Assignment } from '@/types/student-portal.types';

interface AssignmentCardProps {
  assignment: Assignment;
  onSubmit?: () => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, onSubmit }) => {
  const getDaysLeft = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft(assignment.dueDate);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle>{assignment.title}</CardTitle>
              <Badge
                variant={
                  assignment.priority === 'high' ? 'destructive' :
                  assignment.priority === 'medium' ? 'warning' : 'secondary'
                }
              >
                {assignment.priority}
              </Badge>
            </div>
            <CardDescription>{assignment.subject}</CardDescription>
          </div>
          <Badge variant="outline" className="text-lg">
            {assignment.marks} marks
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{assignment.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle
                className={`h-4 w-4 ${daysLeft <= 2 ? 'text-destructive' : 'text-orange-600'}`}
              />
              <span className={daysLeft <= 2 ? 'text-destructive font-medium' : 'text-orange-600 font-medium'}>
                Due: {new Date(assignment.dueDate).toLocaleDateString()} ({daysLeft} days left)
              </span>
            </div>
          </div>
          {onSubmit && (
            <Button onClick={onSubmit}>
              <Upload className="h-4 w-4 mr-2" />
              Submit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
