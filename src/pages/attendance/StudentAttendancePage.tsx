/**
 * Student Attendance Page
 */

import { useState, useMemo } from 'react';
import { useStudentAttendance } from '../../hooks/useAttendance';
import { useStudents } from '../../hooks/useStudents';
import { StudentAttendanceForm } from '../../components/attendance/StudentAttendanceForm';
import { BulkAttendanceForm } from '../../components/attendance/BulkAttendanceForm';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Calendar, Edit, Users } from 'lucide-react';
import type { StudentAttendanceFilters, StudentAttendance } from '../../types/attendance.types';
import type { StudentListItem, StudentFilters } from '../../types/students.types';

const StudentAttendancePage = () => {
  const [filters, setFilters] = useState<StudentFilters>({
    page: 1,
    page_size: 20,
  });
  const [formOpen, setFormOpen] = useState(false);
  const [bulkFormOpen, setBulkFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentListItem | null>(null);

  // Fetch students for marking attendance
  const { data, isLoading, error, refetch } = useStudents(filters);

  const handleMarkAttendance = (student: StudentListItem) => {
    setSelectedStudent(student);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedStudent(null);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    refetch();
  };

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
      render: (student) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleMarkAttendance(student)}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Mark Attendance
        </Button>
      ),
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
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBulkFormOpen(true)}>
            <Users className="h-4 w-4 mr-2" />
            Bulk Mark
          </Button>
          <Button onClick={handleAdd}>
            <Calendar className="h-4 w-4 mr-2" />
            Mark Single
          </Button>
        </div>
      </div>

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
