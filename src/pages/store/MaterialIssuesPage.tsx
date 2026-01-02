import { useState } from 'react';
import { Truck, FileText, Package } from 'lucide-react';
import { Column, DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useMaterialIssues, useDispatchMaterialIssue, useConfirmReceipt, useGeneratePdf } from '../../hooks/useMaterialIssues';
import { toast } from 'sonner';

export const MaterialIssuesPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });

  const { data, isLoading, refetch } = useMaterialIssues(filters);
  const dispatchMutation = useDispatchMaterialIssue();
  const confirmReceiptMutation = useConfirmReceipt();
  const generatePdfMutation = useGeneratePdf();

  const handleDispatch = async (issue: any) => {
    try {
      await dispatchMutation.mutateAsync({ id: issue.id, data: issue });
      toast.success('Material dispatched successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to dispatch');
    }
  };

  const handleConfirmReceipt = async (issue: any) => {
    try {
      await confirmReceiptMutation.mutateAsync({ id: issue.id, data: issue });
      toast.success('Receipt confirmed successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to confirm receipt');
    }
  };

  const handleGeneratePdf = async (id: number) => {
    try {
      await generatePdfMutation.mutateAsync(id);
      toast.success('PDF generated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate PDF');
    }
  };

  const columns: Column<any>[] = [
    {
      key: 'min_number',
      label: 'MIN Number',
      render: (row) => <span className="font-semibold">{row.min_number}</span>,
      sortable: true,
    },
    {
      key: 'issue_date',
      label: 'Issue Date',
      render: (row) => new Date(row.issue_date).toLocaleDateString(),
    },
    {
      key: 'central_store_name',
      label: 'From Store',
      render: (row) => row.central_store_name || `Store #${row.central_store}`,
    },
    {
      key: 'receiving_college_name',
      label: 'To College',
      render: (row) => row.receiving_college_name || `College #${row.receiving_college}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
          prepared: 'secondary',
          dispatched: 'default',
          received: 'outline',
        };
        return <Badge variant={variants[row.status]}>{row.status}</Badge>;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {row.status === 'prepared' && (
            <Button size="sm" onClick={() => handleDispatch(row)}>
              <Truck className="h-4 w-4 mr-1" />
              Dispatch
            </Button>
          )}
          {row.status === 'dispatched' && (
            <Button size="sm" onClick={() => handleConfirmReceipt(row)}>
              <Package className="h-4 w-4 mr-1" />
              Confirm
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => handleGeneratePdf(row.id)}>
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Material Issues</h1>
        <p className="text-muted-foreground">Track material transfers from central stores</p>
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
