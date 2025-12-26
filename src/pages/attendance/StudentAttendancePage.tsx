/**
 * Student Attendance Page
 * Mark and manage student attendance
 */

import { useState } from 'react';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Calendar } from 'lucide-react';

interface StudentAttendanceRecord {
  id: number;
  student_name: string;
  student_roll_number: string;
  class_name: string;
  section_name: string;
  date: string;
  status: string;
  subject_name: string | null;
  is_verified: boolean;
}

const StudentAttendancePage = () => {
  const [filters, setFilters] = useState({ page: 1, page_size: 20 });
  const mockData = { count: 0, results: [] as StudentAttendanceRecord[] };

  const columns: Column<StudentAttendanceRecord>[] = [
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

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockData.results}
            totalCount={mockData.count}
            currentPage={filters.page}
            pageSize={filters.page_size}
            onPageChange={(page, pageSize) => setFilters({ ...filters, page, page_size: pageSize })}
            onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
            filterConfig={filterConfig}
            searchPlaceholder="Search attendance..."
            addNewLabel="Mark Attendance"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendancePage;
