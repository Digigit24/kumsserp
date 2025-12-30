/**
 * Student Attendance Page
 */

import { useState } from 'react';
import { useStudentAttendance, useBulkMarkAttendance, useMarkStudentAttendance } from '../../hooks/useAttendance';
import { useStudents } from '../../hooks/useStudents';
import { useClasses, useSections } from '../../hooks/useAcademic';
import { StudentAttendanceForm } from '../../components/attendance/StudentAttendanceForm';
import { BulkAttendanceForm } from '../../components/attendance/BulkAttendanceForm';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
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
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  // Track attendance status for each student
  const [attendanceMap, setAttendanceMap] = useState<Record<number, AttendanceStatus>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch students for marking attendance
  const { data, isLoading, error, refetch } = useStudents({
    ...filters,
    class_obj: selectedClass || undefined,
    section: selectedSection || undefined,
  });

  // Fetch classes and sections
  const { data: classesData } = useClasses({ page_size: 100, is_active: true });
  const { data: sectionsData } = useSections({
    page_size: 100,
    class_id: selectedClass || undefined,
    is_active: true
  });

  const classes = classesData?.results || [];
  const sections = sectionsData?.results || [];

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

    if (!selectedClass || !selectedSection) {
      toast.error('Please select class and section');
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
            class_obj: selectedClass,
            section: selectedSection,
            date: selectedDate,
            status: status as 'present' | 'absent',
            subject: null,
            period: null,
            remarks: null,
          });
        } else {
          // Multiple students with same status, use bulk API
          return await bulkMarkMutation.mutateAsync({
            student_ids: studentIds,
            class_obj: selectedClass,
            section: selectedSection,
            date: selectedDate,
            status: status,
            subject: null,
            remarks: null,
          });
        }
      });

      await Promise.all(promises);

      toast.success(`Attendance submitted successfully for ${markedStudents.length} student(s)`);
      setAttendanceMap({});
      refetch(); // Refresh the student list
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

      {/* Date, Class, and Section Selectors */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  setAttendanceMap({}); // Clear attendance map
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
                onValueChange={(value) => {
                  setSelectedSection(Number(value));
                  setAttendanceMap({}); // Clear attendance map
                }}
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
        columns={columns}
        data={data || { count: 0, next: null, previous: null, results: [] }}
        isLoading={isLoading}
        error={error?.message || null}
        onRefresh={() => refetch()}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search students..."
      />
    </div>
  );
};

export default StudentAttendancePage;
