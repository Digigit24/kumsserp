/*
 * Marks Registers Page
 * View consolidated marks registers
 */
import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useMarksRegisters, useCreateMarksRegister, useUpdateMarksRegister, useDeleteMarksRegister } from '../../hooks/useExamination';
import { MarksRegisterForm } from './forms';
import { toast } from 'sonner';

const MarksRegistersPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedRegister, setSelectedRegister] = useState<any | null>(null);

  // Fetch marks registers using real API
  const { data, isLoading, error, refetch } = useMarksRegisters(filters);
  const createMutation = useCreateMarksRegister();
  const updateMutation = useUpdateMarksRegister();
  const deleteMutation = useDeleteMarksRegister();

  const columns: Column<any>[] = [
    { key: 'class_name', label: 'Class', sortable: true },
    { key: 'subject_name', label: 'Subject', sortable: true },
    {
      key: 'total_students',
      label: 'Total Students',
      render: (register) => <Badge variant="outline">{register.total_students}</Badge>,
      sortable: true,
    },
    {
      key: 'students_appeared',
      label: 'Appeared',
      render: (register) => <Badge variant="secondary">{register.students_appeared}</Badge>,
      sortable: true,
    },
    {
      key: 'students_passed',
      label: 'Passed',
      render: (register) => <Badge variant="success">{register.students_passed}</Badge>,
      sortable: true,
    },
    {
      key: 'pass_percentage',
      label: 'Pass %',
      render: (register) => (
        <Badge variant={register.pass_percentage >= 75 ? 'success' : 'warning'}>
          {register.pass_percentage.toFixed(1)}%
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'is_verified',
      label: 'Verified',
      render: (register) => (
        <Badge variant={register.is_verified ? 'success' : 'outline'}>
          {register.is_verified ? 'Yes' : 'No'}
        </Badge>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'is_verified',
      label: 'Verification Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'true', label: 'Verified' },
        { value: 'false', label: 'Unverified' },
      ],
    },
  ];

  const handleAddNew = () => {
    setSelectedRegister(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (register: MarksRegister) => {
    setSelectedRegister(register);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (sidebarMode === 'edit' && selectedRegister?.id) {
        await updateMutation.mutateAsync({ id: selectedRegister.id, data });
        toast.success('Marks register updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Marks register created successfully');
      }
      setIsSidebarOpen(false);
      refetch();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to save marks register';
      toast.error(errorMessage);
      console.error('Failed to save marks register:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedRegister?.id) return;

    if (window.confirm('Are you sure you want to delete this marks register?')) {
      try {
        await deleteMutation.mutateAsync(selectedRegister.id);
        toast.success('Marks register deleted successfully');
        setIsSidebarOpen(false);
        refetch();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete marks register');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedRegister(null);
  };

  return (
    <div className="">
      <DataTable
        title="Marks Registers"
        description="View and manage exam marks registers"
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
        searchPlaceholder="Search registers..."
        addButtonLabel="Create Register"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Marks Register' : `${selectedRegister?.class_name || 'Marks'} Register`}
        mode={sidebarMode}
        width="xl"
      >
        {sidebarMode === 'view' && selectedRegister ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Class</h3>
                <p className="mt-1 text-lg">{selectedRegister.class_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                <p className="mt-1 text-lg">{selectedRegister.subject_name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Students</h3>
                <p className="mt-1 text-2xl font-bold">{selectedRegister.total_students}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Students Appeared</h3>
                <p className="mt-1 text-2xl font-bold">{selectedRegister.students_appeared}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Students Passed</h3>
                <p className="mt-1 text-2xl font-bold text-green-600">{selectedRegister.students_passed}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Pass Percentage</h3>
                <p className="mt-1 text-2xl font-bold text-green-600">{selectedRegister.pass_percentage.toFixed(1)}%</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Highest Marks</h3>
                <p className="mt-1 text-lg font-semibold">{selectedRegister.highest_marks}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Lowest Marks</h3>
                <p className="mt-1 text-lg font-semibold">{selectedRegister.lowest_marks}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Average Marks</h3>
                <p className="mt-1 text-lg font-semibold">{selectedRegister.average_marks.toFixed(2)}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Verified</h3>
              <p className="mt-1">
                <Badge variant={selectedRegister.is_verified ? 'success' : 'outline'}>
                  {selectedRegister.is_verified ? 'Verified' : 'Unverified'}
                </Badge>
              </p>
            </div>
            {selectedRegister.verified_by && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Verified By</h3>
                <p className="mt-1">{selectedRegister.verified_by}</p>
              </div>
            )}
            {selectedRegister.remarks && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Remarks</h3>
                <p className="mt-1">{selectedRegister.remarks}</p>
              </div>
            )}
            <div className="pt-4 flex gap-2">
              <Button onClick={handleEdit}>Edit</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        ) : (
          <MarksRegisterForm
            register={sidebarMode === 'edit' ? selectedRegister : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default MarksRegistersPage;
