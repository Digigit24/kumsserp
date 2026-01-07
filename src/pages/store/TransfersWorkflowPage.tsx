/**
 * Transfers/MIN Workflow Page - Dispatch workflow for Material Issue Notes
 * Shows fulfillment queue and dispatch tracking
 */

import { useState } from 'react';
import { Truck, Package, CheckCircle, FileText, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { KanbanBoard, KanbanCard, KanbanColumn } from '../../components/workflow/KanbanBoard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import {
  useMaterialIssues,
  useDispatchMaterialIssue,
  useConfirmReceipt,
} from '../../hooks/useMaterialIssues';
import { useStoreIndents } from '../../hooks/useStoreIndents';
import { Badge } from '../../components/ui/badge';
import { PrepareDispatchDialog } from './PrepareDispatchDialog';

// Kanban columns for MIN statuses
const MIN_COLUMNS: KanbanColumn[] = [
  {
    id: 'prepared',
    title: 'Prepared',
    status: 'prepared',
    color: 'bg-blue-100',
  },
  {
    id: 'dispatched',
    title: 'Dispatched',
    status: 'dispatched',
    color: 'bg-purple-100',
  },
  {
    id: 'in_transit',
    title: 'In Transit',
    status: 'in_transit',
    color: 'bg-yellow-100',
  },
  {
    id: 'received',
    title: 'Received',
    status: 'received',
    color: 'bg-green-100',
  },
];

export const TransfersWorkflowPage = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [dispatchIndentId, setDispatchIndentId] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  // Fetch all material issues for the Kanban board (Prepared, Dispatched, etc.)
  const { data, isLoading, refetch } = useMaterialIssues({ 
    ordering: '-created_at',
    page_size: 1000
  });

  const { data: approvedIndentsData, refetch: refetchIndents } = useStoreIndents({
    status: 'super_admin_approved'
  });
  const dispatchMutation = useDispatchMaterialIssue();
  const confirmReceiptMutation = useConfirmReceipt();

  const handleDispatch = async (min: any) => {
    try {
      await dispatchMutation.mutateAsync({
        id: min.id,
        data: {
          dispatch_date: new Date().toISOString().split('T')[0],
        },
      });
      toast.success('Material dispatched successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to dispatch');
    }
  };

  const handleConfirmReceipt = async (min: any) => {
    if (confirmingId) return; // Prevent multiple clicks
    
    try {
      setConfirmingId(min.id);
      await confirmReceiptMutation.mutateAsync({
        id: min.id,
        data: {
          notes: 'Confirmed by college store',
        },
      });
      toast.success('Receipt confirmed successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to confirm receipt');
    } finally {
      setConfirmingId(null);
    }
  };

  // Convert MINs to Kanban cards
  const kanbanCards: KanbanCard[] = (data?.results || [])
    .filter((min: any) => {
      if (searchTerm && !min.min_number.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    })
    .map((min: any) => {
      const card: KanbanCard = {
        id: min.id,
        status: min.status,
        title: min.min_number,
        subtitle: `Issued: ${new Date(min.issue_date).toLocaleDateString()}`,
        badges: [
          {
            label: min.receiving_college_name || `College #${min.receiving_college}`,
            variant: 'secondary',
          },
        ],
        indicators: [
          {
            icon: Package,
            label: `${min.items?.length || 0} items`,
            color: 'text-blue-500',
          },
          {
            icon: FileText,
            label: min.central_store_name || `Store #${min.central_store}`,
            color: 'text-muted-foreground',
          },
        ],
        secondaryActions: [
          {
            label: 'View',
            icon: Eye,
            onClick: () => navigate('/store/material-issues'),
          },
        ],
      };

      // Add status-specific primary actions
      if (min.status === 'prepared') {
        card.primaryAction = {
          label: 'Dispatch',
          onClick: () => handleDispatch(min),
        };
      } else if (min.status === 'dispatched' || min.status === 'in_transit') {
        card.primaryAction = {
          label: 'Confirm Receipt',
          onClick: () => handleConfirmReceipt(min),
          loading: confirmingId === min.id,
          disabled: confirmingId !== null, // Optional: disable others while one is processing
        };
      }

      return card;
    });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Material Transfers</h1>
          <p className="text-muted-foreground">
            Track material issue notes from central stores to colleges
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by MIN number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Info Card for Central Store Managers */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Dispatch Workflow</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Prepared:</strong> MIN is ready. Click "Dispatch" to send.</li>
              <li>• <strong>Dispatched:</strong> Material is on the way. Waiting for college confirmation.</li>
              <li>• <strong>Received:</strong> College has confirmed receipt.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard columns={MIN_COLUMNS} cards={kanbanCards} isLoading={isLoading} />

      {/* Fulfillment Queue Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Fulfillment Queue</h2>
        <p className="text-muted-foreground mb-4">
          Approved indents ready to be fulfilled and dispatched
        </p>
        {approvedIndentsData?.results && approvedIndentsData.results.length > 0 ? (
          <div className="space-y-3">
            {approvedIndentsData.results.map((indent: any) => (
              <Card key={indent.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Indent Info */}
                    <div className="col-span-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{indent.indent_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {indent.college_name || `College #${indent.college}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">Priority</p>
                      <Badge
                        variant={
                          indent.priority === 'urgent'
                            ? 'destructive'
                            : indent.priority === 'high'
                            ? 'outline'
                            : 'secondary'
                        }
                        className="capitalize"
                      >
                        {indent.priority}
                      </Badge>
                    </div>

                    {/* Items Count */}
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">Items</p>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold">{indent.items?.length || 0}</span>
                      </div>
                    </div>

                    {/* Required By */}
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">Required By</p>
                      <p className="text-sm">
                        {new Date(indent.required_by_date).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="col-span-3 flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => console.log('View indent', indent)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setDispatchIndentId(indent.id)}
                      >
                        <Truck className="h-3 w-3 mr-1" />
                        Prepare Dispatch
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <p className="text-muted-foreground">
              No approved indents pending fulfillment
              <br />
              All indents have been processed
            </p>
          </div>
        )}
      </div>

      {/* Prepare Dispatch Dialog */}
      <PrepareDispatchDialog
        open={!!dispatchIndentId}
        onOpenChange={(open) => !open && setDispatchIndentId(null)}
        indentId={dispatchIndentId}
        onSuccess={() => {
          refetchIndents();
          refetch();
          setDispatchIndentId(null);
        }}
      />
    </div>
  );
};
