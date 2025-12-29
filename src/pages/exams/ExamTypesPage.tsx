/**
 * Exam Types Page
 * Manage different types of examinations
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useExamTypes, useCreateExamType, useUpdateExamType, useDeleteExamType } from '../../hooks/useExamination';
import { ExamType, ExamTypeListItem } from '../../types/examination.types';
import { ExamTypeForm } from './forms';
import { toast } from 'sonner';

const ExamTypesPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedExamType, setSelectedExamType] = useState<ExamType | null>(null);

  // Fetch exam types using real API
  const { data, isLoading, error, refetch } = useExamTypes(filters);
  const createMutation = useCreateExamType();
  const updateMutation = useUpdateExamType();
  const deleteMutation = useDeleteExamType();

  const columns: Column<ExamTypeListItem>[] = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'name', label: 'Exam Type', sortable: true },
    {
      key: 'description',
      label: 'Description',
      render: (type) => (
        <span className="text-sm text-muted-foreground">
          {type.description || '-'}
        </span>
      ),
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

  const handleAddNew = () => {
    setSelectedExamType(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (examType: ExamTypeListItem) => {
    setSelectedExamType(examType as any);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (data: Partial<ExamType>) => {
    try {
      if (sidebarMode === 'edit' && selectedExamType?.id) {
        await updateMutation.mutateAsync({
          id: selectedExamType.id,
          data: data as any,
        });
        toast.success('Exam type updated successfully');
      } else {
        await createMutation.mutateAsync(data as any);
        toast.success('Exam type created successfully');
      }
      setIsSidebarOpen(false);
      setSelectedExamType(null);
      refetch();
    } catch (error: any) {
      console.error('Failed to save exam type:', error);
      toast.error(error?.message || 'Failed to save exam type');
    }
  };

  const handleDelete = async () => {
    if (!selectedExamType?.id) return;

    if (confirm('Are you sure you want to delete this exam type?')) {
      try {
        await deleteMutation.mutateAsync(selectedExamType.id);
        toast.success('Exam type deleted successfully');
        setIsSidebarOpen(false);
        setSelectedExamType(null);
        refetch();
      } catch (error: any) {
        console.error('Failed to delete exam type:', error);
        toast.error(error?.message || 'Failed to delete exam type');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedExamType(null);
  };

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold">Exam Types</h1>
        <p className="text-muted-foreground">Manage different types of examinations</p>
      </div>

      <DataTable
        title="Exam Types List"
        description="Configure exam types and their weightages"
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
        searchPlaceholder="Search exam types..."
        addButtonLabel="Add Exam Type"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Exam Type' : selectedExamType?.name || 'Exam Type'}
        mode={sidebarMode}
        width="lg"
      >
        {sidebarMode === 'view' && selectedExamType ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Code</h3>
              <p className="mt-1 text-lg">{selectedExamType.code}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="mt-1 text-lg">{selectedExamType.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1">{selectedExamType.description || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedExamType.is_active ? 'success' : 'destructive'}>
                  {selectedExamType.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            <div className="pt-4 flex gap-2">
              <Button onClick={handleEdit}>Edit</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        ) : (
          <ExamTypeForm
            examType={sidebarMode === 'edit' ? selectedExamType : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default ExamTypesPage;
