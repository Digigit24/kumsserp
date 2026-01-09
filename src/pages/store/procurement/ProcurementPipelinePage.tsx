/**
 * Procurement Pipeline Page - Kanban view for Requirements through GRN
 * Shows procurement workflow: REQ → QUOT → PO → GRN → Posted
 */

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, FileText, DollarSign, ShoppingCart, Package, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { KanbanBoard, KanbanCard, KanbanColumn } from '../../../components/workflow/KanbanBoard';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useRequirements, requirementKeys } from '../../../hooks/useProcurement';
import { CreateRequirementDialog } from './CreateRequirementDialog';
import { RequirementDetailDialog } from './RequirementDetailDialog';
import { ProcurementRequirement } from '../../../types/store.types';
import { procurementRequirementsApi } from '../../../services/store.service';
import { approvalsApi } from '../../../services/approvals.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

// Kanban columns for procurement workflow
const PROCUREMENT_COLUMNS: KanbanColumn[] = [
  {
    id: 'draft',
    title: 'Draft',
    status: 'draft',
    color: 'bg-slate-100',
  },
  {
    id: 'submitted',
    title: 'Submitted',
    status: 'submitted',
    color: 'bg-blue-50',
  },
  {
    id: 'pending_approval',
    title: 'Pending Approval',
    status: 'pending_approval',
    color: 'bg-blue-100',
  },
  {
    id: 'approved',
    title: 'Approved',
    status: 'approved',
    color: 'bg-green-100',
  },
  {
    id: 'quotations',
    title: 'Quotations Received',
    status: 'quotations_received',
    color: 'bg-purple-100',
  },
  {
    id: 'po_created',
    title: 'PO Created',
    status: 'po_created',
    color: 'bg-yellow-100',
  },
  {
    id: 'fulfilled',
    title: 'Fulfilled / Cancelled',
    status: ['fulfilled', 'cancelled'],
    color: 'bg-emerald-100',
  },
];

