/**
 * Fee Fines Page
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useFeeFines, useCreateFeeFine, useUpdateFeeFine, useDeleteFeeFine } from '../../hooks/useFees';
import { FeeFineForm } from './forms';
import { toast } from 'sonner';

const FeeFinesPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedFine, setSelectedFine] = useState<any | null>(null);

  // Fetch fee fines using real API
  const { data, isLoading, error, refetch } = useFeeFines(filters);
  const createFeeFine = useCreateFeeFine();
  const updateFeeFine = useUpdateFeeFine();
  const deleteFeeFine = useDeleteFeeFine();

  const columns: Column<any>[] = [
    { key: 'name', label: 'Fine Name', sortable: true },
    {
      key: 'fine_type',
      label: 'Type',
      render: (fine) => (
        <Badge variant="secondary">
          {fine.fine_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'calculation_type',
      label: 'Calculation',
      render: (fine) => (
        <Badge variant="outline">
          {fine.calculation_type === 'per_day' ? 'Per Day' : fine.calculation_type.replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (fine) => (
        <span className="font-semibold">
          {fine.calculation_type === 'percentage' ? `${fine.amount}%` : `₹${fine.amount}`}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'grace_period_days',
      label: 'Grace Period',
      render: (fine) => `${fine.grace_period_days} days`,
      sortable: true,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (fine) => (
        <Badge variant={fine.is_active ? 'success' : 'destructive'}>
          {fine.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'fine_type',
      label: 'Fine Type',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'late_payment', label: 'Late Payment' },
        { value: 'damage', label: 'Damage' },
        { value: 'library', label: 'Library' },
        { value: 'other', label: 'Other' },
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
    setSelectedFine(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (fine: FeeFine) => {
    setSelectedFine(fine);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (data: any) => {
    console.log('handleFormSubmit called with data:', data);
    try {
      if (sidebarMode === 'create') {
        console.log('Creating fee fine...');
        const result = await createFeeFine.mutateAsync(data);
        console.log('Create result:', result);
        toast.success('Fee fine created successfully');
      } else if (sidebarMode === 'edit' && selectedFine) {
        console.log('Updating fee fine...');
        const result = await updateFeeFine.mutateAsync({ id: selectedFine.id, data });
        console.log('Update result:', result);
        toast.success('Fee fine updated successfully');
      }
      setIsSidebarOpen(false);
      setSelectedFine(null);
      refetch();
    } catch (err: any) {
      console.error('Form submission error:', err);
      toast.error(err?.message || err?.error || 'An error occurred');
    }
  };

  const handleDelete = async () => {
    if (!selectedFine) return;

    if (confirm('Are you sure you want to delete this fee fine?')) {
      try {
        await deleteFeeFine.mutateAsync(selectedFine.id);
        toast.success('Fee fine deleted successfully');
        setIsSidebarOpen(false);
        setSelectedFine(null);
        refetch();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete fee fine');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedFine(null);
  };

  return (
    <div className="">
      <DataTable
        title="Fee Fines"
        description="View and manage fee fines"
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
        searchPlaceholder="Search fines..."
        addButtonLabel="Add Fine"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Fee Fine' : selectedFine?.name || 'Fee Fine'}
        mode={sidebarMode}
      >
        {sidebarMode === 'view' && selectedFine ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="mt-1 text-lg font-semibold">{selectedFine.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Fine Type</h3>
                <p className="mt-1">
                  <Badge variant="secondary">
                    {selectedFine.fine_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Calculation Type</h3>
                <p className="mt-1">
                  <Badge variant="outline">
                    {selectedFine.calculation_type === 'per_day' ? 'Per Day' : selectedFine.calculation_type.replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Fine Amount</h3>
              <p className="mt-1 text-2xl font-bold text-red-600">
                {selectedFine.calculation_type === 'percentage'
                  ? `${selectedFine.amount}%`
                  : `₹${selectedFine.amount}`}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Grace Period</h3>
                <p className="mt-1">{selectedFine.grace_period_days} days</p>
              </div>
              {selectedFine.max_fine_amount && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Max Fine Amount</h3>
                  <p className="mt-1">₹{selectedFine.max_fine_amount.toLocaleString()}</p>
                </div>
              )}
            </div>
            {selectedFine.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1">{selectedFine.description}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedFine.is_active ? 'success' : 'destructive'}>
                  {selectedFine.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEdit} className="flex-1">Edit</Button>
              <Button onClick={handleDelete} variant="destructive" className="flex-1">Delete</Button>
            </div>
          </div>
        ) : (
          <FeeFineForm
            feeFine={sidebarMode === 'edit' ? selectedFine : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default FeeFinesPage;
