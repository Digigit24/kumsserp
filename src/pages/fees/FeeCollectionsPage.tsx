/**
 * Fee Collections Page
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { FeeCollection, mockFeeCollectionsPaginated } from '../../data/feesMockData';
import { FeeCollectionForm } from './forms';

const FeeCollectionsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedCollection, setSelectedCollection] = useState<FeeCollection | null>(null);

  const columns: Column<FeeCollection>[] = [
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

  const handleFormSubmit = (data: Partial<FeeCollection>) => {
    console.log('Form submitted:', data);
    setIsSidebarOpen(false);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedCollection(null);
  };

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold">Fee Collections</h1>
        <p className="text-muted-foreground">Manage fee collections and receipts</p>
      </div>

      <DataTable
        title="Fee Collections"
        description="View and manage fee collections"
        columns={columns}
        data={mockFeeCollectionsPaginated}
        isLoading={false}
        error={null}
        onRefresh={() => {}}
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
              <div className="pt-4">
                <Button onClick={handleEdit}>Edit</Button>
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
