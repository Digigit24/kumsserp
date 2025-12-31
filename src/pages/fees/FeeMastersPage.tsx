/**
 * Fee Masters Page
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useFeeMasters, useCreateFeeMaster, useUpdateFeeMaster, useDeleteFeeMaster } from '../../hooks/useFees';
import { FeeMaster } from '../../types/fees.types';
import { FeeMasterForm } from './forms';
import { toast } from 'sonner';

const FeeMastersPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedFeeMaster, setSelectedFeeMaster] = useState<any | null>(null);

  // Fetch fee masters using real API
  const { data, isLoading, error, refetch } = useFeeMasters(filters);
  const createFeeMaster = useCreateFeeMaster();
  const updateFeeMaster = useUpdateFeeMaster();
  const deleteFeeMaster = useDeleteFeeMaster();

  const columns: Column<FeeMaster>[] = [
    {
      key: 'program_name',
      label: 'Program',
      sortable: false,
      render: (fee) => fee.program_name || `ID: ${fee.program}`
    },
    {
      key: 'academic_year_name',
      label: 'Academic Year',
      sortable: false,
      render: (fee) => fee.academic_year_label || fee.academic_year_name || `ID: ${fee.academic_year}`
    },
    {
      key: 'fee_type_name',
      label: 'Fee Type',
      sortable: false,
      render: (fee) => fee.fee_type_name || `ID: ${fee.fee_type}`
    },
    { key: 'semester', label: 'Semester', sortable: true },
    { key: 'amount', label: 'Amount', render: (fee) => `₹${fee.amount}` },
    {
      key: 'is_active',
      label: 'Status',
      render: (fee) => <Badge variant={fee.is_active ? 'success' : 'destructive'}>{fee.is_active ? 'Active' : 'Inactive'}</Badge>,
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
    setSelectedFeeMaster(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (feeMaster: FeeMaster) => {
    setSelectedFeeMaster(feeMaster);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (data: Partial<FeeMaster>) => {
    try {
      if (sidebarMode === 'create') {
        await createFeeMaster.mutateAsync(data);
        toast.success('Fee master created successfully');
      } else if (sidebarMode === 'edit' && selectedFeeMaster) {
        await updateFeeMaster.mutateAsync({ id: selectedFeeMaster.id, data });
        toast.success('Fee master updated successfully');
      }
      setIsSidebarOpen(false);
      setSelectedFeeMaster(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred');
      console.error('Form submission error:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedFeeMaster) return;

    if (confirm('Are you sure you want to delete this fee master?')) {
      try {
        await deleteFeeMaster.mutateAsync(selectedFeeMaster.id);
        toast.success('Fee master deleted successfully');
        setIsSidebarOpen(false);
        setSelectedFeeMaster(null);
        refetch();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete fee master');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedFeeMaster(null);
  };

  return (
    <div className="">
      <DataTable
        title="Fee Masters List"
        description="View and manage all fee masters"
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
        searchPlaceholder="Search fees..."
        addButtonLabel="Add Fee Master"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Fee Master' : selectedFeeMaster?.name || 'Fee Master'}
        mode={sidebarMode}
      >
        {sidebarMode === 'view' && selectedFeeMaster ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Program</h3>
                <p className="mt-1 text-lg">{selectedFeeMaster.program_name || `ID: ${selectedFeeMaster.program}`}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Academic Year</h3>
                <p className="mt-1 text-lg">{selectedFeeMaster.academic_year_name || `ID: ${selectedFeeMaster.academic_year}`}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Fee Type</h3>
                <p className="mt-1 text-lg">{selectedFeeMaster.fee_type_name || `ID: ${selectedFeeMaster.fee_type}`}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Semester</h3>
                <p className="mt-1 text-lg font-semibold">{selectedFeeMaster.semester}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
              <p className="mt-1 text-2xl font-bold text-primary">₹{selectedFeeMaster.amount}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedFeeMaster.is_active ? 'success' : 'destructive'}>
                  {selectedFeeMaster.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEdit} className="flex-1">Edit</Button>
              <Button onClick={handleDelete} variant="destructive" className="flex-1">Delete</Button>
            </div>
          </div>
        ) : (
          <FeeMasterForm
            feeMaster={sidebarMode === 'edit' ? selectedFeeMaster : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default FeeMastersPage;
