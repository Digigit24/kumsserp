/**
 * Exam Types Page
 */

import { useState } from 'react';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';

interface ExamType {
  id: number;
  name: string;
  code: string;
  college_name: string;
  weightage: number;
  is_active: boolean;
}

const ExamTypesPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});

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

      <DataTable
        title="Exam Types List"
        description="Configure exam types and their weightages"
        columns={columns}
        data={mockData}
        isLoading={false}
        error={null}
        onRefresh={() => {}}
        onAdd={() => {}}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search exam types..."
        addButtonLabel="Add Exam Type"
      />
    </div>
  );
};

export default ExamTypesPage;
