/**
 * Staff Attendance Page
 */

import { useState } from 'react';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';

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
  const [filters, setFilters] = useState<Record<string, any>>({});
  const mockData = { count: 0, next: null, previous: null, results: [] as StaffAttendanceRecord[] };

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

      <DataTable
        title="Staff Attendance Records"
        columns={columns}
        data={mockData}
        isLoading={false}
        error={null}
        onRefresh={() => {}}
        onAdd={() => {}}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search staff..."
        addButtonLabel="Mark Attendance"
      />
    </div>
  );
};

export default StaffAttendancePage;
