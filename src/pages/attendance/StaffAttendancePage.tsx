/**
 * Staff Attendance Page
 */

import { useState } from 'react';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface StaffAttendanceRecord {
  id: number;
  staff_name: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: string;
  working_hours: number | null;
  is_verified: boolean;
}

const StaffAttendancePage = () => {
  const [filters] = useState({ page: 1, page_size: 20 });
  const mockData = { count: 0, results: [] as StaffAttendanceRecord[] };

  const columns: Column<StaffAttendanceRecord>[] = [
    { key: 'staff_name', label: 'Staff Name', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'check_in_time', label: 'Check In', sortable: true },
    { key: 'check_out_time', label: 'Check Out', sortable: true },
    {
      key: 'working_hours',
      label: 'Hours',
      render: (record) => record.working_hours ? `${record.working_hours}h` : '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (record) => {
        const variant = record.status === 'present' ? 'success' : 'destructive';
        return <Badge variant={variant}>{record.status}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staff Attendance</h1>
        <p className="text-muted-foreground">Manage staff attendance records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockData.results}
            totalCount={mockData.count}
            currentPage={filters.page}
            pageSize={filters.page_size}
            searchPlaceholder="Search staff..."
            addNewLabel="Mark Attendance"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffAttendancePage;
