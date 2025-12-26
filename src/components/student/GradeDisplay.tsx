import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface GradeDisplayProps {
  grade: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GradeDisplay: React.FC<GradeDisplayProps> = ({
  grade,
  size = 'md',
  className
}) => {
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'default';
    if (grade.startsWith('C')) return 'warning';
    return 'destructive';
  };

  const sizeClasses = {
    sm: 'text-sm px-2 py-0.5',
    md: 'text-base px-3 py-1',
    lg: 'text-lg px-4 py-2',
  };

  return (
    <Badge
      variant={getGradeColor(grade)}
      className={cn(sizeClasses[size], className)}
    >
      {grade}
    </Badge>
  );
};
