/**
 * Deductions Page - Manage HR deductions
 */

import { useState } from 'react';
import { Column, DataTable } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { useDeductions, useCreateDeduction, useUpdateDeduction, useDeleteDeduction } from '../../hooks/useHR';
import { DeductionForm } from './forms/DeductionForm';
import { toast } from 'sonner';

const DeductionsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedDeduction, setSelectedDeduction] = useState<any | null>(null);

  const { data, isLoading, error, refetch } = useDeductions(filters);
  const createDeduction = useCreateDeduction();
  const updateDeduction = useUpdateDeduction();
  const deleteDeduction = useDeleteDeduction();

  const columns: Column<any>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (item) => (
        <span className="font-semibold text-primary">{item.name}</span>
      ),
      sortable: true,
    },
    {
      key: 'code',
      label: 'Code',
      render: (item) => item.code,
      sortable: true,
    },
    {
      key: 'deduction_type',
      label: 'Type',
      render: (item) => item.deduction_type,
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (item) => `₹${item.amount}`,
    },
    {
      key: 'percentage',
      label: 'Percentage',
      render: (item) => `${item.percentage}%`,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (item) => (
        <Badge variant={item.is_active ? 'default' : 'secondary'}>
          {item.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const handleRowClick = (item: any) => {
    setSelectedDeduction(item);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleAddNew = () => {
    setSelectedDeduction(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (sidebarMode === 'create') {
        await createDeduction.mutateAsync(formData);
        toast.success('Deduction created successfully');
      } else {
        await updateDeduction.mutateAsync({ id: selectedDeduction.id, data: formData });
        toast.success('Deduction updated successfully');
      }
      setIsSidebarOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save deduction');
    }
  };

  const handleDelete = async () => {
    if (!selectedDeduction) return;

    if (window.confirm('Are you sure you want to delete this deduction?')) {
      try {
        await deleteDeduction.mutateAsync(selectedDeduction.id);
        toast.success('Deduction deleted successfully');
        setIsSidebarOpen(false);
        refetch();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete deduction');
      }
    }
  };

  return (
    <div>
      <DataTable
        title="Deductions"
        description="Manage HR deductions"
        columns={columns}
        data={data || null}
        isLoading={isLoading}
        error={error?.message || null}
        filters={filters}
        onFiltersChange={setFilters}
        onRowClick={handleRowClick}
        onRefresh={refetch}
        onAdd={handleAddNew}
        addButtonLabel="Add Deduction"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title={sidebarMode === 'create' ? 'Create Deduction' : sidebarMode === 'edit' ? 'Edit Deduction' : 'Deduction Details'}
        mode={sidebarMode}
        onEdit={handleEdit}
        onDelete={handleDelete}
        data={selectedDeduction}
      >
        {(sidebarMode === 'create' || sidebarMode === 'edit') && (
          <DeductionForm
            deduction={sidebarMode === 'edit' ? selectedDeduction : null}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsSidebarOpen(false)}
          />
        )}

        {sidebarMode === 'view' && selectedDeduction && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-base font-semibold">{selectedDeduction.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Code</label>
              <p className="text-base">{selectedDeduction.code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <p className="text-base">{selectedDeduction.deduction_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Amount</label>
              <p className="text-base">₹{selectedDeduction.amount}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Percentage</label>
              <p className="text-base">{selectedDeduction.percentage}%</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Badge variant={selectedDeduction.is_active ? 'default' : 'secondary'}>
                {selectedDeduction.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        )}
      </DetailSidebar>
    </div>
  );
};

export default DeductionsPage;
