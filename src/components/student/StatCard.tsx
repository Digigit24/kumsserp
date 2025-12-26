import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
  className?: string;
  valueClassName?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  onClick,
  className,
  valueClassName,
}) => {
  return (
    <Card
      className={cn(
        'hover:shadow-lg transition-shadow',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', valueClassName)}>{value}</div>
        {(description || trendValue) && (
          <div className="flex items-center gap-2 mt-1">
            {trendValue && (
              <span className={cn(
                'text-xs font-medium',
                trend === 'up' && 'text-green-600',
                trend === 'down' && 'text-destructive',
                trend === 'neutral' && 'text-muted-foreground'
              )}>
                {trendValue}
              </span>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
