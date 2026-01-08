/**
 * Student Attendance Page
 */

import { useState, useEffect } from 'react';
import { useStudentAttendance, useBulkMarkAttendance, useMarkStudentAttendance } from '../../hooks/useAttendance';
import { useStudents } from '../../hooks/useStudents';
import { useSubjects } from '../../hooks/useAcademic';
import { StudentAttendanceForm } from '../../components/attendance/StudentAttendanceForm';
import { BulkAttendanceForm } from '../../components/attendance/BulkAttendanceForm';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ContextSelectorToolbar } from '../../components/context';
import { useHierarchicalContext } from '../../contexts/HierarchicalContext';
import { usePermissions } from '../../contexts/PermissionsContext';
import { Calendar, Users, Check, X, Save } from 'lucide-react';
import type { StudentAttendanceFilters, StudentAttendance } from '../../types/attendance.types';
import type { StudentListItem, StudentFilters } from '../../types/students.types';
import { toast } from 'sonner';

type AttendanceStatus = 'present' | 'absent' | null;

const StudentAttendancePage = () => {
  const [filters, setFilters] = useState<StudentFilters>({
    page: 1,
    page_size: 20,
  });
  const [formOpen, setFormOpen] = useState(false);
  const [bulkFormOpen, setBulkFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentListItem | null>(null);

  // Attendance form fields
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);

  // Track attendance status for each student
  const [attendanceMap, setAttendanceMap] = useState<Record<number, AttendanceStatus>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use hierarchical context for class and section
  const { selectedClass, selectedSection } = useHierarchicalContext();
  const { permissions } = usePermissions();

  // Debug permissions and context
  console.log('=== ATTENDANCE DEBUG ===');
  console.log('Permissions:', permissions);
  console.log('canChooseClass:', permissions?.canChooseClass);
  console.log('canChooseSection:', permissions?.canChooseSection);
  console.log('selectedClass:', selectedClass);
  console.log('selectedSection:', selectedSection);
  console.log('Button will be disabled:', {
    markedCount: Object.values(attendanceMap).filter(status => status !== null).length,
    isSubmitting,
    noClass: !selectedClass,
    noSection: !selectedSection,
  });

  // Fetch students for marking attendance
  const { data, isLoading, error, refetch } = useStudents({
    ...filters,
    class_obj: selectedClass || undefined,
    section: selectedSection || undefined,
  });

  // Fetch subjects for the chosen class (optional filter)
  const { data: subjectsData } = useSubjects({
    page_size: 100,
    is_active: true,
    class_obj: selectedClass || undefined,
  });

  // Fetch existing attendance for the selected date
  const { data: existingAttendanceData, refetch: refetchAttendance } = useStudentAttendance({
    class_obj: selectedClass || undefined,
    section: selectedSection || undefined,
    subject: selectedSubject || undefined,
    date: selectedDate,
    page_size: 200,
  });

  // Clear attendance map when class or section changes
  useEffect(() => {
    setAttendanceMap({});
  }, [selectedClass, selectedSection]);

  // Initialize attendance map with existing attendance records
  useEffect(() => {
    if (existingAttendanceData?.results) {
      const existingMap: Record<number, AttendanceStatus> = {};
      existingAttendanceData.results.forEach((record: any) => {
        if (record.student && record.status) {
          existingMap[record.student] = record.status as AttendanceStatus;
        }
      });
      setAttendanceMap(existingMap);
      console.log('Loaded existing attendance:', existingMap);
    }
  }, [existingAttendanceData]);

  // Attendance mutations
  const bulkMarkMutation = useBulkMarkAttendance();
  const markSingleMutation = useMarkStudentAttendance();

  const handleMarkPresent = (studentId: number) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? null : 'present'
    }));
  };

  const handleMarkAbsent = (studentId: number) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'absent' ? null : 'absent'
    }));
  };

  const handleSubmitAttendance = async () => {
    const markedStudents = Object.entries(attendanceMap).filter(([_, status]) => status !== null);

    if (markedStudents.length === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    // Require both class and section (backend requires section)
    if (!selectedClass) {
      toast.error('Please select class');
      return;
    }

    if (!selectedSection) {
      toast.error('Please select section');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting attendance:', attendanceMap);

      // Group students by status
      const groupedByStatus: Record<string, number[]> = {};
      markedStudents.forEach(([studentId, status]) => {
        if (status && !groupedByStatus[status]) {
          groupedByStatus[status] = [];
        }
        if (status) {
          groupedByStatus[status].push(Number(studentId));
        }
      });

      // Call API for each status group
      const promises = Object.entries(groupedByStatus).map(async ([status, studentIds]) => {
        // If only one student with this status, use single student API
        if (studentIds.length === 1) {
          return await markSingleMutation.mutateAsync({
            student: studentIds[0],
            class_obj: selectedClass!,
            section: selectedSection || null,
            date: selectedDate,
            subject: selectedSubject,
            status: status as 'present' | 'absent' | 'late' | 'excused' | 'half_day',
            period: null,
            remarks: null,
          });
        } else {
          // Multiple students with same status, use bulk API
          return await bulkMarkMutation.mutateAsync({
            student_ids: studentIds,
            class_obj: selectedClass!,
            section: selectedSection || null,
            date: selectedDate,
            status: status as 'present' | 'absent' | 'late' | 'excused' | 'half_day',
            subject: selectedSubject,
            remarks: null,
          });
        }
      });

      await Promise.all(promises);

      toast.success(`Attendance submitted successfully for ${markedStudents.length} student(s)`);

      // Refresh both students and existing attendance
      await refetchAttendance();
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit attendance');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectAll = (status: 'present' | 'absent') => {
    const students = data?.results || [];
    const newMap: Record<number, AttendanceStatus> = {};
    students.forEach(student => {
      newMap[student.id] = status;
    });
    setAttendanceMap(newMap);
    toast.success(`All students marked as ${status}`);
  };

  const handleAdd = () => {
    setSelectedStudent(null);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    refetch();
  };

  const markedCount = Object.values(attendanceMap).filter(status => status !== null).length;
  const presentCount = Object.values(attendanceMap).filter(status => status === 'present').length;
  const absentCount = Object.values(attendanceMap).filter(status => status === 'absent').length;

  const columns: Column<StudentListItem>[] = [
    {
      key: 'admission_number',
      label: 'Admission No',
      sortable: true,
      className: 'font-semibold'
    },
    { key: 'full_name', label: 'Student Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'current_class_name',
      label: 'Class',
      sortable: true,
      render: (student) => student.current_class_name || '-'
    },
    { key: 'program_name', label: 'Program', sortable: true },
    {
      key: 'is_active',
      label: 'Status',
      render: (student) => (
        <Badge variant={student.is_active ? 'success' : 'secondary'}>
          {student.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (student) => {
        const status = attendanceMap[student.id];
        return (
          <div className="flex gap-2">
            <Button
              variant={status === 'present' ? 'default' : 'outline'}
              size="sm"
              className={
                status === 'present'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'text-green-600 hover:text-green-700 hover:bg-green-50'
              }
              onClick={() => handleMarkPresent(student.id)}
            >
              <Check className="h-4 w-4 mr-1" />
              Present
            </Button>
            <Button
              variant={status === 'absent' ? 'default' : 'outline'}
              size="sm"
              className={
                status === 'absent'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'text-red-600 hover:text-red-700 hover:bg-red-50'
              }
              onClick={() => handleMarkAbsent(student.id)}
            >
              <X className="h-4 w-4 mr-1" />
              Absent
            </Button>
          </div>
        );
      },
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'is_active',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Attendance</h1>
          <p className="text-muted-foreground">Mark and manage student attendance</p>
          <p className="text-sm text-muted-foreground">
            Available students: {isLoading ? '...' : error ? 'Error' : data?.count ?? 0}
          </p>
          {markedCount > 0 && (
            <div className="flex gap-3 mt-2">
              <span className="text-sm font-medium text-green-600">Present: {presentCount}</span>
              <span className="text-sm font-medium text-red-600">Absent: {absentCount}</span>
              <span className="text-sm font-medium text-muted-foreground">Total Marked: {markedCount}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSelectAll('present')}
            disabled={isSubmitting || !selectedClass || !selectedSection}
          >
            <Check className="h-4 w-4 mr-2" />
            Select All Present
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSelectAll('absent')}
            disabled={isSubmitting || !selectedClass || !selectedSection}
          >
            <X className="h-4 w-4 mr-2" />
            Select All Absent
          </Button>
          <Button
            onClick={handleSubmitAttendance}
            disabled={markedCount === 0 || isSubmitting || !selectedClass || !selectedSection || (bulkMarkMutation.isPending || markSingleMutation.isPending)}
            className="bg-primary"
          >
            <Save className="h-4 w-4 mr-2" />
            {(isSubmitting || bulkMarkMutation.isPending || markSingleMutation.isPending) ? 'Submitting...' : `Submit Attendance (${markedCount})`}
          </Button>
        </div>
      </div>

      {/* Context Selectors - Permission-driven */}
      <ContextSelectorToolbar />

      {/* Date Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2 max-w-sm">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="space-y-2 min-w-[220px]">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={selectedSubject?.toString() || ''}
                onValueChange={(value: string) => setSelectedSubject(value ? Number(value) : null)}
              >
                <SelectTrigger id="subject" className="w-[240px]">
                  <SelectValue placeholder="Select subject (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subjects</SelectItem>
                  {subjectsData?.results?.map((subj) => (
                    <SelectItem key={subj.id} value={subj.id.toString()}>
                      {subj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <StudentAttendanceForm
        open={formOpen}
        onOpenChange={setFormOpen}
        attendance={null}
        onSuccess={handleFormSuccess}
      />

      <BulkAttendanceForm
        open={bulkFormOpen}
        onOpenChange={setBulkFormOpen}
        onSuccess={handleFormSuccess}
      />

      <DataTable
        title="Students"
        columns={columns}
        data={data || { count: 0, next: null, previous: null, results: [] }}
        isLoading={isLoading}
        error={typeof error === 'string' ? error : error ? String(error) : null}
        onRefresh={refetch}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search students..."
      />
    </div>
  );
};

export default StudentAttendancePage;
