/**
 * Exam Schedules Page
 * Manage exam schedules and timetables
 */

import { useState } from 'react';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

interface ExamSchedule {
  id: number;
  exam_name: string;
  subject_name: string;
  class_name: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  max_marks: number;
  allowed_time: number;
  is_active: boolean;
}

const ExamSchedulesPage = () => {
  const [filters, setFilters] = useState({ page: 1, page_size: 20 });
  const mockData = { count: 0, next: null, previous: null, results: [] as ExamSchedule[] };

  const columns: Column<ExamSchedule>[] = [
    { key: 'exam_name', label: 'Exam', sortable: true },
    { key: 'subject_name', label: 'Subject', sortable: true },
    { key: 'class_name', label: 'Class', sortable: true },
    {
      key: 'exam_date',
      label: 'Date & Time',
      render: (schedule) => (
        <div className="text-sm">
          <p>{new Date(schedule.exam_date).toLocaleDateString()}</p>
          <p className="text-muted-foreground">{schedule.start_time} - {schedule.end_time}</p>
        </div>
      ),
    },
    {
      key: 'max_marks',
      label: 'Marks',
      render: (schedule) => <Badge variant="outline">{schedule.max_marks}</Badge>,
    },
    {
      key: 'allowed_time',
      label: 'Duration',
      render: (schedule) => <span className="text-sm">{schedule.allowed_time} min</span>,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (schedule) => (
        <Badge variant={schedule.is_active ? 'success' : 'destructive'}>
          {schedule.is_active ? 'Active' : 'Inactive'}
        </Badge>
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
      <div>
        <h1 className="text-3xl font-bold">Exam Schedules</h1>
        <p className="text-muted-foreground">Manage exam schedules and timetables</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Schedules List</CardTitle>
          <CardDescription>View and manage all exam schedules</CardDescription>
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
            searchPlaceholder="Search schedules..."
            addNewLabel="Add Schedule"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamSchedulesPage;
