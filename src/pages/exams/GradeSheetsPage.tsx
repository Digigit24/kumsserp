/**
 * Grade Sheets Page
 * View grade sheets for students
 */

import { useState } from 'react';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

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
  const [filters] = useState({ page: 1, page_size: 20 });
  const mockData = { count: 0, results: [] as GradeSheet[] };

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

      <Card>
        <CardHeader>
          <CardTitle>Grade Sheets</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockData.results}
            totalCount={mockData.count}
            currentPage={filters.page}
            pageSize={filters.page_size}
            searchPlaceholder="Search students..."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeSheetsPage;
