import { useState } from 'react';
import { Send, FileText, Check, Edit, Trash2, Plus } from 'lucide-react';
import { Column, DataTable } from '../../../components/common/DataTable';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  usePurchaseOrders,
  useSendPurchaseOrderToSupplier,
  useAcknowledgePurchaseOrder,
  useGeneratePurchaseOrderPdf,
} from '../../../hooks/useProcurement';
import { toast } from 'sonner';

export const PurchaseOrdersPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });

  const { data, isLoading, refetch } = usePurchaseOrders(filters);
  const sendMutation = useSendPurchaseOrderToSupplier();
  const acknowledgeMutation = useAcknowledgePurchaseOrder();
  const pdfMutation = useGeneratePurchaseOrderPdf();

  const handleSendToSupplier = async (po: any) => {
    try {
      await sendMutation.mutateAsync({ id: po.id, data: po });
      toast.success('PO sent to supplier successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send PO');
    }
  };

  const handleAcknowledge = async (po: any) => {
    try {
      await acknowledgeMutation.mutateAsync({ id: po.id, data: po });
      toast.success('PO acknowledged successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to acknowledge PO');
    }
  };

  const handleGeneratePdf = async (po: any) => {
    try {
      await pdfMutation.mutateAsync({ id: po.id, data: po });
      toast.success('PDF generated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate PDF');
    }
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      draft: 'secondary',
      sent: 'default',
      acknowledged: 'outline',
      in_progress: 'default',
      completed: 'outline',
      cancelled: 'destructive',
    };
    return variants[status] || 'default';
  };

  const columns: Column<any>[] = [
    {
      key: 'po_number',
      label: 'PO Number',
      render: (row) => <span className="font-semibold">{row.po_number}</span>,
      sortable: true,
    },
    {
      key: 'po_date',
      label: 'PO Date',
      render: (row) => new Date(row.po_date).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'supplier_name',
      label: 'Supplier',
      render: (row) => row.supplier_name || `Supplier #${row.supplier}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={getStatusVariant(row.status)} className="capitalize">
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'grand_total',
      label: 'Total Amount',
      render: (row) => row.grand_total ? `₹${parseFloat(row.grand_total).toLocaleString()}` : '-',
    },
    {
      key: 'expected_delivery_date',
      label: 'Expected Delivery',
      render: (row) => row.expected_delivery_date ? new Date(row.expected_delivery_date).toLocaleDateString() : '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {row.status === 'draft' && (
            <Button size="sm" onClick={() => handleSendToSupplier(row)}>
              <Send className="h-4 w-4 mr-1" />
              Send
            </Button>
          )}
          {row.status === 'sent' && (
            <Button size="sm" variant="outline" onClick={() => handleAcknowledge(row)}>
              <Check className="h-4 w-4 mr-1" />
              Acknowledge
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => handleGeneratePdf(row)}>
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">Manage purchase orders and supplier communications</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        onPageChange={(page) => setFilters({ ...filters, page })}
      />
    </div>
  );
};
