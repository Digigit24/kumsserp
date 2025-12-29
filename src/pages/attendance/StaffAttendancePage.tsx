/**
 * Staff Attendance Page
 */

import { useState } from 'react';
import { useStaffAttendance } from '../../hooks/useAttendance';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import type { StaffAttendanceFilters } from '../../types/attendance.types';

const StaffAttendancePage = () => {
  const [filters, setFilters] = useState<StaffAttendanceFilters>({
    page: 1,
    page_size: 10,
  });

  // Fetch staff attendance data using the hook
  const { data, isLoading, error, refetch } = useStaffAttendance(filters);

  const columns: Column<any>[] = [
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
        data={data || { count: 0, next: null, previous: null, results: [] }}
        isLoading={isLoading}
        error={error?.message || null}
        onRefresh={() => refetch()}
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
