/**
 * Fee Collections Page
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useFeeCollections, useCreateFeeCollection, useUpdateFeeCollection, useDeleteFeeCollection } from '../../hooks/useFees';
import type { FeeCollection, FeeCollectionCreateInput } from '../../types/fees.types';
import { FeeCollectionForm } from './forms';
import { toast } from 'sonner';

const FeeCollectionsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedCollection, setSelectedCollection] = useState<any | null>(null);

  // Fetch fee collections using real API
  const { data, isLoading, error, refetch } = useFeeCollections(filters);
  const createFeeCollection = useCreateFeeCollection();
  const updateFeeCollection = useUpdateFeeCollection();
  const deleteFeeCollection = useDeleteFeeCollection();

  const columns: Column<any>[] = [
    { key: 'student_name', label: 'Student Name', sortable: false },
    { key: 'payment_date', label: 'Payment Date', sortable: true },
    {
      key: 'amount',
      label: 'Amount',
      render: (collection) => <span className="font-semibold">₹{parseFloat(collection.amount).toLocaleString()}</span>,
      sortable: true,
    },
    {
      key: 'payment_method',
      label: 'Payment Method',
      render: (collection) => (
        <Badge variant="secondary">
          {collection.payment_method.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (collection) => (
        <Badge variant={collection.status === 'completed' ? 'success' : collection.status === 'pending' ? 'secondary' : 'destructive'}>
          {collection.status.replace(/\b\w/g, (l: string) => l.toUpperCase())}
        </Badge>
      ),
    },
    {
      key: 'is_active',
      label: 'Active',
      render: (collection) => (
        <Badge variant={collection.is_active ? 'success' : 'destructive'}>
          {collection.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'payment_method',
      label: 'Payment Method',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'cash', label: 'Cash' },
        { value: 'card', label: 'Card' },
        { value: 'upi', label: 'UPI' },
        { value: 'net_banking', label: 'Net Banking' },
        { value: 'cheque', label: 'Cheque' },
        { value: 'demand_draft', label: 'Demand Draft' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' },
      ],
    },
    {
      name: 'is_active',
      label: 'Active',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' },
      ],
    },
  ];

  const handleAddNew = () => {
    setSelectedCollection(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (collection: FeeCollection) => {
    setSelectedCollection(collection);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (data: Partial<FeeCollectionCreateInput>) => {
    try {
      if (sidebarMode === 'create') {
        await createFeeCollection.mutateAsync(data);
        toast.success('Fee collection created successfully');
      } else if (sidebarMode === 'edit' && selectedCollection) {
        await updateFeeCollection.mutateAsync({ id: selectedCollection.id, data });
        toast.success('Fee collection updated successfully');
      }
      setIsSidebarOpen(false);
      setSelectedCollection(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred');
      console.error('Form submission error:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedCollection) return;

    if (confirm('Are you sure you want to delete this fee collection?')) {
      try {
        await deleteFeeCollection.mutateAsync(selectedCollection.id);
        toast.success('Fee collection deleted successfully');
        setIsSidebarOpen(false);
        setSelectedCollection(null);
        refetch();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete fee collection');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedCollection(null);
  };

  return (
    <div className="">
      <DataTable
        title="Fee Collections"
        description="View and manage fee collections"
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
        searchPlaceholder="Search collections..."
        addButtonLabel="Collect Fee"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Collect Fee' : `Fee Collection #${selectedCollection?.id || ''}`}
        mode={sidebarMode}
        width="lg"
      >
        {sidebarMode === 'view' && selectedCollection ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Student Name</h3>
                <p className="mt-1 text-lg font-semibold">{selectedCollection.student_name || '-'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Payment Date</h3>
                <p className="mt-1">{selectedCollection.payment_date}</p>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded">
              <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
              <p className="mt-1 text-2xl font-bold">₹{parseFloat(selectedCollection.amount).toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                <p className="mt-1">
                  <Badge variant="secondary">
                    {selectedCollection.payment_method.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Badge>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <p className="mt-1">
                  <Badge variant={selectedCollection.status === 'completed' ? 'success' : selectedCollection.status === 'pending' ? 'secondary' : 'destructive'}>
                    {selectedCollection.status.replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Badge>
                </p>
              </div>
            </div>
            {selectedCollection.transaction_id && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Transaction ID</h3>
                <p className="mt-1">{selectedCollection.transaction_id}</p>
              </div>
            )}
            {selectedCollection.collected_by && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Collected By</h3>
                <p className="mt-1">{selectedCollection.collected_by_name || selectedCollection.collected_by}</p>
              </div>
            )}
            {selectedCollection.remarks && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Remarks</h3>
                <p className="mt-1">{selectedCollection.remarks}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Active Status</h3>
              <p className="mt-1">
                <Badge variant={selectedCollection.is_active ? 'success' : 'destructive'}>
                  {selectedCollection.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            {selectedCollection.is_active && (
              <div className="flex gap-2 pt-4">
                <Button onClick={handleEdit} className="flex-1">Edit</Button>
                <Button onClick={handleDelete} variant="destructive" className="flex-1">Delete</Button>
              </div>
            )}
          </div>
        ) : (
          <FeeCollectionForm
            feeCollection={sidebarMode === 'edit' ? selectedCollection : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default FeeCollectionsPage;
