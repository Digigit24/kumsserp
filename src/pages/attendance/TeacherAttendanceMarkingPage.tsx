import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Check,
  X,
  Save,
  Users,
  UserCheck,
  UserX,
  Percent,
  ChevronLeft,
  Search,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useClasses, useSections, useSubjects } from '@/hooks/useAcademic';
import { useStudents } from '@/hooks/useStudents';
import { useBulkMarkAttendance, useStudentAttendance, useMarkStudentAttendance } from '@/hooks/useAttendance';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface AttendanceRecord {
  student_id: number;
  student_name: string;
  roll_number: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

export const TeacherAttendanceMarkingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent' | 'unmarked'>('all');

  // Fetch data
  const { data: classesData } = useClasses({ page_size: 100, is_active: true });
  const { data: sectionsData } = useSections({
    page_size: 100,
    class_id: selectedClass || undefined,
    is_active: true
  });
  const { data: subjectsData } = useSubjects({ page_size: 100, is_active: true });
  const { data: studentsData, isLoading: studentsLoading } = useStudents({
    page_size: 200,
    class_obj: selectedClass || undefined,
    section: selectedSection || undefined,
    is_active: true
  });

  // Fetch existing attendance for the selected date
  const { data: existingAttendance } = useStudentAttendance({
    class_obj: selectedClass || undefined,
    section: selectedSection || undefined,
    date: selectedDate,
    page_size: 200,
  });

  const bulkMarkMutation = useBulkMarkAttendance();
  const markSingleMutation = useMarkStudentAttendance();

  const classes = classesData?.results || [];
  const sections = sectionsData?.results || [];
  const subjects = subjectsData?.results || [];
  const students = studentsData?.results || [];

  // Initialize attendance records when students data changes
  useEffect(() => {
    if (students.length > 0) {
      const records: AttendanceRecord[] = students.map(student => {
        // Check if there's existing attendance for this student
        const existing = existingAttendance?.results?.find(
          a => a.student === student.id && a.date === selectedDate
        );

        return {
          student_id: student.id,
          student_name: student.full_name || `${student.first_name} ${student.last_name}`,
          roll_number: student.roll_number || 'N/A',
          status: existing?.status as any || 'present', // Default to present
        };
      });
      setAttendanceRecords(records);
    }
  }, [students, existingAttendance, selectedDate]);

  const handleMarkAttendance = async (studentId: number, status: 'present' | 'absent' | 'late' | 'excused') => {
    if (!selectedClass || !selectedSection) {
      toast.error('Please select class and section');
      return;
    }

    // Update local state immediately for UI feedback
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.student_id === studentId ? { ...record, status } : record
      )
    );

    // Call single student attendance API
    try {
      await markSingleMutation.mutateAsync({
        student: studentId,
        class_obj: selectedClass,
        section: selectedSection,
        date: selectedDate,
        status: status,
        subject: selectedSubject || null,
        period: null,
        remarks: null,
      });

      toast.success('Attendance marked successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to mark attendance');
      console.error('Mark attendance error:', error);

      // Revert local state on error
      setAttendanceRecords(prev =>
        prev.map(record => {
          if (record.student_id === studentId) {
            // Find the original status from existing attendance
            const existing = existingAttendance?.results?.find(
              a => a.student === studentId && a.date === selectedDate
            );
            return { ...record, status: existing?.status as any || 'present' };
          }
          return record;
        })
      );
    }
  };

  const handleMarkAllPresent = () => {
    setAttendanceRecords(prev => prev.map(record => ({ ...record, status: 'present' })));
  };

  const handleMarkAllAbsent = () => {
    setAttendanceRecords(prev => prev.map(record => ({ ...record, status: 'absent' })));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedSection) {
      toast.error('Please select class and section');
      return;
    }

    if (attendanceRecords.length === 0) {
      toast.error('No students to mark attendance for');
      return;
    }

    try {
      // Group students by status for bulk API
      const groupedByStatus: Record<string, number[]> = {};
      attendanceRecords.forEach(record => {
        if (!groupedByStatus[record.status]) {
          groupedByStatus[record.status] = [];
        }
        groupedByStatus[record.status].push(record.student_id);
      });

      // Call bulk API for each status group
      const promises = Object.entries(groupedByStatus).map(([status, studentIds]) => {
        // If only one student with this status, use single API
        if (studentIds.length === 1) {
          return markSingleMutation.mutateAsync({
            student: studentIds[0],
            class_obj: selectedClass,
            section: selectedSection,
            date: selectedDate,
            status: status as 'present' | 'absent' | 'late' | 'excused',
            subject: selectedSubject || null,
            period: null,
            remarks: null,
          });
        } else {
          // Multiple students with same status, use bulk API
          return bulkMarkMutation.mutateAsync({
            student_ids: studentIds,
            class_obj: selectedClass,
            section: selectedSection,
            date: selectedDate,
            status: status,
            subject: selectedSubject || null,
            remarks: null,
          });
        }
      });

      await Promise.all(promises);

      toast.success(`Attendance saved for ${attendanceRecords.length} students!`);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save attendance');
      console.error('Save attendance error:', error);
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch =
      record.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.roll_number.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'present' && record.status === 'present') ||
      (filterStatus === 'absent' && record.status === 'absent') ||
      (filterStatus === 'unmarked' && !record.status);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter(r => r.status === 'present').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
    late: attendanceRecords.filter(r => r.status === 'late').length,
    excused: attendanceRecords.filter(r => r.status === 'excused').length,
    unmarked: attendanceRecords.filter(r => !r.status).length,
  };

  const attendancePercentage = stats.total > 0
    ? Math.round((stats.present / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mark Attendance</h1>
          <p className="text-muted-foreground mt-2">
            Mark attendance for your class
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class and Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Class *</Label>
              <Select
                value={selectedClass ? String(selectedClass) : undefined}
                onValueChange={(value) => {
                  setSelectedClass(Number(value));
                  setSelectedSection(null); // Reset section
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={String(cls.id)}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section *</Label>
              <Select
                value={selectedSection ? String(selectedSection) : undefined}
                onValueChange={(value) => setSelectedSection(Number(value))}
                disabled={!selectedClass}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map(section => (
                    <SelectItem key={section.id} value={String(section.id)}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Select
                value={selectedSubject ? String(selectedSubject) : undefined}
                onValueChange={(value) => setSelectedSubject(value ? Number(value) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={String(subject.id)}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && selectedSection && (
        <>
          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.present}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Absent</CardTitle>
                <UserX className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.absent}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Late</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.late}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Excused</CardTitle>
                <Check className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.excused}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendancePercentage}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name or roll number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                    icon={<Search className="h-4 w-4" />}
                  />
                </div>
                <Button variant="outline" onClick={handleMarkAllPresent}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark All Present
                </Button>
                <Button variant="outline" onClick={handleMarkAllAbsent}>
                  <X className="h-4 w-4 mr-2" />
                  Mark All Absent
                </Button>
                <Button
                  onClick={handleSaveAttendance}
                  disabled={bulkMarkMutation.isPending || markSingleMutation.isPending || attendanceRecords.length === 0}
                >
                  {(bulkMarkMutation.isPending || markSingleMutation.isPending) ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Attendance
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <Card>
            <CardHeader>
              <CardTitle>Students ({filteredRecords.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  Loading students...
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No students found
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.student_id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{record.student_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Roll No: {record.roll_number}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={record.status === 'present' ? 'default' : 'outline'}
                          onClick={() => handleMarkAttendance(record.student_id, 'present')}
                          disabled={markSingleMutation.isPending}
                        >
                          {markSingleMutation.isPending ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 mr-1" />
                          )}
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={record.status === 'absent' ? 'destructive' : 'outline'}
                          onClick={() => handleMarkAttendance(record.student_id, 'absent')}
                          disabled={markSingleMutation.isPending}
                        >
                          {markSingleMutation.isPending ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <X className="h-4 w-4 mr-1" />
                          )}
                          Absent
                        </Button>
                        <Button
                          size="sm"
                          variant={record.status === 'late' ? 'default' : 'outline'}
                          onClick={() => handleMarkAttendance(record.student_id, 'late')}
                          disabled={markSingleMutation.isPending}
                        >
                          {markSingleMutation.isPending && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                          Late
                        </Button>
                        <Button
                          size="sm"
                          variant={record.status === 'excused' ? 'default' : 'outline'}
                          onClick={() => handleMarkAttendance(record.student_id, 'excused')}
                          disabled={markSingleMutation.isPending}
                        >
                          {markSingleMutation.isPending && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                          Excused
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
