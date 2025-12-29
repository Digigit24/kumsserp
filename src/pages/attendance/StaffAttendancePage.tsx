/**
 * Staff Attendance Page
 */

import { useState } from 'react';
import { useStaffAttendance } from '../../hooks/useAttendance';
import { StaffAttendanceForm } from '../../components/attendance/StaffAttendanceForm';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Calendar, Edit } from 'lucide-react';
import type { StaffAttendanceFilters, StaffAttendance } from '../../types/attendance.types';

const StaffAttendancePage = () => {
  const [filters, setFilters] = useState<StaffAttendanceFilters>({
    page: 1,
    page_size: 10,
  });
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<StaffAttendance | null>(null);

  // Fetch staff attendance data using the hook
  const { data, isLoading, error, refetch } = useStaffAttendance(filters);

  const handleEdit = (attendance: any) => {
    setSelectedAttendance(attendance);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedAttendance(null);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    refetch();
  };

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
    {
      key: 'actions',
      label: 'Actions',
      render: (record) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEdit(record)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff Attendance</h1>
          <p className="text-muted-foreground">Manage staff attendance records</p>
        </div>
        <Button onClick={handleAdd}>
          <Calendar className="h-4 w-4 mr-2" />
          Mark Attendance
        </Button>
      </div>

      <StaffAttendanceForm
        open={formOpen}
        onOpenChange={setFormOpen}
        attendance={selectedAttendance}
        onSuccess={handleFormSuccess}
      />

      <DataTable
        title="Staff Attendance Records"
        columns={columns}
        data={data || { count: 0, next: null, previous: null, results: [] }}
        isLoading={isLoading}
        error={error?.message || null}
        onRefresh={() => refetch()}
        onAdd={handleAdd}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search staff..."
        addButtonLabel="Mark Attendance"
      />
    </div>
  );
};

export default StaffAttendancePage;
