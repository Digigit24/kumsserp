/**
 * Subject Attendance Page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubjectAttendance } from '../../hooks/useAttendance';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import type { SubjectAttendanceFilters } from '../../types/attendance.types';

const SubjectAttendancePage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SubjectAttendanceFilters>({
    page: 1,
    page_size: 10,
  });

  // Fetch subject attendance data using the hook
  const { data, isLoading, error, refetch } = useSubjectAttendance(filters);

  const columns: Column<any>[] = [
    { key: 'subject_name', label: 'Subject', sortable: true },
    { key: 'class_name', label: 'Class', sortable: true },
    { key: 'section_name', label: 'Section', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'period', label: 'Period', sortable: true },
    { key: 'teacher_name', label: 'Teacher', sortable: true },
    {
      key: 'present_count',
      label: 'Present',
      render: (record) => (
        <Badge variant="success">{record.present_count}</Badge>
      ),
    },
    {
      key: 'absent_count',
      label: 'Absent',
      render: (record) => (
        <Badge variant="destructive">{record.absent_count}</Badge>
      ),
    },
    {
      key: 'attendance_percentage',
      label: 'Attendance %',
      render: (record) => `${record.attendance_percentage.toFixed(1)}%`,
    },
    {
      key: 'is_completed',
      label: 'Status',
      render: (record) => (
        <Badge variant={record.is_completed ? 'success' : 'outline'}>
          {record.is_completed ? 'Completed' : 'Pending'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subject Attendance</h1>
        <p className="text-muted-foreground">Period-wise subject attendance tracking</p>
      </div>

      <DataTable
        title="Subject Attendance Records"
        columns={columns}
        data={data || { count: 0, next: null, previous: null, results: [] }}
        isLoading={isLoading}
        error={error?.message || null}
        onRefresh={() => refetch()}
        onAdd={() => navigate('/attendance/mark')}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search subjects..."
        addButtonLabel="Record Attendance"
      />
    </div>
  );
};

export default SubjectAttendancePage;
