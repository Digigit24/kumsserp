import { Edit, ExternalLink, Plus, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Column, DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import {
  useCreateStoreIndent,
  useDeleteStoreIndent,
  useStoreIndents,
  useSubmitStoreIndent,
  useUpdateStoreIndent,
} from '../../hooks/useStoreIndents';
import { StoreIndentForm } from './forms/StoreIndentForm';

export const StoreIndentsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [indentToDelete, setIndentToDelete] = useState<number | null>(null);

  const { data, isLoading, refetch } = useStoreIndents(filters);
  const createMutation = useCreateStoreIndent();
  const updateMutation = useUpdateStoreIndent();
  const deleteMutation = useDeleteStoreIndent();
  const submitMutation = useSubmitStoreIndent();

  const handleCreate = () => {
    setSelectedIndent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (indent: any) => {
    setSelectedIndent(indent);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setIndentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!indentToDelete) return;

    try {
      await deleteMutation.mutateAsync(indentToDelete);
      toast.success('Indent deleted successfully');
      refetch();
      setDeleteDialogOpen(false);
      setIndentToDelete(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete indent');
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedIndent) {
        await updateMutation.mutateAsync({ id: selectedIndent.id, data });
        toast.success('Indent updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Indent created successfully');
      }
      setIsFormOpen(false);
      refetch();
    } catch (error: any) {
      console.error('Store Indent Error:', error);

      // Parse validation errors
      let errorMessage = 'Failed to save indent';

      if (error.response?.data) {
        const errors = error.response.data;

        // Handle items validation errors
        if (errors.items && Array.isArray(errors.items)) {
          errors.items.forEach((itemError: any, index: number) => {
            if (itemError.central_store_item) {
              toast.error(`Item ${index + 1}: ${itemError.central_store_item[0]}`);
            }
          });
          return;
        }

        // Handle other field errors
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey && errors[firstErrorKey]) {
          const errorValue = Array.isArray(errors[firstErrorKey])
            ? errors[firstErrorKey][0]
            : errors[firstErrorKey];
          errorMessage = `${firstErrorKey}: ${errorValue}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  const handleSubmitIndent = async (indent: any) => {
    try {
      await submitMutation.mutateAsync({ id: indent.id, data: {} });
      toast.success('Indent submitted for college admin approval');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit indent');
    }
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      draft: 'secondary',
      pending_college_approval: 'default',
      pending_super_admin: 'default',
      super_admin_approved: 'outline',
      rejected_by_college: 'destructive',
      rejected_by_super_admin: 'destructive',
      partially_fulfilled: 'secondary',
      fulfilled: 'outline',
      cancelled: 'destructive',
    };
    return variants[status] || 'default';
  };

  const getPriorityVariant = (priority: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      low: 'secondary',
      medium: 'default',
      high: 'outline',
      urgent: 'destructive',
    };
    return variants[priority] || 'default';
  };

  const columns: Column<any>[] = [
    {
      key: 'indent_number',
      label: 'Indent Number',
      render: (row) => <span className="font-semibold">{row.indent_number}</span>,
      sortable: true,
    },
    {
      key: 'required_by_date',
      label: 'Required By',
      render: (row) => new Date(row.required_by_date).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (row) => (
        <Badge variant={getPriorityVariant(row.priority)} className="capitalize">
          {row.priority}
        </Badge>
      ),
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
      key: 'college',
      label: 'College',
      render: (row) => `College #${row.college}`,
    },
    {
      key: 'central_store',
      label: 'Central Store',
      render: (row) => `Store #${row.central_store}`,
    },
    {
      key: 'approval_status',
      label: 'Approval',
      render: (row) => {
        if (row.approval_request) {
          return (
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(row.approval_request.status)} className="capitalize">
                {row.approval_request.status}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate(`/approvals/${row.approval_request.id}`)}
                title="View approval details"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          );
        }
        return <span className="text-muted-foreground text-sm">-</span>;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {row.status === 'draft' && (
            <Button size="sm" onClick={() => handleSubmitIndent(row)}>
              <Send className="h-4 w-4 mr-1" />
              Submit
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
          <h1 className="text-3xl font-bold">Store Indents</h1>
          <p className="text-muted-foreground">Manage store indent requests</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Create Indent
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
            <DialogTitle>{selectedIndent ? 'Edit Indent' : 'Create New Indent'}</DialogTitle>
          </DialogHeader>
          <StoreIndentForm
            indent={selectedIndent}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Indent"
        description="Are you sure you want to delete this indent? This action cannot be undone."
      />
    </div>
  );
};
