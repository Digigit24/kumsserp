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

const StudentAttendancePage = () => {
  const [filters, setFilters] = useState<StudentAttendanceFilters>({
    page: 1,
    page_size: 10,
  });
  const [formOpen, setFormOpen] = useState(false);
  const [bulkFormOpen, setBulkFormOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<StudentAttendance | null>(null);

  // Fetch attendance data using the hook
  const { data, isLoading, error, refetch } = useStudentAttendance(filters);
  // Lightweight students fetch to show availability count
  const { data: studentsData, isLoading: studentsLoading, error: studentsError } = useStudents({ page: 1, page_size: 1 });

  const handleEdit = (attendance: any) => {
    setSelectedAttendance(attendance);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedAttendance(null);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    refetch();
  };

  const columns: Column<any>[] = [
    { key: 'student_roll_number', label: 'Roll No', sortable: true },
    { key: 'student_name', label: 'Student Name', sortable: true },
    { key: 'class_name', label: 'Class', sortable: true },
    { key: 'section_name', label: 'Section', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (record) => {
        const variant = record.status === 'present' ? 'success' :
                        record.status === 'absent' ? 'destructive' : 'secondary';
        return <Badge variant={variant}>{record.status}</Badge>;
      },
    },
    {
      key: 'is_verified',
      label: 'Verified',
      render: (record) => (
        <Badge variant={record.is_verified ? 'success' : 'outline'}>
          {record.is_verified ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (record) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEdit(record)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'present', label: 'Present' },
        { value: 'absent', label: 'Absent' },
        { value: 'late', label: 'Late' },
        { value: 'excused', label: 'Excused' },
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
            Available students: {studentsLoading ? '...' : studentsError ? 'Error' : studentsData?.count ?? 0}
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
        attendance={selectedAttendance}
        onSuccess={handleFormSuccess}
      />

      <BulkAttendanceForm
        open={bulkFormOpen}
        onOpenChange={setBulkFormOpen}
        onSuccess={handleFormSuccess}
      />

      <DataTable
        title="Attendance Records"
        columns={columns}
        data={data || { count: 0, next: null, previous: null, results: [] }}
        isLoading={isLoading}
        error={error?.message || null}
        onRefresh={() => refetch()}
        onAdd={handleAdd}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search attendance..."
        addButtonLabel="Mark Attendance"
      />
    </div>
  );
};

export default StudentAttendancePage;
