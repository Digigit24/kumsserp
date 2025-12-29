/**
 * Guardians Page
 * Displays all guardians with CRUD operations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuardians, useDeleteGuardian } from '../../hooks/useStudents';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { GuardianForm } from './components/GuardianForm';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import type { StudentGuardian } from '../../types/students.types';

export const GuardiansPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useGuardians(filters);
  const deleteMutation = useDeleteGuardian();

  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('create');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<StudentGuardian | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Define table columns
  const columns: Column<StudentGuardian>[] = [
    {
      key: 'full_name',
      label: 'Guardian Name',
      sortable: true,
      render: (guardian) => (
        <div className="flex flex-col">
          <span className="font-medium">{guardian.first_name} {guardian.last_name}</span>
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
    {
      key: 'occupation',
      label: 'Occupation',
      render: (guardian) => guardian.occupation || '-',
    },
  ];

  const handleAdd = () => {
    setSelectedGuardian(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleEdit = (guardian: StudentGuardian) => {
    setSelectedGuardian(guardian);
    setSidebarMode('edit');
    setIsSidebarOpen(true);
  };

  const handleDelete = (guardian: StudentGuardian) => {
    setSelectedGuardian(guardian);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedGuardian) {
      await deleteMutation.mutateAsync(selectedGuardian.id);
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
        onFiltersChange={setFilters}
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
          mode={sidebarMode}
          guardian={selectedGuardian || undefined}
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
        loading={deleteMutation.isPending}
      />
    </div>
  );
};
