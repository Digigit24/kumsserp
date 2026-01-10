/**
 * Rooms Page - Manage hostel rooms
 */

import { useState } from 'react';
import { Column, DataTable } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { useRooms, useCreateRoom, useUpdateRoom, useDeleteRoom } from '../../hooks/useHostel';
import { RoomForm } from './components/RoomForm';
import { toast } from 'sonner';

const RoomsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selected, setSelected] = useState<any | null>(null);

  const { data, isLoading, error, refetch } = useRooms(filters);
  const create = useCreateRoom();
  const update = useUpdateRoom();
  const del = useDeleteRoom();

  const columns: Column<any>[] = [
    { key: 'room_number', label: 'Room Number', render: (item) => <span className="font-semibold text-primary">{item.room_number}</span>, sortable: true },
    { key: 'hostel', label: 'Hostel', render: (item) => item.hostel_name || `Hostel #${item.hostel}`, sortable: true },
    { key: 'room_type', label: 'Room Type', render: (item) => item.room_type_name || `Type #${item.room_type}` },
    { key: 'floor', label: 'Floor', render: (item) => item.floor },
    { key: 'capacity', label: 'Capacity', render: (item) => item.capacity },
    { key: 'occupied_beds', label: 'Occupied', render: (item) => item.occupied_beds },
    { key: 'is_active', label: 'Status', render: (item) => <Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge> },
  ];

  const handleRowClick = (item: any) => { setSelected(item); setSidebarMode('view'); setIsSidebarOpen(true); };
  const handleAddNew = () => { setSelected(null); setSidebarMode('create'); setIsSidebarOpen(true); };
  const handleEdit = () => setSidebarMode('edit');

  const handleFormSubmit = async (formData: any) => {
    try {
      if (sidebarMode === 'create') {
        await create.mutateAsync(formData);
        toast.success('Room created successfully');
      } else {
        await update.mutateAsync({ id: selected.id, data: formData });
        toast.success('Room updated successfully');
      }
      setIsSidebarOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save room');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await del.mutateAsync(selected.id);
        toast.success('Room deleted successfully');
        setIsSidebarOpen(false);
        refetch();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete room');
      }
    }
  };

  return (
    <div>
      <DataTable title="Rooms" description="Manage hostel rooms" columns={columns} data={data || null} isLoading={isLoading} error={error?.message || null}
        filters={filters} onFiltersChange={setFilters} onRowClick={handleRowClick} onRefresh={refetch} onAdd={handleAddNew} addButtonLabel="Add Room" />

      <DetailSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}
        title={sidebarMode === 'create' ? 'Create Room' : sidebarMode === 'edit' ? 'Edit Room' : 'Room Details'}
        mode={sidebarMode} onEdit={handleEdit} onDelete={handleDelete} data={selected}>
        {(sidebarMode === 'create' || sidebarMode === 'edit') && (
          <RoomForm item={sidebarMode === 'edit' ? selected : null} onSubmit={handleFormSubmit} onCancel={() => setIsSidebarOpen(false)} />
        )}
        {sidebarMode === 'view' && selected && (
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-muted-foreground">Room Number</label><p className="text-base font-semibold">{selected.room_number}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Hostel</label><p className="text-base">{selected.hostel_name || `Hostel #${selected.hostel}`}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Room Type</label><p className="text-base">{selected.room_type_name || `Type #${selected.room_type}`}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Floor</label><p className="text-base">{selected.floor}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Capacity</label><p className="text-base">{selected.capacity}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Occupied Beds</label><p className="text-base">{selected.occupied_beds}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Status</label><Badge variant={selected.is_active ? 'default' : 'secondary'}>{selected.is_active ? 'Active' : 'Inactive'}</Badge></div>
          </div>
        )}
      </DetailSidebar>
    </div>
  );
};

export default RoomsPage;
