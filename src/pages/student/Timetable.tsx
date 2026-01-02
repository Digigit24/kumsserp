import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, User, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { timetableApi } from '@/services/academic.service';
import type { PaginatedResponse } from '@/types/core.types';
import type { TimetableListItem } from '@/types/academic.types';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const colorClasses = [
  'bg-blue-100 border-blue-300 text-blue-900',
  'bg-purple-100 border-purple-300 text-purple-900',
  'bg-green-100 border-green-300 text-green-900',
  'bg-red-100 border-red-300 text-red-900',
  'bg-yellow-100 border-yellow-300 text-yellow-900',
  'bg-teal-100 border-teal-300 text-teal-900',
  'bg-orange-100 border-orange-300 text-orange-900',
  'bg-pink-100 border-pink-300 text-pink-900',
];

export const Timetable: React.FC = () => {
  const { studentId, data: student, isLoading: studentLoading } = useCurrentStudent();

  const timetableQuery = useQuery<PaginatedResponse<TimetableListItem>>({
    queryKey: ['student-timetable', student?.current_class, student?.current_section],
    queryFn: () =>
      timetableApi.list({
        class_obj: student?.current_class ?? undefined,
        section: student?.current_section ?? undefined,
        is_active: true,
        page_size: 400,
        ordering: 'day_of_week,class_time',
      }),
    enabled: Boolean(student?.current_class || student?.current_section),
    staleTime: 5 * 60 * 1000,
  });

  const timetableEntries = timetableQuery.data?.results || [];

  const days = useMemo(() => {
    const daySet = new Set<number>();
    timetableEntries.forEach(entry => {
      if (entry.day_of_week) {
        daySet.add(entry.day_of_week);
      }
    });

    const labels = Array.from(daySet)
      .sort((a, b) => a - b)
      .map(day => dayNames[(day || 1) - 1]);

    return labels.length ? labels : dayNames.slice(0, 6);
  }, [timetableEntries]);

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const { groupedTimetable, subjectColors } = useMemo(() => {
    const slots = new Map<number, { time: string; entries: Record<string, TimetableListItem & { color: string }> }>();
    const colorMap = new Map<number, string>();

    const getColor = (subjectAssignment: number) => {
      if (!colorMap.has(subjectAssignment)) {
        const index = colorMap.size % colorClasses.length;
        colorMap.set(subjectAssignment, colorClasses[index]);
      }
      return colorMap.get(subjectAssignment)!;
    };

    timetableEntries.forEach(entry => {
      if (!entry.class_time || !entry.subject_assignment) return;
      const day = dayNames[(entry.day_of_week || 1) - 1];
      const color = getColor(entry.subject_assignment);

      if (!slots.has(entry.class_time)) {
        slots.set(entry.class_time, { time: entry.time_slot, entries: {} });
      }

      const slot = slots.get(entry.class_time)!;
      slot.entries[day] = { ...entry, color };
    });

    const sorted = Array.from(slots.entries())
      .sort(([a], [b]) => a - b)
      .map(([, value]) => value);

    return { groupedTimetable: sorted, subjectColors: colorMap };
  }, [timetableEntries]);

  const stats = {
    days: new Set(timetableEntries.map(entry => entry.day_of_week)).size || 0,
    classesPerDay: groupedTimetable.length,
    subjects: new Set(timetableEntries.map(entry => entry.subject_name)).size,
    rooms: new Set(timetableEntries.map(entry => entry.classroom_name).filter(Boolean)).size,
  };

  const legendItems = useMemo(() => {
    const items: { name: string; color: string }[] = [];
    subjectColors.forEach((color, subjectAssignment) => {
      const subjectName =
        timetableEntries.find(entry => entry.subject_assignment === subjectAssignment)?.subject_name ||
        'Subject';
      items.push({ name: subjectName, color });
    });
    return items;
  }, [subjectColors, timetableEntries]);

  if (!studentId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Timetable</CardTitle>
          <CardDescription>Sign in with a student account to view your timetable.</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">No student profile found.</CardContent>
      </Card>
    );
  }

  if (studentLoading || timetableQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (timetableQuery.isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Unable to load timetable
          </CardTitle>
          <CardDescription>Please try again later.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Timetable</h1>
        <p className="text-muted-foreground mt-2">
          {student?.current_class_name || 'Weekly class schedule'}
          {student?.current_section_name ? ` • ${student.current_section_name}` : ''}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.days}</p>
              <p className="text-sm text-muted-foreground">Days per Week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.classesPerDay}</p>
              <p className="text-sm text-muted-foreground">Classes per Day</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.subjects}</p>
              <p className="text-sm text-muted-foreground">Total Subjects</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.rooms}</p>
              <p className="text-sm text-muted-foreground">Different Rooms</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Current week timetable</CardDescription>
        </CardHeader>
        <CardContent>
          {groupedTimetable.length ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-border bg-muted p-3 text-left font-semibold min-w-[120px]">
                      Time
                    </th>
                    {days.map((day) => (
                      <th
                        key={day}
                        className={`border border-border p-3 text-center font-semibold min-w-[180px] ${
                          day === currentDay ? 'bg-primary/10 text-primary' : 'bg-muted'
                        }`}
                      >
                        {day}
                        {day === currentDay && (
                          <Badge variant="default" className="ml-2 text-xs">Today</Badge>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupedTimetable.map((slot, index) => (
                    <tr key={index}>
                      <td className="border border-border bg-muted p-3 font-medium text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {slot.time}
                        </div>
                      </td>
                      {days.map((day) => {
                        const session = slot.entries[day];
                        return (
                          <td key={day} className="border border-border p-2">
                            {session ? (
                              <div className={`${session.color} p-3 rounded-lg border-2 h-full min-h-[100px] flex flex-col justify-between`}>
                                <div>
                                  <p className="font-semibold text-sm mb-1">{session.subject_name}</p>
                                  {session.subject_assignment && (
                                    <Badge variant="outline" className="mb-2 text-xs">
                                      #{session.subject_assignment}
                                    </Badge>
                                  )}
                                </div>
                                {session.teacher_name && (
                                  <div className="space-y-1 text-xs">
                                    <div className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      <span>{session.teacher_name}</span>
                                    </div>
                                    {session.classroom_name && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        <span>{session.classroom_name}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="h-full min-h-[100px]"></div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No timetable entries available.</p>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          {legendItems.length ? (
            <div className="flex flex-wrap gap-4">
              {legendItems.map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded border-2 ${item.color}`}></div>
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No subjects scheduled yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
