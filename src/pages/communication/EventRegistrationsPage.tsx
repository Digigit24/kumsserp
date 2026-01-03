// Event Registrations Page
import { useState } from 'react';
import { format } from 'date-fns';
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EventRegistrationForm } from './forms/EventRegistrationForm';
import {
  useEventRegistrations,
  useCreateEventRegistration,
  useUpdateEventRegistration,
  useDeleteEventRegistration,
} from '../../hooks/useCommunication';
import type { EventRegistration, EventRegistrationFilters } from '../../types/communication.types';

export const EventRegistrationsPage = () => {
  const [filters, setFilters] = useState<EventRegistrationFilters>({
    page: 1,
    page_size: 20,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Queries and mutations
  const { data, isLoading, refetch } = useEventRegistrations(filters);
  const createMutation = useCreateEventRegistration();
  const updateMutation = useUpdateEventRegistration();
  const deleteMutation = useDeleteEventRegistration();

  const handleCreate = () => {
    setSelectedRegistration(null);
    setIsFormOpen(true);
  };

  const handleEdit = (registration: EventRegistration) => {
    setSelectedRegistration(registration);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (selectedRegistration) {
        await updateMutation.mutateAsync({
          id: selectedRegistration.id,
          data: formData,
        });
        toast.success('Registration updated successfully');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Registration created successfully');
      }
      setIsFormOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save registration');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Registration deleted successfully');
      setDeleteId(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete registration');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; icon: any }> = {
      pending: { className: 'bg-yellow-100 text-yellow-700', icon: Clock },
      confirmed: { className: 'bg-blue-100 text-blue-700', icon: CheckCircle },
      cancelled: { className: 'bg-red-100 text-red-700', icon: XCircle },
      attended: { className: 'bg-green-100 text-green-700', icon: CheckCircle },
      no_show: { className: 'bg-gray-100 text-gray-700', icon: XCircle },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant="secondary" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  const filteredRegistrations = data?.results.filter((reg) => {
    if (!searchQuery) return true;
    return (
      reg.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.event.toString().includes(searchQuery) ||
      reg.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Event Registrations</h1>
          <p className="text-gray-500 mt-1">Manage event registrations and attendance</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Registration
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <Input
          placeholder="Search by user ID, event ID, or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Registrations List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading registrations...</p>
            </div>
          ) : !filteredRegistrations || filteredRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No registrations found' : 'No registrations yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Start by creating your first event registration'}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Registration
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRegistrations.map((registration) => (
                <div
                  key={registration.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold">
                          Registration #{registration.id}
                        </h3>
                        {getStatusBadge(registration.status)}
                        {registration.is_active ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            Inactive
                          </Badge>
                        )}
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <div>
                            <p className="text-xs text-gray-500">Event ID</p>
                            <p className="font-medium">{registration.event}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <div>
                            <p className="text-xs text-gray-500">User ID</p>
                            <p className="font-medium truncate">{registration.user}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <div>
                            <p className="text-xs text-gray-500">Registration Date</p>
                            <p className="font-medium">
                              {format(new Date(registration.registration_date), 'PP')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <div>
                            <p className="text-xs text-gray-500">Created</p>
                            <p className="font-medium">
                              {format(new Date(registration.created_at), 'PP')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(registration)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(registration.id)}
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
                {data.count} registrations
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
            <DialogTitle>
              {selectedRegistration ? 'Edit Registration' : 'New Registration'}
            </DialogTitle>
          </DialogHeader>
          <EventRegistrationForm
            registration={selectedRegistration || undefined}
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
        title="Delete Registration"
        description="Are you sure you want to delete this registration? This action cannot be undone."
        variant="destructive"
      />
    </div>
  );
};
