import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Library, ShoppingCart, TrendingUp } from 'lucide-react';
import { hasModulePermission } from '@/utils/permissions';

export const StaffModuleStats: React.FC = () => {
  // Check permissions for each module
  const hasStoreAccess = hasModulePermission('store', 'read');
  const hasLibraryAccess = hasModulePermission('library', 'read');
  const hasStudentsAccess = hasModulePermission('students', 'read');

  // Mock stats - in real app, fetch from API
  const stats = [];

  if (hasStoreAccess) {
    stats.push(
      { label: 'Store Items', value: '245', icon: ShoppingCart, color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' },
      { label: 'Pending Indents', value: '12', icon: TrendingUp, color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400' }
    );
  }

  if (hasLibraryAccess) {
    stats.push(
      { label: 'Total Books', value: '1,234', icon: BookOpen, color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' },
      { label: 'Books Issued', value: '89', icon: Library, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400' }
    );
  }

  if (hasStudentsAccess) {
    stats.push(
      { label: 'Total Students', value: '856', icon: BookOpen, color: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' }
    );
  }

  // Don't show card if no stats
  if (stats.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20">
      <CardHeader>
        <CardTitle>Module Overview</CardTitle>
        <CardDescription>Quick stats from your assigned modules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className={`p-4 rounded-lg border ${stat.color}`}>
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs uppercase font-semibold tracking-wide mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
