// Message Logs Page
import { useState } from 'react';
import { format } from 'date-fns';
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { MessageLogForm } from './forms/MessageLogForm';
import {
  useMessageLogs,
  useCreateMessageLog,
  useUpdateMessageLog,
  useDeleteMessageLog,
} from '../../hooks/useCommunication';
import type { MessageLog, MessageLogFilters } from '../../types/communication.types';

export const MessageLogsPage = () => {
  const [filters, setFilters] = useState<MessageLogFilters>({
    page: 1,
    page_size: 20,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<MessageLog | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Queries and mutations
  const { data, isLoading, refetch } = useMessageLogs(filters);
  const createMutation = useCreateMessageLog();
  const updateMutation = useUpdateMessageLog();
  const deleteMutation = useDeleteMessageLog();

  const handleCreate = () => {
    setSelectedLog(null);
    setIsFormOpen(true);
  };

  const handleEdit = (log: MessageLog) => {
    setSelectedLog(log);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: any) => {
    try {
      // Transform datetime fields - convert empty strings to null
      const transformedData = {
        ...formData,
        sent_at: formData.sent_at || null,
        delivered_at: formData.delivered_at || null,
        error_message: formData.error_message || null,
        bulk_message: formData.bulk_message || null,
      };

      if (selectedLog) {
        await updateMutation.mutateAsync({
          id: selectedLog.id,
          data: transformedData,
        });
        toast.success('Message log updated successfully');
      } else {
        await createMutation.mutateAsync(transformedData);
        toast.success('Message log created successfully');
      }
      setIsFormOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save message log');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Message log deleted successfully');
      setDeleteId(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete message log');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; icon: any }> = {
      pending: { className: 'bg-yellow-100 text-yellow-700', icon: Clock },
      sent: { className: 'bg-blue-100 text-blue-700', icon: Mail },
      delivered: { className: 'bg-green-100 text-green-700', icon: CheckCircle },
      failed: { className: 'bg-red-100 text-red-700', icon: XCircle },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant="secondary" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredLogs = data?.results.filter((log) => {
    if (!searchQuery) return true;
    return (
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.phone_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recipient.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Message Logs</h1>
          <p className="text-gray-500 mt-1">Track and manage message delivery logs</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Message Log
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <Input
          placeholder="Search by message, phone/email, or recipient..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading message logs...</p>
            </div>
          ) : !filteredLogs || filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No logs found' : 'No message logs yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Start by creating your first message log'}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Message Log
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          {getMessageTypeIcon(log.message_type)}
                          <span className="font-medium text-sm uppercase">
                            {log.message_type}
                          </span>
                        </div>
                        {getStatusBadge(log.status)}
                        {log.is_active ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            Inactive
                          </Badge>
                        )}
                      </div>

                      {/* Message Preview */}
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {log.message}
                      </p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">
                            {log.message_type === 'sms' ? 'Phone' : 'Email'}
                          </p>
                          <p className="font-medium truncate">{log.phone_email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Recipient ID</p>
                          <p className="font-medium truncate">{log.recipient}</p>
                        </div>
                        {log.sent_at && (
                          <div>
                            <p className="text-xs text-gray-500">Sent At</p>
                            <p className="font-medium">
                              {format(new Date(log.sent_at), 'PPp')}
                            </p>
                          </div>
                        )}
                        {log.delivered_at && (
                          <div>
                            <p className="text-xs text-gray-500">Delivered At</p>
                            <p className="font-medium">
                              {format(new Date(log.delivered_at), 'PPp')}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Error Message */}
                      {log.error_message && (
                        <div className="mt-3 flex items-start gap-2 text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <p>{log.error_message}</p>
                        </div>
                      )}

                      {/* Timestamps */}
                      <div className="mt-3 text-xs text-gray-500">
                        Created: {format(new Date(log.created_at), 'PPp')}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(log)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(log.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.results.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">
                Showing {((filters.page || 1) - 1) * (filters.page_size || 20) + 1} to{' '}
                {Math.min((filters.page || 1) * (filters.page_size || 20), data.count)} of{' '}
                {data.count} logs
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.previous}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.next}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedLog ? 'Edit Message Log' : 'New Message Log'}
            </DialogTitle>
          </DialogHeader>
          <MessageLogForm
            messageLog={selectedLog || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Message Log"
        description="Are you sure you want to delete this message log? This action cannot be undone."
        variant="destructive"
      />
    </div>
  );
};
