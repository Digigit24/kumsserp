// Chats Page
import { useState } from 'react';
import { format } from 'date-fns';
import {
  MessageSquare,
  Plus,
  Trash2,
  Check,
  CheckCheck,
  Paperclip,
  Send,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ChatForm } from './forms/ChatForm';
import {
  useChats,
  useCreateChat,
  useDeleteChat,
  useMarkChatAsRead,
} from '../../hooks/useCommunication';
import type { Chat, ChatFilters } from '../../types/communication.types';

export const ChatsPage = () => {
  const [filters, setFilters] = useState<ChatFilters>({
    page: 1,
    page_size: 50,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Queries and mutations
  const { data, isLoading, refetch } = useChats(filters);
  const createMutation = useCreateChat();
  const deleteMutation = useDeleteChat();
  const markAsReadMutation = useMarkChatAsRead();

  const handleCreate = () => {
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: any) => {
    try {
      await createMutation.mutateAsync(formData);
      toast.success('Message sent successfully');
      setIsFormOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Chat deleted successfully');
      setDeleteId(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete chat');
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsReadMutation.mutateAsync(id);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark as read');
    }
  };

  const filteredChats = data?.results.filter((chat) => {
    if (!searchQuery) return true;
    return (
      chat.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.receiver.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-500 mt-1">Send and receive direct messages</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : !filteredChats || filteredChats.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No messages found' : 'No messages yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Start a conversation by sending your first message'}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
                    !chat.is_read ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-sm">
                            From: {chat.sender}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-sm">
                            To: {chat.receiver}
                          </span>
                        </div>
                        {chat.is_read ? (
                          <CheckCheck className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Check className="w-4 h-4 text-gray-400" />
                        )}
                      </div>

                      {/* Message */}
                      <p className="text-gray-700 mb-2 whitespace-pre-wrap">
                        {chat.message}
                      </p>

                      {/* Attachment */}
                      {chat.attachment && (
                        <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                          <Paperclip className="w-4 h-4" />
                          <a
                            href={chat.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            View Attachment
                          </a>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          Sent: {format(new Date(chat.created_at), 'PPp')}
                        </span>
                        {chat.is_read && chat.read_at && (
                          <span>
                            Read: {format(new Date(chat.read_at), 'PPp')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!chat.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(chat.id)}
                          title="Mark as read"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(chat.id)}
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
                Showing {((filters.page || 1) - 1) * (filters.page_size || 50) + 1} to{' '}
                {Math.min((filters.page || 1) * (filters.page_size || 50), data.count)} of{' '}
                {data.count} messages
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <ChatForm
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
        variant="destructive"
      />
    </div>
  );
};
