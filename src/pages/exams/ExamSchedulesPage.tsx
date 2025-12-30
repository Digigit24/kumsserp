/**
 * Exam Schedules Page
 * Manage exam schedules and timetables
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useExamSchedules, useCreateExamSchedule, useUpdateExamSchedule, useDeleteExamSchedule } from '../../hooks/useExamination';
import { ExamScheduleForm } from './forms';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

const ExamSchedulesPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);

  // Check if user is student (students can only view, not add/edit/delete)
  const isStudent = user?.userType === 'student';

  // Fetch exam schedules using real API
  const { data, isLoading, error, refetch } = useExamSchedules(filters);
  const createMutation = useCreateExamSchedule();
  const updateMutation = useUpdateExamSchedule();
  const deleteMutation = useDeleteExamSchedule();

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

  const handleFormSubmit = async (data: Partial<ExamSchedule>) => {
    try {
      if (sidebarMode === 'edit' && selectedSchedule?.id) {
        await updateMutation.mutateAsync({ id: selectedSchedule.id, data: data as any });
        toast.success('Exam schedule updated successfully');
      } else {
        await createMutation.mutateAsync(data as any);
        toast.success('Exam schedule created successfully');
      }
      setIsSidebarOpen(false);
      refetch();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to save exam schedule';
      toast.error(errorMessage);
      console.error('Failed to save exam schedule:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedSchedule?.id) return;

    if (window.confirm('Are you sure you want to delete this exam schedule?')) {
      try {
        await deleteMutation.mutateAsync(selectedSchedule.id);
        toast.success('Exam schedule deleted successfully');
        setIsSidebarOpen(false);
        refetch();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete exam schedule');
      }
    }
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
        onAdd={isStudent ? undefined : handleAddNew}
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
            {!isStudent && (
              <div className="pt-4 flex gap-2">
                <Button onClick={handleEdit}>Edit</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </div>
            )}
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
