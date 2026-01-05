/**
 * Indents Pipeline Page - Kanban view for Store Indents
 * Shows indents organized by status columns
 */

import { useState } from 'react';
import { Plus, Eye, CheckCircle, XCircle, AlertCircle, Package } from 'lucide-react';
import { toast } from 'sonner';
import { KanbanBoard, KanbanCard, KanbanColumn } from '../../components/workflow/KanbanBoard';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  useStoreIndents,
  useCreateStoreIndent,
  useSubmitStoreIndent,
  useCollegeAdminApprove,
  useCollegeAdminReject,
  useSuperAdminApprove,
  useSuperAdminReject,
} from '../../hooks/useStoreIndents';
import { StoreIndentPipeline } from './forms/StoreIndentPipeline';
import { PrepareDispatchDialog } from './PrepareDispatchDialog';

// Kanban columns matching indent statuses
const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'draft',
    title: 'Draft',
    status: 'draft',
    color: 'bg-slate-100',
  },
  {
    id: 'pending_college',
    title: 'College Approval',
    status: 'pending_college_approval',
    color: 'bg-blue-100',
  },
  {
    id: 'pending_super_admin',
    title: 'Super Admin',
    status: 'pending_super_admin',
    color: 'bg-purple-100',
  },
  {
    id: 'approved',
    title: 'Approved',
    status: 'super_admin_approved',
    color: 'bg-green-100',
  },
  {
    id: 'partially_fulfilled',
    title: 'Partial',
    status: 'partially_fulfilled',
    color: 'bg-yellow-100',
  },
  {
    id: 'fulfilled',
    title: 'Fulfilled',
    status: 'fulfilled',
    color: 'bg-emerald-100',
  },
];

export const IndentsPipelinePage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState<any>(null);
  const [dispatchIndentId, setDispatchIndentId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const { data, isLoading, refetch } = useStoreIndents(filters);
  const createMutation = useCreateStoreIndent();
  const submitMutation = useSubmitStoreIndent();
  const collegeApproveMutation = useCollegeAdminApprove();
  const collegeRejectMutation = useCollegeAdminReject();
  const superAdminApproveMutation = useSuperAdminApprove();
  const superAdminRejectMutation = useSuperAdminReject();

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSubmitNew = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Indent created successfully');
      setIsCreateDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create indent');
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

  const handleApprove = async (indent: any) => {
    try {
      if (indent.status === 'pending_college_approval') {
        await collegeApproveMutation.mutateAsync({ id: indent.id, data: {} });
        toast.success('Indent approved and forwarded to Super Admin');
      } else if (indent.status === 'pending_super_admin') {
        await superAdminApproveMutation.mutateAsync({ id: indent.id, data: {} });
        toast.success('Indent approved');
      }
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve indent');
    }
  };

  const handleReject = async (indent: any) => {
    const reason = prompt('Please provide a rejection reason:');
    if (!reason) return;

    try {
      if (indent.status === 'pending_college_approval') {
        await collegeRejectMutation.mutateAsync({ id: indent.id, data: { rejection_reason: reason } });
      } else if (indent.status === 'pending_super_admin') {
        await superAdminRejectMutation.mutateAsync({ id: indent.id, data: { rejection_reason: reason } });
      }
      toast.success('Indent rejected');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject indent');
    }
  };

  // Get stock availability color
  const getStockIndicator = (indent: any) => {
    // This would be calculated based on items availability
    // For now, return a placeholder
    return {
      icon: Package,
      label: `${indent.items?.length || 0} items`,
      color: 'text-blue-500',
    };
  };

  // Convert indents to Kanban cards
  const kanbanCards: KanbanCard[] = (data?.results || [])
    .filter((indent: any) => {
      // Apply search filter
      if (searchTerm && !indent.indent_number.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // Apply priority filter
      if (priorityFilter !== 'all' && indent.priority !== priorityFilter) {
        return false;
      }
      return true;
    })
    .map((indent: any) => {
      const card: KanbanCard = {
        id: indent.id,
        status: indent.status,
        title: indent.indent_number,
        subtitle: `Due: ${new Date(indent.required_by_date).toLocaleDateString()}`,
        badges: [
          {
            label: indent.priority,
            variant:
              indent.priority === 'urgent'
                ? 'destructive'
                : indent.priority === 'high'
                ? 'outline'
                : 'secondary',
          },
        ],
        indicators: [
          getStockIndicator(indent),
          {
            icon: AlertCircle,
            label: indent.college_name || `College #${indent.college}`,
            color: 'text-muted-foreground',
          },
        ],
        onCardClick: () => setSelectedIndent(indent),
      };

      // Add status-specific actions
      if (indent.status === 'draft') {
        card.primaryAction = {
          label: 'Submit',
          onClick: () => handleSubmitIndent(indent),
        };
        card.secondaryActions = [
          {
            label: 'View',
            icon: Eye,
            onClick: () => setSelectedIndent(indent),
          },
        ];
      } else if (indent.status === 'pending_college_approval') {
        card.primaryAction = {
          label: 'Approve',
          onClick: () => handleApprove(indent),
        };
        card.secondaryActions = [
          {
            label: 'Reject',
            icon: XCircle,
            onClick: () => handleReject(indent),
          },
        ];
      } else if (indent.status === 'pending_super_admin') {
        card.primaryAction = {
          label: 'Approve',
          onClick: () => handleApprove(indent),
        };
        card.secondaryActions = [
          {
            label: 'Reject',
            icon: XCircle,
            onClick: () => handleReject(indent),
          },
        ];
      } else if (indent.status === 'super_admin_approved') {
        card.primaryAction = {
          label: 'Prepare MIN',
          onClick: () => {
            // Open the prepare dispatch dialog
            setDispatchIndentId(indent.id);
          },
        };
      }

      return card;
    });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Store Indents</h1>
          <p className="text-muted-foreground">Track indent requests through the approval pipeline</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Indent
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by indent number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board */}
      <KanbanBoard columns={KANBAN_COLUMNS} cards={kanbanCards} isLoading={isLoading} />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Indent</DialogTitle>
          </DialogHeader>
          <StoreIndentPipeline
            onSubmit={handleSubmitNew}
            onCancel={() => setIsCreateDialogOpen(false)}
            isSubmitting={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Detail View Dialog - To be implemented */}
      {selectedIndent && (
        <Dialog open={!!selectedIndent} onOpenChange={() => setSelectedIndent(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Indent Details: {selectedIndent.indent_number}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Detail view with Stepper to be implemented...
              </p>
              <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                {JSON.stringify(selectedIndent, null, 2)}
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Prepare Dispatch Dialog */}
      <PrepareDispatchDialog
        open={!!dispatchIndentId}
        onOpenChange={(open) => !open && setDispatchIndentId(null)}
        indentId={dispatchIndentId}
        onSuccess={() => {
          setDispatchIndentId(null);
          refetch();
        }}
      />
    </div>
  );
};
