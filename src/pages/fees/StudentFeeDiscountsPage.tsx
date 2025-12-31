/**
 * Student Fee Discounts Page
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useStudentFeeDiscounts, useCreateStudentFeeDiscount, useUpdateStudentFeeDiscount, useDeleteStudentFeeDiscount } from '../../hooks/useFees';
import { StudentFeeDiscount } from '../../types/fees.types';
import { StudentFeeDiscountForm } from './forms/StudentFeeDiscountForm';
import { toast } from 'sonner';

const StudentFeeDiscountsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedDiscount, setSelectedDiscount] = useState<StudentFeeDiscount | null>(null);

  const { data, isLoading, error, refetch } = useStudentFeeDiscounts(filters);
  const createStudentFeeDiscount = useCreateStudentFeeDiscount();
  const updateStudentFeeDiscount = useUpdateStudentFeeDiscount();
  const deleteStudentFeeDiscount = useDeleteStudentFeeDiscount();

  const columns: Column<StudentFeeDiscount>[] = [
    { key: 'student_name', label: 'Student', sortable: false },
    { key: 'discount_name', label: 'Discount', sortable: false },
    { key: 'applied_date', label: 'Applied Date', sortable: true },
    { key: 'remarks', label: 'Remarks', sortable: false },
    {
      key: 'is_active',
      label: 'Status',
      render: (discount) => (
        <Badge variant={discount.is_active ? 'success' : 'destructive'}>
          {discount.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'is_active',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' },
      ],
    },
  ];

  const handleAddNew = () => {
    setSelectedDiscount(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (discount: StudentFeeDiscount) => {
    setSelectedDiscount(discount);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (data: Partial<StudentFeeDiscount>) => {
    try {
      if (sidebarMode === 'create') {
        await createStudentFeeDiscount.mutateAsync(data);
        toast.success('Student fee discount created successfully');
      } else if (sidebarMode === 'edit' && selectedDiscount) {
        await updateStudentFeeDiscount.mutateAsync({ id: selectedDiscount.id, data });
        toast.success('Student fee discount updated successfully');
      }
      setIsSidebarOpen(false);
      setSelectedDiscount(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred');
      console.error('Form submission error:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedDiscount) return;

    if (confirm('Are you sure you want to delete this student fee discount?')) {
      try {
        await deleteStudentFeeDiscount.mutateAsync(selectedDiscount.id);
        toast.success('Student fee discount deleted successfully');
        setIsSidebarOpen(false);
        setSelectedDiscount(null);
        refetch();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete student fee discount');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedDiscount(null);
  };

  return (
    <div className="">
      <DataTable
        title="Student Fee Discounts"
        description="View and manage student fee discounts"
        columns={columns}
        data={data}
        isLoading={isLoading}
        error={error?.message}
        onRefresh={refetch}
        onAdd={handleAddNew}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search student fee discounts..."
        addButtonLabel="Add Student Fee Discount"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Student Fee Discount' : 'Student Fee Discount Details'}
        mode={sidebarMode}
      >
        {sidebarMode === 'view' && selectedDiscount ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Student</h3>
              <p className="mt-1 text-lg font-semibold">{selectedDiscount.student_name || `ID: ${selectedDiscount.student}`}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Discount</h3>
              <p className="mt-1 text-lg">{selectedDiscount.discount_name || `ID: ${selectedDiscount.discount}`}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Applied Date</h3>
              <p className="mt-1 text-lg">{selectedDiscount.applied_date}</p>
            </div>
            {selectedDiscount.remarks && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Remarks</h3>
                <p className="mt-1">{selectedDiscount.remarks}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedDiscount.is_active ? 'success' : 'destructive'}>
                  {selectedDiscount.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEdit} className="flex-1">Edit</Button>
              <Button onClick={handleDelete} variant="destructive" className="flex-1">Delete</Button>
            </div>
          </div>
        ) : (
          <StudentFeeDiscountForm
            studentFeeDiscount={sidebarMode === 'edit' ? selectedDiscount : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default StudentFeeDiscountsPage;
