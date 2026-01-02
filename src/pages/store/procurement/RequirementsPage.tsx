import { useState } from 'react';
import { Send, Edit, Trash2, Plus, FileCheck } from 'lucide-react';
import { Column, DataTable } from '../../../components/common/DataTable';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  useRequirements,
  useCreateRequirement,
  useUpdateRequirement,
  useDeleteRequirement,
  useSubmitRequirementForApproval,
} from '../../../hooks/useProcurement';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { RequirementForm } from './forms/RequirementForm';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';

export const RequirementsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requirementToDelete, setRequirementToDelete] = useState<number | null>(null);

  const { data, isLoading, refetch } = useRequirements(filters);
  const createMutation = useCreateRequirement();
  const updateMutation = useUpdateRequirement();
  const deleteMutation = useDeleteRequirement();
  const submitMutation = useSubmitRequirementForApproval();

  const handleCreate = () => {
    setSelectedRequirement(null);
    setIsFormOpen(true);
  };

  const handleEdit = (requirement: any) => {
    setSelectedRequirement(requirement);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setRequirementToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!requirementToDelete) return;

    try {
      await deleteMutation.mutateAsync(requirementToDelete);
      toast.success('Requirement deleted successfully');
      refetch();
      setDeleteDialogOpen(false);
      setRequirementToDelete(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete requirement');
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedRequirement) {
        await updateMutation.mutateAsync({ id: selectedRequirement.id, data });
        toast.success('Requirement updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Requirement created successfully');
      }
      setIsFormOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save requirement');
    }
  };

  const handleSubmitForApproval = async (requirement: any) => {
    try {
      await submitMutation.mutateAsync({ id: requirement.id, data: requirement });
      toast.success('Requirement submitted for approval');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit requirement');
    }
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      draft: 'secondary',
      submitted: 'default',
      approved: 'outline',
      rejected: 'destructive',
      quotation_received: 'default',
      po_created: 'outline',
      completed: 'outline',
      cancelled: 'destructive',
    };
    return variants[status] || 'default';
  };

  const getUrgencyVariant = (urgency: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      low: 'secondary',
      medium: 'default',
      high: 'outline',
      urgent: 'destructive',
    };
    return variants[urgency] || 'default';
  };

  const columns: Column<any>[] = [
    {
      key: 'requirement_number',
      label: 'Req. Number',
      render: (row) => <span className="font-semibold">{row.requirement_number}</span>,
      sortable: true,
    },
    {
      key: 'title',
      label: 'Title',
      render: (row) => (
        <div className="max-w-xs truncate" title={row.title}>
          {row.title}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'required_by_date',
      label: 'Required By',
      render: (row) => new Date(row.required_by_date).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'urgency',
      label: 'Urgency',
      render: (row) => (
        <Badge variant={getUrgencyVariant(row.urgency)} className="capitalize">
          {row.urgency}
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
      key: 'estimated_budget',
      label: 'Budget',
      render: (row) => row.estimated_budget ? `₹${parseFloat(row.estimated_budget).toLocaleString()}` : '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {row.status === 'draft' && (
            <Button size="sm" onClick={() => handleSubmitForApproval(row)}>
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
          <h1 className="text-3xl font-bold">Procurement Requirements</h1>
          <p className="text-muted-foreground">Manage procurement requirements and requests</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Create Requirement
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
            <DialogTitle>{selectedRequirement ? 'Edit Requirement' : 'Create New Requirement'}</DialogTitle>
          </DialogHeader>
          <RequirementForm
            requirement={selectedRequirement}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Requirement"
        description="Are you sure you want to delete this requirement? This action cannot be undone."
      />
    </div>
  );
};
