import { useState } from 'react';
import { Truck, FileText, Package, Plus, Edit, Trash2 } from 'lucide-react';
import { Column, DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  useMaterialIssues,
  useCreateMaterialIssue,
  useUpdateMaterialIssue,
  useDeleteMaterialIssue,
  useDispatchMaterialIssue,
  useConfirmReceipt,
  useGeneratePdf,
} from '../../hooks/useMaterialIssues';
import { MaterialIssueForm } from './forms/MaterialIssueForm';
import { toast } from 'sonner';

export const MaterialIssuesPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<number | null>(null);

  const { data, isLoading, refetch } = useMaterialIssues(filters);
  const createMutation = useCreateMaterialIssue();
  const updateMutation = useUpdateMaterialIssue();
  const deleteMutation = useDeleteMaterialIssue();
  const dispatchMutation = useDispatchMaterialIssue();
  const confirmReceiptMutation = useConfirmReceipt();
  const generatePdfMutation = useGeneratePdf();

  const handleCreate = () => {
    setSelectedIssue(null);
    setIsFormOpen(true);
  };

  const handleEdit = (issue: any) => {
    setSelectedIssue(issue);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setIssueToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!issueToDelete) return;

    try {
      await deleteMutation.mutateAsync(issueToDelete);
      toast.success('Material issue deleted successfully');
      refetch();
      setDeleteDialogOpen(false);
      setIssueToDelete(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete material issue');
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      // Clean data - convert empty strings to null/undefined
      const cleanedData = { ...data };

      // Clean items
      if (cleanedData.items && Array.isArray(cleanedData.items)) {
        cleanedData.items = cleanedData.items.map((item: any) => {
          const cleanedItem = { ...item };
          Object.keys(cleanedItem).forEach(key => {
            if (cleanedItem[key] === '') {
              delete cleanedItem[key];
            }
          });
          return cleanedItem;
        });
      }

      // Clean main object
      const optionalFields = [
        'dispatch_date',
        'receipt_date',
        'min_document',
        'internal_notes',
        'receipt_confirmation_notes',
        'issued_by',
        'received_by',
        'transport_mode',
        'vehicle_number',
        'driver_name',
        'driver_contact',
      ];

      optionalFields.forEach(field => {
        if (cleanedData[field] === '' || cleanedData[field] === null) {
          delete cleanedData[field];
        }
      });

      // Check if we need to use FormData (file upload)
      const hasFile = cleanedData.min_document instanceof File;
      
      let payload = cleanedData;
      if (hasFile) {
        const formData = new FormData();
        Object.keys(cleanedData).forEach(key => {
            if (key === 'items') {
                formData.append('items', JSON.stringify(cleanedData.items));
            } else if (cleanedData[key] !== undefined && cleanedData[key] !== null) {
                formData.append(key, cleanedData[key]);
            }
        });
        payload = formData;
      }

      if (selectedIssue) {
        await updateMutation.mutateAsync({ id: selectedIssue.id, data: payload });
        toast.success('Material issue updated successfully');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Material issue created successfully');
      }
      setIsFormOpen(false);
      refetch();
    } catch (error: any) {
      console.error('Material Issue Error:', error);
      toast.error(error.message || 'Failed to save material issue');
    }
  };

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
          <h1 className="text-3xl font-bold">Material Issues</h1>
          <p className="text-muted-foreground">Track material transfers from central stores</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Create Material Issue
        </Button>
      </div>

      <DataTable
        title="Material Issues"
        columns={columns}
        data={data || null}
        isLoading={isLoading}
        error={null}
        onRefresh={refetch}
        onFiltersChange={setFilters}
        filters={filters}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedIssue ? 'Edit Material Issue' : 'Create New Material Issue'}</DialogTitle>
          </DialogHeader>
          <MaterialIssueForm
            materialIssue={selectedIssue}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Material Issue"
        description="Are you sure you want to delete this material issue? This action cannot be undone."
      />
    </div>
  );
};
