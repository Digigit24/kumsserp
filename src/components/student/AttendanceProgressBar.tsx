import React from 'react';
import { cn } from '@/lib/utils';

interface AttendanceProgressBarProps {
  percentage: number;
  requiredPercentage?: number;
  showLabel?: boolean;
  className?: string;
}

export const AttendanceProgressBar: React.FC<AttendanceProgressBarProps> = ({
  percentage,
  requiredPercentage = 75,
  showLabel = true,
  className,
}) => {
  const isAboveRequired = percentage >= requiredPercentage;

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Required: {requiredPercentage}%
          </span>
          <span className={cn('font-medium', isAboveRequired ? 'text-green-600' : 'text-destructive')}>
            Current: {percentage}%
          </span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-500',
            isAboveRequired ? 'bg-green-500' : 'bg-destructive'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};
