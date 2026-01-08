import React, { useMemo } from 'react';
import { BookOpen, Users, Clock, Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useStudent } from '@/hooks/useStudents';
import { useSubjectAssignments } from '@/hooks/useAcademic';

export const Subjects: React.FC = () => {
  const { user } = useAuth();
  const studentId = user?.id ? Number(user.id) : null;

  // Fetch student details to get current class
  const { data: studentData, isLoading: studentLoading } = useStudent(studentId);

  // Fetch subject assignments for the student's class
  const classId = studentData?.current_class;
  const sectionId = studentData?.current_section;

  const { data: assignmentsData, isLoading: assignmentsLoading } = useSubjectAssignments({
    class_field: classId || undefined,
    section: sectionId || undefined,
    page_size: 100,
  });

  const subjectAssignments = assignmentsData?.results || [];

  // Transform API data to match UI structure
  type SubjectSchedule = { day: string; time: string; room: string };
  type SubjectItem = {
    id: number;
    name: string;
    code: string;
    teacher: string;
    credits: number;
    type: string;
    schedule: SubjectSchedule[];
  };

  const subjects = useMemo<SubjectItem[]>(() => {
    return subjectAssignments.map((assignment) => ({
      id: assignment.id,
      name: assignment.subject_name || 'Subject',
      code: assignment.subject_code || 'N/A',
      teacher: assignment.teacher_name || 'Staff',
      credits: 4, // Default credits, would need to come from subject details
      type: 'Core', // Would need to determine from subject type
      schedule: [], // Would need separate timetable API call for schedule
    }));
  }, [subjectAssignments]);

  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);

  // Loading state
  if (studentLoading || assignmentsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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

      {/* Empty State */}
      {subjects.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Subjects Found</h3>
              <p className="text-muted-foreground max-w-md">
                Your enrolled subjects will appear here. Please contact your administrator if you believe this is an error.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};
