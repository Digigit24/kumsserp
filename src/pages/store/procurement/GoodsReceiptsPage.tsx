import { useState } from 'react';
import { Package, Send, CheckCircle } from 'lucide-react';
import { Column, DataTable } from '../../../components/common/DataTable';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  useGoodsReceipts,
  useSubmitGoodsReceiptForInspection,
  usePostGoodsReceiptToInventory,
} from '../../../hooks/useProcurement';
import { toast } from 'sonner';

export const GoodsReceiptsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });

  const { data, isLoading, refetch } = useGoodsReceipts(filters);
  const inspectionMutation = useSubmitGoodsReceiptForInspection();
  const inventoryMutation = usePostGoodsReceiptToInventory();

  const handleSubmitForInspection = async (grn: any) => {
    try {
      await inspectionMutation.mutateAsync({ id: grn.id, data: grn });
      toast.success('GRN submitted for inspection');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit for inspection');
    }
  };

  const handlePostToInventory = async (grn: any) => {
    try {
      await inventoryMutation.mutateAsync({ id: grn.id, data: grn });
      toast.success('GRN posted to inventory successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to post to inventory');
    }
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      received: 'secondary',
      inspection_pending: 'default',
      inspected: 'default',
      approved: 'outline',
      posted_to_inventory: 'outline',
      rejected: 'destructive',
    };
    return variants[status] || 'default';
  };

  const columns: Column<any>[] = [
    {
      key: 'grn_number',
      label: 'GRN Number',
      render: (row) => <span className="font-semibold">{row.grn_number}</span>,
      sortable: true,
    },
    {
      key: 'receipt_date',
      label: 'Receipt Date',
      render: (row) => new Date(row.receipt_date).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'invoice_number',
      label: 'Invoice Number',
      render: (row) => row.invoice_number || '-',
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
      key: 'invoice_amount',
      label: 'Amount',
      render: (row) => row.invoice_amount ? `₹${parseFloat(row.invoice_amount).toLocaleString()}` : '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {row.status === 'received' && (
            <Button size="sm" onClick={() => handleSubmitForInspection(row)}>
              <Send className="h-4 w-4 mr-1" />
              Inspect
            </Button>
          )}
          {row.status === 'approved' && (
            <Button size="sm" variant="outline" onClick={() => handlePostToInventory(row)}>
              <Package className="h-4 w-4 mr-1" />
              Post to Inventory
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Goods Receipt Notes (GRN)</h1>
          <p className="text-muted-foreground">Track goods received from suppliers</p>
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
