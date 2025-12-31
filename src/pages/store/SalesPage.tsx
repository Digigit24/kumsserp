/**
 * Sales Page - Store Sales Management
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useSales, useCreateSale, useUpdateSale, useDeleteSale } from '../../hooks/useStore';
import { SaleForm } from './forms/SaleForm';
import { toast } from 'sonner';
import { DollarSign, CreditCard, Smartphone, Wallet, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const SalesPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedSale, setSelectedSale] = useState<any | null>(null);

  const { data, isLoading, error, refetch } = useSales(filters);
  const createSale = useCreateSale();
  const updateSale = useUpdateSale();
  const deleteSale = useDeleteSale();

  const formatCurrency = (amount: string | number) => {
    const num = parseFloat(String(amount));
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(num);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'upi':
        return <Smartphone className="h-4 w-4" />;
      case 'wallet':
        return <Wallet className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock, className: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      completed: { variant: 'default' as const, icon: CheckCircle2, className: 'bg-green-100 text-green-700 border-green-300' },
      failed: { variant: 'destructive' as const, icon: XCircle, className: 'bg-red-100 text-red-700 border-red-300' },
      refunded: { variant: 'outline' as const, icon: AlertCircle, className: 'bg-blue-100 text-blue-700 border-blue-300' },
      cancelled: { variant: 'outline' as const, icon: XCircle, className: 'bg-gray-100 text-gray-700 border-gray-300' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={`gap-1 ${config.className}`}>
        <Icon className="h-3 w-3" />
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const columns: Column<any>[] = [
    {
      key: 'id',
      label: 'Sale ID',
      render: (sale) => (
        <span className="font-mono text-sm font-semibold text-primary">
          #{String(sale.id).padStart(6, '0')}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'sale_date',
      label: 'Date',
      render: (sale) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {new Date(sale.sale_date).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(sale.sale_date).toLocaleDateString('en-IN', { weekday: 'short' })}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (sale) => (
        <div className="flex flex-col">
          {sale.student_name ? (
            <>
              <span className="text-sm font-medium">{sale.student_name}</span>
              <span className="text-xs text-muted-foreground">Student</span>
            </>
          ) : sale.teacher_name ? (
            <>
              <span className="text-sm font-medium">{sale.teacher_name}</span>
              <span className="text-xs text-muted-foreground">Staff</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">Walk-in</span>
          )}
        </div>
      ),
    },
    {
      key: 'total_amount',
      label: 'Amount',
      render: (sale) => (
        <span className="text-base font-bold text-green-600">
          {formatCurrency(sale.total_amount)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'payment_method',
      label: 'Payment',
      render: (sale) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            {getPaymentMethodIcon(sale.payment_method)}
          </div>
          <span className="text-sm capitalize">{sale.payment_method}</span>
        </div>
      ),
    },
    {
      key: 'payment_status',
      label: 'Status',
      render: (sale) => getPaymentStatusBadge(sale.payment_status),
      sortable: true,
    },
    {
      key: 'is_active',
      label: 'Active',
      render: (sale) => (
        <Badge variant={sale.is_active ? 'default' : 'secondary'}>
          {sale.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'student',
      label: 'Student ID',
      type: 'text',
    },
    {
      name: 'payment_method',
      label: 'Payment Method',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'cash', label: 'Cash' },
        { value: 'card', label: 'Card' },
        { value: 'upi', label: 'UPI' },
        { value: 'wallet', label: 'Wallet' },
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'cheque', label: 'Cheque' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      name: 'payment_status',
      label: 'Payment Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'failed', label: 'Failed' },
        { value: 'refunded', label: 'Refunded' },
        { value: 'cancelled', label: 'Cancelled' },
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
    setSelectedSale(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (sale: any) => {
    setSelectedSale(sale);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (sidebarMode === 'create') {
        await createSale.mutateAsync(data);
        toast.success('Sale created successfully');
      } else if (sidebarMode === 'edit' && selectedSale) {
        await updateSale.mutateAsync({ id: selectedSale.id, data });
        toast.success('Sale updated successfully');
      }
      setIsSidebarOpen(false);
      setSelectedSale(null);
      refetch();
    } catch (err: any) {
      console.error('Form submission error:', err);
      toast.error(err?.message || 'An error occurred');
    }
  };

  const handleDelete = async () => {
    if (!selectedSale) return;

    if (confirm('Are you sure you want to delete this sale? This action cannot be undone.')) {
      try {
        await deleteSale.mutateAsync(selectedSale.id);
        toast.success('Sale deleted successfully');
        setIsSidebarOpen(false);
        setSelectedSale(null);
        refetch();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete sale');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedSale(null);
  };

  return (
    <div className="">
      <DataTable
        title="Store Sales"
        description="Manage and track all store sales transactions"
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
        searchPlaceholder="Search sales..."
        addButtonLabel="New Sale"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={
          sidebarMode === 'create'
            ? 'Create New Sale'
            : `Sale #${String(selectedSale?.id || '').padStart(6, '0')}` || 'Sale Details'
        }
        mode={sidebarMode}
      >
        {sidebarMode === 'view' && selectedSale ? (
          <div className="space-y-6">
            {/* Sale Header */}
            <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Sale ID</h3>
                  <p className="text-2xl font-mono font-bold text-primary">
                    #{String(selectedSale.id).padStart(6, '0')}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Amount</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedSale.total_amount)}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {new Date(selectedSale.sale_date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                {getPaymentStatusBadge(selectedSale.payment_status)}
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Customer Information
              </h3>
              <div className="space-y-2">
                {selectedSale.student_name ? (
                  <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">ST</span>
                    </div>
                    <div>
                      <p className="font-medium">{selectedSale.student_name}</p>
                      <p className="text-xs text-muted-foreground">Student</p>
                    </div>
                  </div>
                ) : selectedSale.teacher_name ? (
                  <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">SF</span>
                    </div>
                    <div>
                      <p className="font-medium">{selectedSale.teacher_name}</p>
                      <p className="text-xs text-muted-foreground">Staff</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-accent/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Walk-in Customer</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Payment Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Method</h4>
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(selectedSale.payment_method)}
                    <span className="font-medium capitalize">{selectedSale.payment_method}</span>
                  </div>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Status</h4>
                  {getPaymentStatusBadge(selectedSale.payment_status)}
                </div>
              </div>
            </div>

            {/* Remarks */}
            {selectedSale.remarks && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Remarks
                </h3>
                <p className="text-sm p-3 bg-accent/50 rounded-lg">{selectedSale.remarks}</p>
              </div>
            )}

            {/* Sale Status */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Record Status
              </h3>
              <Badge variant={selectedSale.is_active ? 'default' : 'secondary'} className="text-sm">
                {selectedSale.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleEdit} className="flex-1">
                Edit
              </Button>
              <Button onClick={handleDelete} variant="destructive" className="flex-1">
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <SaleForm
            sale={sidebarMode === 'edit' ? selectedSale : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default SalesPage;
