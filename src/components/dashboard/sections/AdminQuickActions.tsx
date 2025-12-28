import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  DollarSign,
  ClipboardList,
  Award,
  BookOpen,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const AdminQuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          Quick Actions
        </CardTitle>
        <CardDescription>Frequently used administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all" onClick={() => navigate('/students/list')}>
            <div className="flex flex-col items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span className="text-xs font-medium">Students</span>
            </div>
          </Button>
          <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all" onClick={() => navigate('/accounts/users')}>
            <div className="flex flex-col items-center gap-2">
              <GraduationCap className="h-6 w-6 text-green-600" />
              <span className="text-xs font-medium">Teachers</span>
            </div>
          </Button>
          <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all" onClick={() => navigate('/fees/collections')}>
            <div className="flex flex-col items-center gap-2">
              <DollarSign className="h-6 w-6 text-purple-600" />
              <span className="text-xs font-medium">Fees</span>
            </div>
          </Button>
          <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all" onClick={() => navigate('/attendance/students')}>
            <div className="flex flex-col items-center gap-2">
              <ClipboardList className="h-6 w-6 text-orange-600" />
              <span className="text-xs font-medium">Attendance</span>
            </div>
          </Button>
          <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-all" onClick={() => navigate('/exams/exams')}>
            <div className="flex flex-col items-center gap-2">
              <Award className="h-6 w-6 text-pink-600" />
              <span className="text-xs font-medium">Examinations</span>
            </div>
          </Button>
          <Button variant="outline" className="h-24 bg-white dark:bg-gray-950 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-all" onClick={() => navigate('/academic/classes')}>
            <div className="flex flex-col items-center gap-2">
              <BookOpen className="h-6 w-6 text-cyan-600" />
              <span className="text-xs font-medium">Classes</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
