import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ClipboardList, MessageSquare, Users } from 'lucide-react';

const STATS = [
  { label: 'Classes Today', value: 3, color: 'bg-blue-100 text-blue-700' },
  { label: 'Assignments to Review', value: 8, color: 'bg-amber-100 text-amber-700' },
  { label: 'Pending Attendance', value: 2, color: 'bg-rose-100 text-rose-700' },
  { label: 'Messages', value: 5, color: 'bg-emerald-100 text-emerald-700' },
];

export const TeacherQuickStats: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Teacher Shortcuts</CardTitle>
          <CardDescription>Important actions for your day</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/teacher/attendance')}>
            Mark Attendance
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/assignments/create')}>
            New Assignment
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map((stat) => (
          <div key={stat.label} className={`p-4 rounded-lg border ${stat.color}`}>
            <p className="text-xs uppercase font-semibold tracking-wide">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
        <div className="col-span-2 md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button variant="outline" className="h-20" onClick={() => navigate('/teacher/students')}>
            <div className="flex flex-col items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-xs">My Students</span>
            </div>
          </Button>
          <Button variant="outline" className="h-20" onClick={() => navigate('/teacher/subjects')}>
            <div className="flex flex-col items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span className="text-xs">Subjects</span>
            </div>
          </Button>
          <Button variant="outline" className="h-20" onClick={() => navigate('/assignments/submissions')}>
            <div className="flex flex-col items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              <span className="text-xs">Submissions</span>
            </div>
          </Button>
          <Button variant="outline" className="h-20" onClick={() => navigate('/communication/teacher')}>
            <div className="flex flex-col items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs">Announcements</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
