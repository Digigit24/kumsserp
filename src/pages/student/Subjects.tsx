import React from 'react';
import { BookOpen, Users, Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Subjects: React.FC = () => {
  // Mock data - Replace with actual API calls
  const subjects = [
    {
      id: 1,
      name: 'Mathematics',
      code: 'MATH101',
      teacher: 'Dr. Smith',
      credits: 4,
      type: 'Core',
      schedule: [
        { day: 'Monday', time: '09:00 AM - 10:00 AM', room: 'Room 101' },
        { day: 'Wednesday', time: '09:00 AM - 10:00 AM', room: 'Room 101' },
        { day: 'Friday', time: '09:00 AM - 10:00 AM', room: 'Room 101' },
      ]
    },
    {
      id: 2,
      name: 'Physics',
      code: 'PHY101',
      teacher: 'Prof. Johnson',
      credits: 4,
      type: 'Core',
      schedule: [
        { day: 'Tuesday', time: '11:00 AM - 12:00 PM', room: 'Lab 203' },
        { day: 'Thursday', time: '11:00 AM - 12:00 PM', room: 'Lab 203' },
      ]
    },
    {
      id: 3,
      name: 'Chemistry',
      code: 'CHEM101',
      teacher: 'Dr. Williams',
      credits: 4,
      type: 'Core',
      schedule: [
        { day: 'Monday', time: '02:00 PM - 03:00 PM', room: 'Lab 204' },
        { day: 'Thursday', time: '02:00 PM - 03:00 PM', room: 'Lab 204' },
      ]
    },
    {
      id: 4,
      name: 'English',
      code: 'ENG101',
      teacher: 'Ms. Brown',
      credits: 3,
      type: 'Core',
      schedule: [
        { day: 'Tuesday', time: '02:00 PM - 03:00 PM', room: 'Room 105' },
        { day: 'Friday', time: '02:00 PM - 03:00 PM', room: 'Room 105' },
      ]
    },
    {
      id: 5,
      name: 'Computer Science',
      code: 'CS101',
      teacher: 'Mr. Davis',
      credits: 4,
      type: 'Elective',
      schedule: [
        { day: 'Wednesday', time: '11:00 AM - 12:00 PM', room: 'Computer Lab' },
        { day: 'Friday', time: '11:00 AM - 12:00 PM', room: 'Computer Lab' },
      ]
    },
  ];

  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Subjects</h1>
        <p className="text-muted-foreground mt-2">
          View your enrolled subjects and class schedule
        </p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Summary</CardTitle>
          <CardDescription>Current semester - 2024-2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Subjects</p>
              <p className="text-2xl font-bold">{subjects.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Credits</p>
              <p className="text-2xl font-bold">{totalCredits}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Core Subjects</p>
              <p className="text-2xl font-bold">{subjects.filter(s => s.type === 'Core').length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects List */}
      <div className="grid gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
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
              <div className="space-y-4">
                {/* Subject Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Instructor</p>
                      <p className="font-medium">{subject.teacher}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Credits</p>
                      <p className="font-medium">{subject.credits}</p>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Class Schedule</p>
                  </div>
                  <div className="space-y-2">
                    {subject.schedule.map((schedule, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-accent/50">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{schedule.day}</Badge>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3 w-3" />
                            <span>{schedule.time}</span>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{schedule.room}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
