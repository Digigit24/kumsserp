import { useState } from 'react';
import { CheckCircle, Edit, Trash2, Plus } from 'lucide-react';
import { Column, DataTable } from '../../../components/common/DataTable';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  useQuotations,
  useCreateQuotation,
  useUpdateQuotation,
  useDeleteQuotation,
  useMarkQuotationSelected,
} from '../../../hooks/useProcurement';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { QuotationForm } from './forms/QuotationForm';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';

export const QuotationsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState<number | null>(null);

  const { data, isLoading, refetch } = useQuotations(filters);
  const createMutation = useCreateQuotation();
  const updateMutation = useUpdateQuotation();
  const deleteMutation = useDeleteQuotation();
  const selectMutation = useMarkQuotationSelected();

  const handleCreate = () => {
    setSelectedQuotation(null);
    setIsFormOpen(true);
  };

  const handleEdit = (quotation: any) => {
    setSelectedQuotation(quotation);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setQuotationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!quotationToDelete) return;

    try {
      await deleteMutation.mutateAsync(quotationToDelete);
      toast.success('Quotation deleted successfully');
      refetch();
      setDeleteDialogOpen(false);
      setQuotationToDelete(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete quotation');
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedQuotation) {
        await updateMutation.mutateAsync({ id: selectedQuotation.id, data });
        toast.success('Quotation updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Quotation created successfully');
      }
      setIsFormOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save quotation');
    }
  };

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
          <Button size="sm" variant="outline" onClick={() => handleEdit(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(row.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
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
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Create Quotation
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        onPageChange={(page) => setFilters({ ...filters, page })}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedQuotation ? 'Edit Quotation' : 'Create New Quotation'}</DialogTitle>
          </DialogHeader>
          <QuotationForm
            quotation={selectedQuotation}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Quotation"
        description="Are you sure you want to delete this quotation? This action cannot be undone."
      />
    </div>
  );
};
