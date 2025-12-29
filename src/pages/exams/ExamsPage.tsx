/**
 * Exams Page
 * Manage examinations in the system
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useExams, useCreateExam, useUpdateExam, useDeleteExam } from '../../hooks/useExamination';
import { Exam, ExamListItem } from '../../types/examination.types';
import { ExamForm } from './forms';
import { toast } from 'sonner';

const ExamsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // Fetch exams using real API
  const { data, isLoading, error, refetch } = useExams(filters);
  const createMutation = useCreateExam();
  const updateMutation = useUpdateExam();
  const deleteMutation = useDeleteExam();

  const columns: Column<ExamListItem>[] = [
    { key: 'name', label: 'Exam Name', sortable: true },
    {
      key: 'exam_type_name',
      label: 'Exam Type',
      render: (exam) => exam.exam_type_name,
    },
    {
      key: 'exam_date_start',
      label: 'Start Date',
      render: (exam) => new Date(exam.exam_date_start).toLocaleDateString(),
    },
    {
      key: 'exam_date_end',
      label: 'End Date',
      render: (exam) => new Date(exam.exam_date_end).toLocaleDateString(),
    },
    {
      key: 'is_published',
      label: 'Published',
      render: (exam) => (
        <Badge variant={exam.is_published ? 'success' : 'secondary'}>
          {exam.is_published ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (exam) => (
        <Badge variant={exam.is_active ? 'success' : 'destructive'}>
          {exam.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'is_published',
      label: 'Published Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'true', label: 'Published' },
        { value: 'false', label: 'Draft' },
      ],
    },
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
    setSelectedExam(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (exam: ExamListItem) => {
    // Fetch full exam details when clicking a row
    setSelectedExam(exam as any);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (data: Partial<Exam>) => {
    try {
      if (sidebarMode === 'edit' && selectedExam?.id) {
        // Update existing exam
        await updateMutation.mutateAsync({
          id: selectedExam.id,
          data: data as any,
        });
        toast.success('Exam updated successfully');
      } else {
        // Create new exam
        await createMutation.mutateAsync(data as any);
        toast.success('Exam created successfully');
      }
      setIsSidebarOpen(false);
      setSelectedExam(null);
      refetch();
    } catch (error: any) {
      console.error('Failed to save exam:', error);
      toast.error(error?.message || 'Failed to save exam');
    }
  };

  const handleDelete = async () => {
    if (!selectedExam?.id) return;

    if (confirm('Are you sure you want to delete this exam?')) {
      try {
        await deleteMutation.mutateAsync(selectedExam.id);
        toast.success('Exam deleted successfully');
        setIsSidebarOpen(false);
        setSelectedExam(null);
        refetch();
      } catch (error: any) {
        console.error('Failed to delete exam:', error);
        toast.error(error?.message || 'Failed to delete exam');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedExam(null);
  };

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold">Examinations</h1>
        <p className="text-muted-foreground">Manage examinations and exam schedules</p>
      </div>

      <DataTable
        title="Exam List"
        description="View and manage all examinations"
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
        searchPlaceholder="Search exams..."
        addButtonLabel="Add Exam"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Exam' : selectedExam?.name || 'Exam'}
        mode={sidebarMode}
        width="xl"
      >
        {sidebarMode === 'view' && selectedExam ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Exam Name</h3>
              <p className="mt-1 text-lg">{selectedExam.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Exam Code</h3>
              <p className="mt-1">{(selectedExam as any).code || 'N/A'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                <p className="mt-1">{new Date((selectedExam as any).exam_date_start || '').toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                <p className="mt-1">{new Date((selectedExam as any).exam_date_end || '').toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Published</h3>
              <p className="mt-1">
                <Badge variant={selectedExam.is_published ? 'success' : 'secondary'}>
                  {selectedExam.is_published ? 'Published' : 'Draft'}
                </Badge>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedExam.is_active ? 'success' : 'destructive'}>
                  {selectedExam.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            <div className="pt-4 flex gap-2">
              <Button onClick={handleEdit}>Edit</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        ) : (
          <ExamForm
            exam={sidebarMode === 'edit' ? selectedExam : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default ExamsPage;