export const ProcurementPipelinePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRequirementId, setSelectedRequirementId] = useState<number | null>(null);

  // Confirmation Dialog State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    action: 'submit' | 'approve' | 'reject' | null;
    id: number | null;
    endpointFn: ((id: number, data?: any) => Promise<any>) | null;
  }>({
    isOpen: false,
    action: null,
    id: null,
    endpointFn: null,
  });

  const { data, isLoading, refetch } = useRequirements(filters);

  // Trigger confirmation dialog
  const handleStatusChange = (
    id: number,
    action: 'submit' | 'approve' | 'reject',
    endpointFn: ((id: number, data?: any) => Promise<any>) | null
  ) => {
    setConfirmState({
      isOpen: true,
      action,
      id,
      endpointFn,
    });
  };

  // Execute action after confirmation
  const executeStatusChange = async () => {
    const { id, action, endpointFn } = confirmState;
    if (!id) return;

    try {
      if (endpointFn) {
        // Handle actions with direct endpoints (like submit)
        await endpointFn(id, {});
      } else if (action === 'approve' || action === 'reject') {
        // Handle actions requiring the Approvals API
        // First, fetch the latest requirement details to get the approval_request ID
        const detail = await procurementRequirementsApi.get(id);
        
        if (!detail?.approval_request) {
           // If no approval request ID, we can't use the generic approvals API.
           // Check if we can use the direct endpoint as a fallback (though typically direct logic is inside the service)
           // If we are here, it means we probably wanted to use the generic review endpoint.
           throw new Error("No active approval request found for this requirement. It may have been deleted or the requirement is not in a pending state.");
        }
        
        console.log(`Attempting to ${action} approval request #${detail.approval_request}`);
        
        try {
            await approvalsApi.review(detail.approval_request, { action });
        } catch (approvalError: any) {
            console.error("Approval API Error:", approvalError);
            if (approvalError.message?.includes("No ApprovalRequest matches")) {
                throw new Error(`The approval request (ID: ${detail.approval_request}) was not found in the system. Please verify the request status.`);
            }
            throw approvalError;
        }
      }
      
      // Add a small delay for backend signals to propagate
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: requirementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: requirementKeys.detail(id) });
      
      refetch();
      toast.success(`Requirement ${action}d successfully`);

    } catch (error: any) {
      console.error(`Error ${action}ing requirement:`, error);
      
      let errorMessage = `Failed to ${action} requirement.`;
      if (error && typeof error === 'object') {
          errorMessage += ` ${error.message || error.detail || JSON.stringify(error)}`;
      } else {
          errorMessage += ` ${String(error)}`;
      }
      toast.error(errorMessage);
    } finally {
      // Close dialog
      setConfirmState({ isOpen: false, action: null, id: null, endpointFn: null });
    }
  };

  // Convert requirements to Kanban cards
  const kanbanCards: KanbanCard[] = (data?.results || [])
    .filter((req: ProcurementRequirement) => {
      if (searchTerm && !req.requirement_number.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    })
    .map((req: ProcurementRequirement) => {
      const card: KanbanCard = {
        id: req.id,
        status: req.status,
        title: req.requirement_number,
        subtitle: `Due: ${new Date(req.required_by_date).toLocaleDateString()}`,
        // ... (keep existing properties)
        badges: [
            {
              label: req.urgency,
              variant:
                req.urgency === 'urgent'
                  ? 'destructive'
                  : req.urgency === 'high'
                  ? 'outline'
                  : 'secondary',
            },
          ],
          indicators: [
            {
              icon: Package,
              label: `${req.items?.length || 0} items`,
              color: 'text-blue-500',
            },
            {
              icon: FileText,
              label: `Store #${req.central_store}`,
              color: 'text-muted-foreground',
            },
          ],
          onCardClick: () => setSelectedRequirementId(req.id),
          secondaryActions: [
            {
              label: 'View',
              icon: Eye,
              onClick: () => setSelectedRequirementId(req.id),
            },
          ],
      };

      // Add status-specific actions
      if (req.status === 'draft') {
        card.primaryAction = {
          label: 'Submit',
          onClick: () => {
            handleStatusChange(req.id, 'submit', procurementRequirementsApi.submitForApproval);
          },
        };
      } else if (req.status === 'submitted' || req.status === 'pending_approval') {
        card.primaryAction = {
          label: 'Approve',
          onClick: () => {
            handleStatusChange(req.id, 'approve', null);
          },
        };
        card.secondaryActions?.push({
            label: 'Reject',
            icon: FileText, 
            onClick: () => {
                handleStatusChange(req.id, 'reject', null);
            }
        })
      } else if (req.status === 'approved') {
        card.primaryAction = {
          label: 'Add Quotations',
          onClick: () => setSelectedRequirementId(req.id),
        };
      } else if (req.status === 'quotations_received') {
        card.primaryAction = {
          label: 'Select & Create PO',
          onClick: () => setSelectedRequirementId(req.id),
        };
      } else if (req.status === 'po_created') {
        card.primaryAction = {
          label: 'Receive Goods',
          onClick: () => setSelectedRequirementId(req.id),
        };
      }

      return card;
    });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Procurement Pipeline</h1>
          <p className="text-muted-foreground">
            Track requirements from submission to fulfillment
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Requirement
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by requirement number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-500 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-200 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-50 mb-1">Procurement Workflow</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-100 space-y-1">
              <li>
                • <strong>Draft → Submit:</strong> Create requirement and submit for approval
              </li>
              <li>
                • <strong>Approved → Quotations:</strong> Collect quotations from vendors
              </li>
              <li>
                • <strong>Select Quote → PO:</strong> Choose best quotation and create purchase order
              </li>
              <li>
                • <strong>PO → GRN:</strong> Receive goods and post to inventory
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard columns={PROCUREMENT_COLUMNS} cards={kanbanCards} isLoading={isLoading} />

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mt-8">
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Requirements</h3>
          </div>
          <p className="text-3xl font-bold">{data?.results?.length || 0}</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-purple-500" />
            <h3 className="font-semibold">Quotations</h3>
          </div>
          <p className="text-3xl font-bold">-</p>
          <p className="text-xs text-muted-foreground">To be calculated</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Purchase Orders</h3>
          </div>
          <p className="text-3xl font-bold">-</p>
          <p className="text-xs text-muted-foreground">To be calculated</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-5 w-5 text-emerald-500" />
            <h3 className="font-semibold">Goods Receipts</h3>
          </div>
          <p className="text-3xl font-bold">-</p>
          <p className="text-xs text-muted-foreground">To be calculated</p>
        </div>
      </div>

      {/* Create Requirement Dialog */}
      <CreateRequirementDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          refetch();
          setIsCreateDialogOpen(false);
        }}
      />

      {/* Requirement Detail Dialog */}
      <RequirementDetailDialog
        open={!!selectedRequirementId}
        onOpenChange={(open) => !open && setSelectedRequirementId(null)}
        requirementId={selectedRequirementId}
        onSuccess={() => {
          refetch();
          setSelectedRequirementId(null);
        }}
      />

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmState.isOpen} 
        onOpenChange={(open) => !open && setConfirmState(prev => ({ ...prev, isOpen: false }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to <strong>{confirmState.action}</strong> this requirement?
              {confirmState.action === 'reject' && (
                <span className="block mt-2 text-red-500">This action cannot be undone.</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button
              variant={confirmState.action === 'reject' ? 'destructive' : 'default'}
              onClick={executeStatusChange}
            >
              Confirm {confirmState.action && confirmState.action.charAt(0).toUpperCase() + confirmState.action.slice(1)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
