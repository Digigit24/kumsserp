/**
 * Fee Installments Page
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useFeeInstallments, useCreateFeeInstallment, useUpdateFeeInstallment, useDeleteFeeInstallment } from '../../hooks/useFees';
import { FeeInstallment } from '../../types/fees.types';
import { FeeInstallmentForm } from './forms/FeeInstallmentForm';
import { toast } from 'sonner';

const FeeInstallmentsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedInstallment, setSelectedInstallment] = useState<FeeInstallment | null>(null);

  const { data, isLoading, error, refetch } = useFeeInstallments(filters);
  const createInstallment = useCreateFeeInstallment();
  const updateInstallment = useUpdateFeeInstallment();
  const deleteInstallment = useDeleteFeeInstallment();

  const columns: Column<FeeInstallment>[] = [
    { key: 'fee_structure_name', label: 'Fee Structure', sortable: false },
    { key: 'installment_number', label: 'Number', sortable: true },
    { key: 'installment_name', label: 'Name', sortable: true },
    { key: 'amount', label: 'Amount', render: (inst) => `₹${inst.amount}` },
    { key: 'due_date', label: 'Due Date', sortable: true },
    {
      key: 'is_active',
      label: 'Status',
      render: (inst) => (
        <Badge variant={inst.is_active ? 'success' : 'destructive'}>
          {inst.is_active ? 'Active' : 'Inactive'}
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
    setSelectedInstallment(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (installment: FeeInstallment) => {
    setSelectedInstallment(installment);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (data: Partial<FeeInstallment>) => {
    try {
      if (sidebarMode === 'create') {
        await createInstallment.mutateAsync(data);
        toast.success('Fee installment created successfully');
      } else if (sidebarMode === 'edit' && selectedInstallment) {
        await updateInstallment.mutateAsync({ id: selectedInstallment.id, data });
        toast.success('Fee installment updated successfully');
      }
      setIsSidebarOpen(false);
      setSelectedInstallment(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred');
      console.error('Form submission error:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedInstallment) return;

    if (confirm('Are you sure you want to delete this fee installment?')) {
      try {
        await deleteInstallment.mutateAsync(selectedInstallment.id);
        toast.success('Fee installment deleted successfully');
        setIsSidebarOpen(false);
        setSelectedInstallment(null);
        refetch();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete fee installment');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedInstallment(null);
  };

  return (
    <div className="">
      <DataTable
        title="Fee Installments List"
        description="View and manage all fee installments"
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
        searchPlaceholder="Search fee installments..."
        addButtonLabel="Add Fee Installment"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Fee Installment' : selectedInstallment?.installment_name || 'Fee Installment'}
        mode={sidebarMode}
      >
        {sidebarMode === 'view' && selectedInstallment ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Fee Structure</h3>
              <p className="mt-1 text-lg">{selectedInstallment.fee_structure_name || `ID: ${selectedInstallment.fee_structure}`}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Number</h3>
                <p className="mt-1 text-lg font-semibold">{selectedInstallment.installment_number}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="mt-1 text-lg font-semibold">{selectedInstallment.installment_name}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
              <p className="mt-1 text-2xl font-bold text-primary">₹{selectedInstallment.amount}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
              <p className="mt-1 text-lg">{selectedInstallment.due_date}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedInstallment.is_active ? 'success' : 'destructive'}>
                  {selectedInstallment.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEdit} className="flex-1">Edit</Button>
              <Button onClick={handleDelete} variant="destructive" className="flex-1">Delete</Button>
            </div>
          </div>
        ) : (
          <FeeInstallmentForm
            feeInstallment={sidebarMode === 'edit' ? selectedInstallment : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default FeeInstallmentsPage;
