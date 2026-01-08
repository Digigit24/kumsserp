/**
 * Guardians Page
 * Displays all guardians with CRUD operations
 */

import { useState } from 'react';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { useAuth } from '../../hooks/useAuth';
import { useColleges } from '../../hooks/useCore';
import { useDeleteGuardian, useGuardians } from '../../hooks/useStudents';
import type { GuardianListItem } from '../../types/students.types';
import { isSuperAdmin } from '../../utils/auth.utils';
import { GuardianForm } from './components/GuardianForm';

export const GuardiansPage = () => {
  const { user } = useAuth();
  const { data: collegesData } = useColleges({ page_size: 100, is_active: true });

  const [filters, setFilters] = useState({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useGuardians(filters);
  const deleteMutation = useDeleteGuardian();

  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('create');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<GuardianListItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Define table columns
  const columns: Column<GuardianListItem>[] = [
    {
      key: 'full_name',
      label: 'Guardian Name',
      sortable: true,
      render: (guardian) => (
        <div className="flex flex-col">
          <span className="font-medium">{guardian.full_name}</span>
          <span className="text-xs text-muted-foreground capitalize">{guardian.relation}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (guardian) => guardian.email || '-',
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (guardian) => guardian.phone || '-',
    },
  ];

  const handleAdd = () => {
    setSelectedGuardian(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleEdit = (guardian: GuardianListItem) => {
    setSelectedGuardian(guardian);
    setSidebarMode('edit');
    setIsSidebarOpen(true);
  };

  const handleDelete = (guardian: GuardianListItem) => {
    setSelectedGuardian(guardian);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedGuardian) {
      await deleteMutation.mutate(selectedGuardian.id);
      refetch();
      setDeleteDialogOpen(false);
      setSelectedGuardian(null);
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedGuardian(null);
  };

  const handleFormSuccess = () => {
    setIsSidebarOpen(false);
    setSelectedGuardian(null);
    refetch();
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Define filter configuration
  const filterConfig: FilterConfig[] = [
    ...(isSuperAdmin(user as any) ? [{
      name: 'college',
      label: 'College',
      type: 'select' as const,
      options: [
        { value: '', label: 'All Colleges' },
        ...(collegesData?.results.map(c => ({ value: c.id.toString(), label: c.name })) || [])
      ],
    }] : []),
  ];

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <DataTable
        title="Guardians"
        description="Manage all guardian records for students"
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error}
        onRefresh={refetch}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        filterConfig={filterConfig}
        searchPlaceholder="Search by name, email, phone..."
        addButtonLabel="Add Guardian"
      />

      {/* Create/Edit Sidebar */}
      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Add New Guardian' : 'Edit Guardian'}
        mode={sidebarMode}
        width="lg"
      >
        <GuardianForm
          mode={sidebarMode === 'view' ? 'edit' : sidebarMode}
          // Cast to any because Form might expect full object, but will fetch or handle partial
          guardian={selectedGuardian as any}
          onSuccess={handleFormSuccess}
          onCancel={handleCloseSidebar}
        />
      </DetailSidebar>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Guardian"
        description="Are you sure you want to delete this guardian? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        loading={deleteMutation.isLoading}
      />
    </div>
  );
};
