/**
 * Exam Types Page
 * Manage different types of examinations
 */

import { useState } from 'react';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

interface ExamType {
  id: number;
  name: string;
  code: string;
  college_name: string;
  weightage: number;
  is_active: boolean;
}

const ExamTypesPage = () => {
  const [filters, setFilters] = useState({ page: 1, page_size: 20 });

  const mockData = { count: 0, next: null, previous: null, results: [] as ExamType[] };

  const columns: Column<ExamType>[] = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'name', label: 'Exam Type', sortable: true },
    { key: 'college_name', label: 'College', sortable: true },
    {
      key: 'weightage',
      label: 'Weightage',
      render: (type) => <Badge variant="outline">{type.weightage}%</Badge>,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (type) => (
        <Badge variant={type.is_active ? 'success' : 'destructive'}>
          {type.is_active ? 'Active' : 'Inactive'}
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
        <h1 className="text-3xl font-bold">Exam Types</h1>
        <p className="text-muted-foreground">Manage different types of examinations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Types List</CardTitle>
          <CardDescription>Configure exam types and their weightages</CardDescription>
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
            searchPlaceholder="Search exam types..."
            addNewLabel="Add Exam Type"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamTypesPage;
