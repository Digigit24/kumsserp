import React from 'react';
import { BookOpen, User, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { EnrolledSubject } from '@/types/student-portal.types';

interface SubjectCardProps {
  subject: EnrolledSubject;
  onClick?: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick }) => {
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {subject.name}
            </CardTitle>
            <CardDescription>Code: {subject.code}</CardDescription>
          </div>
          <Badge variant={subject.type === 'Core' ? 'default' : 'secondary'}>
            {subject.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Subject Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Instructor</p>
                <p className="text-sm font-medium">{subject.teacher}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Credits</p>
                <p className="text-sm font-medium">{subject.credits}</p>
              </div>
            </div>
          </div>

          {/* Schedule Preview */}
          {subject.schedule && subject.schedule.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs font-medium">Schedule</p>
              </div>
              <div className="space-y-1">
                {subject.schedule.slice(0, 2).map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between text-xs p-2 rounded-md bg-accent/50">
                    <Badge variant="outline" className="text-xs">{schedule.day}</Badge>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{schedule.startTime} - {schedule.endTime}</span>
                    </div>
                    <span className="text-muted-foreground">{schedule.room}</span>
                  </div>
                ))}
                {subject.schedule.length > 2 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{subject.schedule.length - 2} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
