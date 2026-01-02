import { useState } from 'react';
import { CheckCircle, Edit, Trash2, Plus } from 'lucide-react';
import { Column, DataTable } from '../../../components/common/DataTable';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  useQuotations,
  useMarkQuotationSelected,
} from '../../../hooks/useProcurement';
import { toast } from 'sonner';

export const QuotationsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });

  const { data, isLoading, refetch } = useQuotations(filters);
  const selectMutation = useMarkQuotationSelected();

  const handleMarkSelected = async (quotation: any) => {
    try {
      await selectMutation.mutateAsync({ id: quotation.id, data: quotation });
      toast.success('Quotation marked as selected');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to select quotation');
    }
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      received: 'secondary',
      under_review: 'default',
      selected: 'outline',
      rejected: 'destructive',
    };
    return variants[status] || 'default';
  };

  const columns: Column<any>[] = [
    {
      key: 'quotation_number',
      label: 'Quotation Number',
      render: (row) => <span className="font-semibold">{row.quotation_number}</span>,
      sortable: true,
    },
    {
      key: 'quotation_date',
      label: 'Date',
      render: (row) => new Date(row.quotation_date).toLocaleDateString(),
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
      key: 'is_selected',
      label: 'Selected',
      render: (row) => row.is_selected ? (
        <Badge variant="outline">
          <CheckCircle className="h-3 w-3 mr-1" />
          Yes
        </Badge>
      ) : (
        <Badge variant="secondary">No</Badge>
      ),
    },
    {
      key: 'grand_total',
      label: 'Amount',
      render: (row) => row.grand_total ? `₹${parseFloat(row.grand_total).toLocaleString()}` : '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {!row.is_selected && row.status !== 'rejected' && (
            <Button size="sm" onClick={() => handleMarkSelected(row)}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Select
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
          <h1 className="text-3xl font-bold">Quotations</h1>
          <p className="text-muted-foreground">Review and compare supplier quotations</p>
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
