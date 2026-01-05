/**
 * Procurement Pipeline Page - Kanban view for Requirements through GRN
 * Shows procurement workflow: REQ → QUOT → PO → GRN → Posted
 */

import { useState } from 'react';
import { Plus, FileText, DollarSign, ShoppingCart, Package, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { KanbanBoard, KanbanCard, KanbanColumn } from '../../../components/workflow/KanbanBoard';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useRequirements } from '../../../hooks/useProcurement';

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
    title: 'Quotations',
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
    title: 'Fulfilled',
    status: 'fulfilled',
    color: 'bg-emerald-100',
  },
];

export const ProcurementPipelinePage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useRequirements(filters);

  // Convert requirements to Kanban cards
  const kanbanCards: KanbanCard[] = (data?.results || [])
    .filter((req: any) => {
      if (searchTerm && !req.requirement_number.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    })
    .map((req: any) => {
      const card: KanbanCard = {
        id: req.id,
        status: req.status,
        title: req.requirement_number,
        subtitle: `Due: ${new Date(req.required_by_date).toLocaleDateString()}`,
        badges: [
          {
            label: req.priority,
            variant:
              req.priority === 'urgent'
                ? 'destructive'
                : req.priority === 'high'
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
            label: req.department_name || 'Department',
            color: 'text-muted-foreground',
          },
        ],
        secondaryActions: [
          {
            label: 'View',
            icon: Eye,
            onClick: () => console.log('View requirement', req),
          },
        ],
      };

      // Add status-specific actions
      if (req.status === 'draft') {
        card.primaryAction = {
          label: 'Submit',
          onClick: () => navigate('/procurement/requirements'),
        };
      } else if (req.status === 'submitted') {
        card.primaryAction = {
          label: 'Approve',
          onClick: () => navigate('/procurement/requirements'),
        };
      } else if (req.status === 'approved') {
        card.primaryAction = {
          label: 'Add Quotations',
          onClick: () => navigate('/procurement/quotations'),
        };
      } else if (req.status === 'quotations_received') {
        card.primaryAction = {
          label: 'Select & Create PO',
          onClick: () => navigate('/procurement/purchase-orders'),
        };
      } else if (req.status === 'po_created') {
        card.primaryAction = {
          label: 'Receive Goods',
          onClick: () => navigate('/procurement/goods-receipts'),
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
        <Button onClick={() => navigate('/procurement/requirements')}>
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ShoppingCart className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Procurement Workflow</h3>
            <ul className="text-sm text-blue-800 space-y-1">
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
    </div>
  );
};
