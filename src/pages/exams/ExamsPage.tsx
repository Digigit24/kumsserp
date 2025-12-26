/**
 * Exams Page
 * Manage examinations in the system
 */

import { useState } from 'react';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

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
  const [filters, setFilters] = useState({ page: 1, page_size: 20 });
  const [isLoading] = useState(false);

  // Mock data - replace with actual API call
  const mockData = {
    count: 0,
    next: null,
    previous: null,
    results: [] as ExamListItem[],
  };

  // Define table columns
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

  // Define filter configuration
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

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setFilters({ ...filters, page, page_size: pageSize });
  };

  const handleRefresh = () => {
    // Refetch data
  };

  const handleAddNew = () => {
    // Open create form
  };

  const handleRowClick = (exam: ExamListItem) => {
    // Open detail view
    console.log('View exam:', exam);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Examinations</h1>
          <p className="text-muted-foreground">Manage examinations and exam schedules</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam List</CardTitle>
          <CardDescription>View and manage all examinations</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockData.results}
            totalCount={mockData.count}
            currentPage={filters.page}
            pageSize={filters.page_size}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
            filterConfig={filterConfig}
            onRefresh={handleRefresh}
            onAddNew={handleAddNew}
            onRowClick={handleRowClick}
            isLoading={isLoading}
            searchPlaceholder="Search exams..."
            addNewLabel="Add Exam"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamsPage;
