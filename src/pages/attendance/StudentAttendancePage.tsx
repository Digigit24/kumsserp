/**
 * Student Attendance Page
 */

import { useState, useMemo } from 'react';
import { useStudentAttendance } from '../../hooks/useAttendance';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Calendar } from 'lucide-react';
import type { StudentAttendanceFilters } from '../../types/attendance.types';

const StudentAttendancePage = () => {
  const [filters, setFilters] = useState<StudentAttendanceFilters>({
    page: 1,
    page_size: 10,
  });

  // Fetch attendance data using the hook
  const { data, isLoading, error, refetch } = useStudentAttendance(filters);

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
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Mark Today's Attendance
        </Button>
      </div>

      <DataTable
        title="Attendance Records"
        columns={columns}
        data={data || { count: 0, next: null, previous: null, results: [] }}
        isLoading={isLoading}
        error={error?.message || null}
        onRefresh={() => refetch()}
        onAdd={() => {}}
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
