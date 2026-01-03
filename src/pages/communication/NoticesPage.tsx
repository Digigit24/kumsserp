// Notices Page
import { useState } from 'react';
import { format } from 'date-fns';
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { NoticeForm } from './forms/NoticeForm';
import {
  useNotices,
  useCreateNotice,
  useUpdateNotice,
  useDeleteNotice,
} from '../../hooks/useCommunication';
import { useAuth } from '../../hooks/useAuth';
import type { Notice, NoticeFilters } from '../../types/communication.types';

export const NoticesPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<NoticeFilters>({
    page: 1,
    page_size: 20,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Queries and mutations
  const { data, isLoading, refetch } = useNotices(filters);
  const createMutation = useCreateNotice();
  const updateMutation = useUpdateNotice();
  const deleteMutation = useDeleteNotice();

  const handleCreate = () => {
    setSelectedNotice(null);
    setIsFormOpen(true);
  };

  const handleEdit = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: any) => {
    try {
      // Transform data - convert empty strings to null and add college
      const transformedData = {
        ...formData,
        attachment: formData.attachment || null,
        college: user?.college || null,
      };

      if (selectedNotice) {
        await updateMutation.mutateAsync({
          id: selectedNotice.id,
          data: transformedData,
        });
        toast.success('Notice updated successfully');
      } else {
        await createMutation.mutateAsync(transformedData);
        toast.success('Notice created successfully');
      }
      setIsFormOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save notice');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Notice deleted successfully');
      setDeleteId(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete notice');
    }
  };

  const filteredNotices = data?.results.filter((notice) => {
    if (!searchQuery) return true;
    return (
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notices</h1>
          <p className="text-gray-500 mt-1">Manage and publish notices</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Notice
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <Input
          placeholder="Search by title or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Notices List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading notices...</p>
            </div>
          ) : !filteredNotices || filteredNotices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No notices found' : 'No notices yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Start by creating your first notice'}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Notice
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{notice.title}</h3>
                        {notice.is_urgent && (
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                        {notice.is_published ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            Draft
                          </Badge>
                        )}
                        {notice.is_active ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            Inactive
                          </Badge>
                        )}
                      </div>

                      {/* Content Preview */}
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {notice.content}
                      </p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Publish Date</p>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(notice.publish_date), 'PP')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Expiry Date</p>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(notice.expiry_date), 'PP')}
                          </p>
                        </div>
                        {notice.attachment && (
                          <div>
                            <p className="text-xs text-gray-500">Attachment</p>
                            <a
                              href={notice.attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              View Attachment
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Timestamps */}
                      <div className="mt-3 text-xs text-gray-500">
                        Created: {format(new Date(notice.created_at), 'PPp')}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(notice)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(notice.id)}
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
                {data.count} notices
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
              {selectedNotice ? 'Edit Notice' : 'New Notice'}
            </DialogTitle>
          </DialogHeader>
          <NoticeForm
            notice={selectedNotice || undefined}
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
        title="Delete Notice"
        description="Are you sure you want to delete this notice? This action cannot be undone."
        variant="destructive"
      />
    </div>
  );
};
