import React, { useState } from 'react';
import { Plus, Building2, MapPin, Phone, Mail, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCentralStores, useDeleteCentralStore } from '@/hooks/useCentralStores';
import { DataTable } from '@/components/common/DataTable';
import { DetailSidebar } from '@/components/common/DetailSidebar';
import type { CentralStore } from '@/types/store.types';

export const CentralStoresPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<CentralStore | null>(null);
  const [filters, setFilters] = useState({ page: 1, page_size: 10 });

  const { data, isLoading } = useCentralStores(filters);
  const deleteMutation = useDeleteCentralStore();

  const columns = [
    { header: 'Code', accessorKey: 'code' },
    { header: 'Name', accessorKey: 'name' },
    {
      header: 'Location',
      accessorKey: 'city',
      cell: (row: CentralStore) => `${row.city}, ${row.state}`,
    },
    { header: 'Contact', accessorKey: 'contact_phone' },
    { header: 'Email', accessorKey: 'contact_email' },
    {
      header: 'Status',
      accessorKey: 'is_active',
      cell: (row: CentralStore) => (
        <Badge variant={row.is_active ? 'success' : 'secondary'}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const handleView = (store: CentralStore) => {
    setSelectedStore(store);
    setIsSidebarOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this central store?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Central Stores</h1>
          <p className="text-muted-foreground">Manage central store locations</p>
        </div>
        <Button onClick={() => { setSelectedStore(null); setIsSidebarOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Central Store
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.results || []}
        isLoading={isLoading}
        onView={handleView}
        onDelete={handleDelete}
        pagination={{
          page: filters.page,
          pageSize: filters.page_size,
          total: data?.count || 0,
          onPageChange: (page) => setFilters({ ...filters, page }),
        }}
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title={selectedStore ? 'Store Details' : 'New Central Store'}
        mode="view"
      >
        {selectedStore && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {selectedStore.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Code</p>
                    <p>{selectedStore.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={selectedStore.is_active ? 'success' : 'secondary'}>
                      {selectedStore.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Address
                  </p>
                  <p>{selectedStore.address_line1}</p>
                  {selectedStore.address_line2 && <p>{selectedStore.address_line2}</p>}
                  <p>{selectedStore.city}, {selectedStore.state} - {selectedStore.pincode}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Contact
                  </p>
                  <p>{selectedStore.contact_phone}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </p>
                  <p>{selectedStore.contact_email}</p>
                </div>

                {selectedStore.manager_name && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" /> Manager
                    </p>
                    <p>{selectedStore.manager_name}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DetailSidebar>
    </div>
  );
};
