import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, Clock, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { subjectAssignmentApi, timetableApi } from '@/services/academic.service';
import { useSubjects } from '@/hooks/useAcademic';
import type { SubjectAssignmentListItem, TimetableListItem, SubjectListItem } from '@/types/academic.types';
import type { PaginatedResponse } from '@/types/core.types';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const Subjects: React.FC = () => {
  const { studentId, data: student, isLoading: studentLoading } = useCurrentStudent();

  const { data: subjectData } = useSubjects({ page_size: 200, is_active: true });
  const subjectMap = useMemo(() => {
    const map = new Map<number, SubjectListItem>();
    subjectData?.results?.forEach(subject => {
      map.set(subject.id, subject);
    });
    return map;
  }, [subjectData]);

  const subjectAssignmentsQuery = useQuery<PaginatedResponse<SubjectAssignmentListItem>>({
    queryKey: ['student-subject-assignments', student?.current_class, student?.current_section],
    queryFn: () =>
      subjectAssignmentApi.list({
        class_obj: student?.current_class ?? undefined,
        section: student?.current_section ?? undefined,
        is_active: true,
        page_size: 200,
      }),
    enabled: Boolean(student?.current_class || student?.current_section),
  });

  const timetableQuery = useQuery<PaginatedResponse<TimetableListItem>>({
    queryKey: ['student-timetable', student?.current_class, student?.current_section],
    queryFn: () =>
      timetableApi.list({
        class_obj: student?.current_class ?? undefined,
        section: student?.current_section ?? undefined,
        is_active: true,
        page_size: 300,
        ordering: 'day_of_week,class_time',
      }),
    enabled: Boolean(student?.current_class || student?.current_section),
    staleTime: 5 * 60 * 1000,
  });

  const timetableEntries = timetableQuery.data?.results || [];

  const subjectSchedules = useMemo(() => {
    const scheduleMap: Record<number, { day: string; time: string; room: string }[]> = {};

    timetableEntries.forEach(entry => {
      if (!entry.subject_assignment) return;

      const dayIndex = typeof entry.day_of_week === 'number' ? entry.day_of_week - 1 : 0;
      const day = dayNames[dayIndex] || 'Day';

      if (!scheduleMap[entry.subject_assignment]) {
        scheduleMap[entry.subject_assignment] = [];
      }

      scheduleMap[entry.subject_assignment].push({
        day,
        time: entry.time_slot,
        room: entry.classroom_name || 'TBD',
      });
    });

    return scheduleMap;
  }, [timetableEntries]);

  const subjects = subjectAssignmentsQuery.data?.results || [];
  const totalCredits = subjects.reduce(
    (sum, assignment) => sum + (subjectMap.get(assignment.subject)?.credits || 0),
    0
  );

  if (!studentId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Subjects</CardTitle>
          <CardDescription>Sign in with a student account to view subjects.</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">No student profile found.</CardContent>
      </Card>
    );
  }

  if (studentLoading || subjectAssignmentsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (subjectAssignmentsQuery.isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Unable to load subjects
          </CardTitle>
          <CardDescription>Please try again in a moment.</CardDescription>
        </CardHeader>
      </Card>
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
          <CardDescription>
            {student?.current_class_name || 'Enrolled class'}
            {student?.current_section_name ? ` • ${student.current_section_name}` : ''}
          </CardDescription>
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
              <p className="text-2xl font-bold">{subjects.filter(s => !s.is_optional).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects List */}
      <div className="grid gap-6">
        {subjects.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No subjects assigned</CardTitle>
              <CardDescription>Your enrolled subjects will appear here once assigned.</CardDescription>
            </CardHeader>
          </Card>
        )}
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {subject.subject_name}
                  </CardTitle>
                  <CardDescription>
                    {subjectMap.get(subject.subject)?.code || 'No code available'}
                  </CardDescription>
                </div>
                <Badge variant={subject.is_optional ? 'secondary' : 'default'}>
                  {subject.is_optional ? 'Optional' : 'Core'}
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
                      <p className="font-medium">{subject.teacher_name || 'TBD'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Credits</p>
                      <p className="font-medium">{subjectMap.get(subject.subject)?.credits ?? 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Class Schedule</p>
                  </div>
                  {subjectSchedules[subject.id]?.length ? (
                    <div className="space-y-2">
                      {subjectSchedules[subject.id].map((schedule, index) => (
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
                  ) : (
                    <p className="text-sm text-muted-foreground">No timetable entries for this subject yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
