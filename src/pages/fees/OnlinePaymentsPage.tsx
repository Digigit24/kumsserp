/**
 * Online Payments Page
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge, type BadgeProps } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useOnlinePayments, useCreateOnlinePayment, useUpdateOnlinePayment, useDeleteOnlinePayment } from '../../hooks/useFees';
import { OnlinePaymentForm } from './forms';
import { toast } from 'sonner';

const OnlinePaymentsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

  // Fetch online payments using real API
  const { data, isLoading, error, refetch } = useOnlinePayments(filters);
  const createOnlinePayment = useCreateOnlinePayment();
  const updateOnlinePayment = useUpdateOnlinePayment();
  const deleteOnlinePayment = useDeleteOnlinePayment();

  const columns: Column<any>[] = [
    {
      key: 'collection',
      label: 'Collection',
      render: (payment) => payment.collection_receipt_number || `Collection #${payment.collection}`,
      sortable: true,
    },
    {
      key: 'gateway',
      label: 'Payment Gateway',
      render: (payment) => payment.gateway || 'N/A',
      sortable: true,
    },
    {
      key: 'transaction_id',
      label: 'Transaction ID',
      render: (payment) => (
        <span className="font-mono text-sm">{payment.transaction_id || 'N/A'}</span>
      ),
    },
    {
      key: 'order_id',
      label: 'Order ID',
      render: (payment) => (
        <span className="font-mono text-sm">{payment.order_id || 'N/A'}</span>
      ),
    },
    {
      key: 'payment_mode',
      label: 'Payment Mode',
      render: (payment) => payment.payment_mode || 'N/A',
    },
    {
      key: 'status',
      label: 'Status',
      render: (payment) => {
        const statusColors: Record<string, BadgeProps['variant']> = {
          pending: 'secondary',
          success: 'success',
          failed: 'destructive',
          refunded: 'warning',
        };
        return (
          <Badge variant={statusColors[payment.status] || 'default'}>
            {payment.status || 'Unknown'}
          </Badge>
        );
      },
      sortable: true,
    },
    {
      key: 'is_active',
      label: 'Active',
      render: (payment) => (
        <Badge variant={payment.is_active ? 'default' : 'secondary'}>
          {payment.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'pending', label: 'Pending' },
        { value: 'success', label: 'Success' },
        { value: 'failed', label: 'Failed' },
        { value: 'refunded', label: 'Refunded' },
      ],
    },
    {
      name: 'gateway',
      label: 'Gateway',
      type: 'text',
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
    setSelectedPayment(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (payment: any) => {
    setSelectedPayment(payment);
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
        console.log('Creating online payment...');
        const result = await createOnlinePayment.mutateAsync(data);
        console.log('Create result:', result);
        toast.success('Online payment created successfully');
      } else if (sidebarMode === 'edit' && selectedPayment) {
        console.log('Updating online payment...');
        const result = await updateOnlinePayment.mutateAsync({ id: selectedPayment.id, data });
        console.log('Update result:', result);
        toast.success('Online payment updated successfully');
      }
      setIsSidebarOpen(false);
      setSelectedPayment(null);
      refetch();
    } catch (err: any) {
      console.error('Form submission error:', err);
      toast.error(err?.message || err?.error || 'An error occurred');
    }
  };

  const handleDelete = async () => {
    if (!selectedPayment) return;

    if (confirm('Are you sure you want to delete this online payment?')) {
      try {
        await deleteOnlinePayment.mutateAsync(selectedPayment.id);
        toast.success('Online payment deleted successfully');
        setIsSidebarOpen(false);
        setSelectedPayment(null);
        refetch();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete online payment');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedPayment(null);
  };

  return (
    <div className="">
      <DataTable
        title="Online Payments"
        description="View and manage online payments"
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
        searchPlaceholder="Search payments..."
        addButtonLabel="Add Payment"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Online Payment' : `Payment #${selectedPayment?.id}` || 'Online Payment'}
        mode={sidebarMode}
      >
        {sidebarMode === 'view' && selectedPayment ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Collection</h3>
              <p className="mt-1 text-lg font-semibold">
                {selectedPayment.collection_receipt_number || `Collection #${selectedPayment.collection}`}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Payment Gateway</h3>
              <p className="mt-1">{selectedPayment.gateway || 'N/A'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Transaction ID</h3>
                <p className="mt-1 font-mono text-sm">{selectedPayment.transaction_id || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Order ID</h3>
                <p className="mt-1 font-mono text-sm">{selectedPayment.order_id || 'N/A'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Payment Mode</h3>
              <p className="mt-1">{selectedPayment.payment_mode || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={
                  selectedPayment.status === 'success' ? 'success' :
                  selectedPayment.status === 'failed' ? 'destructive' :
                  selectedPayment.status === 'refunded' ? 'warning' : 'secondary'
                }>
                  {selectedPayment.status || 'Unknown'}
                </Badge>
              </p>
            </div>
            {selectedPayment.response_data && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Response Data</h3>
                <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                  {selectedPayment.response_data}
                </pre>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Active</h3>
              <p className="mt-1">
                <Badge variant={selectedPayment.is_active ? 'default' : 'secondary'}>
                  {selectedPayment.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEdit} className="flex-1">Edit</Button>
              <Button onClick={handleDelete} variant="destructive" className="flex-1">Delete</Button>
            </div>
          </div>
        ) : (
          <OnlinePaymentForm
            onlinePayment={sidebarMode === 'edit' ? selectedPayment : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default OnlinePaymentsPage;
