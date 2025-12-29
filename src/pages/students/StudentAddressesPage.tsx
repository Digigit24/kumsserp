/**
 * Student Addresses Page
 * Displays all student addresses with CRUD operations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentAddresses, useDeleteStudentAddress } from '../../hooks/useStudentAddresses';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { MapPin } from 'lucide-react';
import type { StudentAddress } from '../../types/students.types';

export const StudentAddressesPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useStudentAddresses(filters);
  const deleteMutation = useDeleteStudentAddress();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<StudentAddress | null>(null);

  // Define table columns
  const columns: Column<StudentAddress>[] = [
    {
      key: 'address_type',
      label: 'Type',
      render: (address) => (
        <Badge variant="outline" className="capitalize">
          {address.address_type}
        </Badge>
      ),
    },
    {
      key: 'student_name',
      label: 'Student',
      render: (address) => address.student_name || `Student #${address.student}`,
    },
    {
      key: 'address',
      label: 'Address',
      render: (address) => (
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
          <div>
            <p className="font-medium">{address.address_line1}</p>
            {address.address_line2 && (
              <p className="text-sm text-muted-foreground">{address.address_line2}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {address.city}, {address.state} - {address.pincode}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'country',
      label: 'Country',
      render: (address) => address.country,
    },
  ];

  const handleDelete = (address: StudentAddress) => {
    setSelectedAddress(address);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedAddress) {
      await deleteMutation.mutateAsync(selectedAddress.id);
      refetch();
      setDeleteDialogOpen(false);
      setSelectedAddress(null);
    }
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <DataTable
        title="Student Addresses"
        description="View and manage all student addresses across the system. To add addresses, go to a specific student's detail page."
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error}
        onRefresh={refetch}
        onDelete={handleDelete}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search by student, city, state..."
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
};
