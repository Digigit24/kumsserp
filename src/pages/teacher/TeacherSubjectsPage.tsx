import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Clock } from 'lucide-react';

export const TeacherSubjectsPage: React.FC = () => {
  const mockSubjects = [
    {
      id: '1',
      name: 'Mathematics',
      code: 'MATH101',
      classes: ['Class 10-A', 'Class 12-A'],
      students: 70,
      hoursPerWeek: 6,
    },
    {
      id: '2',
      name: 'Physics',
      code: 'PHY201',
      classes: ['Class 11-B'],
      students: 30,
      hoursPerWeek: 4,
    },
    {
      id: '3',
      name: 'Advanced Mathematics',
      code: 'MATH301',
      classes: ['Class 12-A'],
      students: 35,
      hoursPerWeek: 5,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Subjects</h1>
        <p className="text-muted-foreground mt-2">
          Manage subjects you teach and view related information
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSubjects.length}</div>
            <p className="text-xs text-muted-foreground">Active subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSubjects.reduce((sum, subject) => sum + subject.students, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSubjects.reduce((sum, subject) => sum + subject.hoursPerWeek, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Teaching hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockSubjects.map((subject) => (
          <Card key={subject.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{subject.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{subject.code}</p>
                </div>
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{subject.students} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{subject.hoursPerWeek} hours/week</span>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Classes:</p>
                  <div className="flex flex-wrap gap-2">
                    {subject.classes.map((cls, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Syllabus
                  </Button>
                  <Button size="sm" className="flex-1">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
