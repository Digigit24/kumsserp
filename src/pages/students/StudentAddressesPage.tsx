/**
 * Student Addresses Page
 * Displays all student addresses with CRUD operations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentAddresses, useDeleteStudentAddress, useStudents } from '../../hooks/useStudents';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SideDrawer, SideDrawerContent } from '../../components/common/SideDrawer';
import { StudentAddressForm } from './components/StudentAddressForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { MapPin } from 'lucide-react';
import type { StudentAddress } from '../../types/students.types';

export const StudentAddressesPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useStudentAddresses(filters);
  const { data: studentsData } = useStudents({ page_size: 100, is_active: true });
  const deleteMutation = useDeleteStudentAddress();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<StudentAddress | null>(null);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

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

  const handleAdd = () => {
    setSelectedAddress(null);
    setSelectedStudentId(null);
    setAddressDialogOpen(true);
  };

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

  const handleFormSuccess = () => {
    refetch();
    setAddressDialogOpen(false);
    setSelectedStudentId(null);
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <DataTable
        title="Student Addresses"
        description="Manage all student addresses across the system"
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error}
        onRefresh={refetch}
        onAdd={handleAdd}
        onDelete={handleDelete}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search by student, city, state..."
        addButtonLabel="Add Address"
      />

      {/* Add Address Dialog with Student Selector */}
      <SideDrawer open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <SideDrawerContent
          title="Add Address"
          description="Select a student and add their address"
          size="md"
        >
          <div className="space-y-4">
            {/* Student Selector */}
            <div className="space-y-2">
              <Label>Select Student <span className="text-destructive">*</span></Label>
              <Select
                value={selectedStudentId?.toString() || ''}
                onValueChange={(value) => setSelectedStudentId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent>
                  {studentsData?.results?.map((student) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.full_name} ({student.admission_number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Show address form only when student is selected */}
            {selectedStudentId ? (
              <StudentAddressForm
                mode="create"
                studentId={selectedStudentId}
                onSuccess={handleFormSuccess}
                onCancel={() => setAddressDialogOpen(false)}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Please select a student to add address</p>
              </div>
            )}
          </div>
        </SideDrawerContent>
      </SideDrawer>

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
