/**
 * Grade Sheets Page
 */

import { useState } from 'react';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';

interface GradeSheet {
  id: number;
  student_name: string;
  student_roll_number: string;
  total_marks: number;
  percentage: number;
  grade: string;
  status: string;
}

const GradeSheetsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const mockData = { count: 0, next: null, previous: null, results: [] as GradeSheet[] };

  const columns: Column<GradeSheet>[] = [
    { key: 'student_roll_number', label: 'Roll No', sortable: true },
    { key: 'student_name', label: 'Student Name', sortable: true },
    { key: 'total_marks', label: 'Total Marks', sortable: true },
    {
      key: 'percentage',
      label: 'Percentage',
      render: (sheet) => <Badge variant="outline">{sheet.percentage}%</Badge>,
    },
    {
      key: 'grade',
      label: 'Grade',
      render: (sheet) => <Badge variant="default">{sheet.grade}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (sheet) => (
        <Badge variant={sheet.status === 'Passed' ? 'success' : 'destructive'}>
          {sheet.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grade Sheets</h1>
        <p className="text-muted-foreground">View student grade sheets</p>
      </div>

      <DataTable
        title="Grade Sheets"
        columns={columns}
        data={mockData}
        isLoading={false}
        error={null}
        onRefresh={() => {}}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search students..."
      />
    </div>
  );
};

export default GradeSheetsPage;
