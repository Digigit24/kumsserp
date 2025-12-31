/**
 * Fee Collections Page
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useFeeCollections, useCreateFeeCollection, useUpdateFeeCollection, useDeleteFeeCollection } from '../../hooks/useFees';
import { FeeCollection } from '../../types/fees.types';
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
    { key: 'receipt_number', label: 'Receipt No', sortable: true },
    { key: 'student_name', label: 'Student Name', sortable: true },
    { key: 'student_roll_number', label: 'Roll No', sortable: true },
    { key: 'payment_date', label: 'Payment Date', sortable: true },
    {
      key: 'amount_paid',
      label: 'Amount Paid',
      render: (collection) => <span className="font-semibold">₹{collection.amount_paid.toLocaleString()}</span>,
      sortable: true,
    },
    {
      key: 'payment_mode',
      label: 'Payment Mode',
      render: (collection) => (
        <Badge variant="secondary">
          {collection.payment_mode.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      ),
    },
    {
      key: 'is_cancelled',
      label: 'Status',
      render: (collection) => (
        <Badge variant={collection.is_cancelled ? 'destructive' : 'success'}>
          {collection.is_cancelled ? 'Cancelled' : 'Active'}
        </Badge>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'payment_mode',
      label: 'Payment Mode',
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
      name: 'is_cancelled',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'false', label: 'Active' },
        { value: 'true', label: 'Cancelled' },
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

  const handleFormSubmit = async (data: Partial<FeeCollection>) => {
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
        title={sidebarMode === 'create' ? 'Collect Fee' : `Receipt ${selectedCollection?.receipt_number || ''}`}
        mode={sidebarMode}
        width="lg"
      >
        {sidebarMode === 'view' && selectedCollection ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Receipt Number</h3>
                <p className="mt-1 text-lg font-semibold">{selectedCollection.receipt_number}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Payment Date</h3>
                <p className="mt-1">{selectedCollection.payment_date}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Student Name</h3>
                <p className="mt-1">{selectedCollection.student_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Roll Number</h3>
                <p className="mt-1">{selectedCollection.student_roll_number}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Academic Session</h3>
              <p className="mt-1">{selectedCollection.session_name}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 p-3 bg-muted rounded">
              <div>
                <h3 className="text-xs font-medium text-muted-foreground">Total Amount</h3>
                <p className="mt-1 text-lg">₹{selectedCollection.total_amount.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-muted-foreground">Discount</h3>
                <p className="mt-1 text-lg text-green-600">-₹{selectedCollection.discount_amount.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-muted-foreground">Fine</h3>
                <p className="mt-1 text-lg text-red-600">+₹{selectedCollection.fine_amount.toLocaleString()}</p>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded">
              <h3 className="text-sm font-medium text-muted-foreground">Net Amount</h3>
              <p className="mt-1 text-2xl font-bold">₹{selectedCollection.net_amount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <h3 className="text-sm font-medium text-muted-foreground">Amount Paid</h3>
              <p className="mt-1 text-2xl font-bold text-green-600">₹{selectedCollection.amount_paid.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Payment Mode</h3>
                <p className="mt-1">
                  <Badge variant="secondary">
                    {selectedCollection.payment_mode.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </p>
              </div>
              {selectedCollection.transaction_id && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Transaction ID</h3>
                  <p className="mt-1">{selectedCollection.transaction_id}</p>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Collected By</h3>
              <p className="mt-1">{selectedCollection.collected_by}</p>
            </div>
            {selectedCollection.remarks && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Remarks</h3>
                <p className="mt-1">{selectedCollection.remarks}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedCollection.is_cancelled ? 'destructive' : 'success'}>
                  {selectedCollection.is_cancelled ? 'Cancelled' : 'Active'}
                </Badge>
              </p>
            </div>
            {!selectedCollection.is_cancelled && (
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
