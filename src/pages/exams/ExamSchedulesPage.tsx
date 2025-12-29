/**
 * Exam Schedules Page
 * Manage exam schedules and timetables
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useExamSchedules } from '../../hooks/useExamination';
import { ExamScheduleForm } from './forms';

const ExamSchedulesPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);

  // Fetch exam schedules using real API
  const { data, isLoading, error, refetch } = useExamSchedules(filters);

  const columns: Column<any>[] = [
    {
      key: 'date',
      label: 'Date',
      render: (schedule) => new Date(schedule.date).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'start_time',
      label: 'Time',
      render: (schedule) => `${schedule.start_time} - ${schedule.end_time}`,
    },
    {
      key: 'max_marks',
      label: 'Max Marks',
      render: (schedule) => <Badge variant="outline">{schedule.max_marks}</Badge>,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (schedule) => (
        <Badge variant={schedule.is_active ? 'success' : 'destructive'}>
          {schedule.is_active ? 'Active' : 'Inactive'}
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

  const handleAddNew = () => {
    setSelectedSchedule(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (schedule: ExamSchedule) => {
    setSelectedSchedule(schedule);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = (data: Partial<ExamSchedule>) => {
    console.log('Form submitted:', data);
    setIsSidebarOpen(false);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedSchedule(null);
  };

  return (
    <div className="">
      <DataTable
        title="Exam Schedules"
        description="View and manage all exam schedules"
        columns={columns}
        data={data}
        isLoading={isLoading}
        error={error?.message}
        onRefresh={refetch}
        onAdd={handleAddNew}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search schedules..."
        addButtonLabel="Add Schedule"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Exam Schedule' : 'Exam Schedule'}
        mode={sidebarMode}
        width="xl"
      >
        {sidebarMode === 'view' && selectedSchedule ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
              <p className="mt-1 text-lg">{new Date(selectedSchedule.date).toLocaleDateString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Start Time</h3>
                <p className="mt-1">{selectedSchedule.start_time}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">End Time</h3>
                <p className="mt-1">{selectedSchedule.end_time}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Maximum Marks</h3>
              <p className="mt-1">{selectedSchedule.max_marks}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedSchedule.is_active ? 'success' : 'destructive'}>
                  {selectedSchedule.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            <div className="pt-4">
              <Button onClick={handleEdit}>Edit</Button>
            </div>
          </div>
        ) : (
          <ExamScheduleForm
            schedule={sidebarMode === 'edit' ? selectedSchedule : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default ExamSchedulesPage;
