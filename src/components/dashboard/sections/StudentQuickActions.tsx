import { BookOpen, CalendarDays, ClipboardList, CreditCard, Megaphone, UserCircle } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ACTIONS = [
  { label: 'Assignments', icon: ClipboardList, href: '/student/academics/assignments', color: 'text-blue-600' },
  { label: 'Attendance', icon: CalendarDays, href: '/student/academics/attendance', color: 'text-emerald-600' },
  { label: 'Exam Results', icon: BookOpen, href: '/student/examinations/results', color: 'text-purple-600' },
  { label: 'My Fees', icon: CreditCard, href: '/fees/my-fees', color: 'text-amber-600' },
  { label: 'Library', icon: BookOpen, href: '/library/my-books', color: 'text-indigo-600' },
  { label: 'Notices', icon: Megaphone, href: '/student/notices', color: 'text-pink-600' },
  { label: 'Support', icon: Megaphone, href: '/student/support', color: 'text-sky-600' },
  { label: 'Profile', icon: UserCircle, href: '/student/profile', color: 'text-gray-700' },
];

export const StudentQuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Student Shortcuts</CardTitle>
        <CardDescription>Jump straight into the most common student tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {ACTIONS.map(({ label, icon: Icon, href, color }) => (
            <Button
              key={label}
              variant="outline"
              className="h-24 bg-background hover:bg-primary/5"
              onClick={() => navigate(href)}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <Icon className={`h-6 w-6 ${color}`} />
                <span className="text-xs font-medium">{label}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
