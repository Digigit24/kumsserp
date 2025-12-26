/**
 * Exams Page
 * Manage examinations in the system
 */

import { useState } from 'react';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';

interface ExamListItem {
  id: number;
  name: string;
  code: string;
  exam_type_name: string;
  session_name: string;
  exam_date_start: string;
  exam_date_end: string;
  is_published: boolean;
  is_active: boolean;
}

const ExamsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const mockData = {
    count: 0,
    next: null,
    previous: null,
    results: [] as ExamListItem[],
  };

  const columns: Column<ExamListItem>[] = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      render: (exam) => (
        <code className="px-2 py-1 bg-muted rounded text-sm font-medium">
          {exam.code}
        </code>
      ),
    },
    {
      key: 'name',
      label: 'Exam Name',
      sortable: true,
      render: (exam) => (
        <div>
          <p className="font-medium">{exam.name}</p>
          <p className="text-sm text-muted-foreground">{exam.exam_type_name}</p>
        </div>
      ),
    },
    {
      key: 'session_name',
      label: 'Session',
      sortable: true,
    },
    {
      key: 'exam_date_start',
      label: 'Exam Period',
      render: (exam) => (
        <div className="text-sm">
          <p>{new Date(exam.exam_date_start).toLocaleDateString()}</p>
          <p className="text-muted-foreground">to {new Date(exam.exam_date_end).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      key: 'is_published',
      label: 'Published',
      render: (exam) => (
        <Badge variant={exam.is_published ? 'success' : 'secondary'}>
          {exam.is_published ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (exam) => (
        <Badge variant={exam.is_active ? 'success' : 'destructive'}>
          {exam.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'is_published',
      label: 'Published Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'true', label: 'Published' },
        { value: 'false', label: 'Draft' },
      ],
    },
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
        <h1 className="text-3xl font-bold">Examinations</h1>
        <p className="text-muted-foreground">Manage examinations and exam schedules</p>
      </div>

      <DataTable
        title="Exam List"
        description="View and manage all examinations"
        columns={columns}
        data={mockData}
        isLoading={false}
        error={null}
        onRefresh={() => {}}
        onAdd={() => {}}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search exams..."
        addButtonLabel="Add Exam"
      />
    </div>
  );
};

export default ExamsPage;
