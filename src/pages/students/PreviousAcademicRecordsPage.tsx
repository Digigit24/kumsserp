/**
 * Previous Academic Records Page
 * Manages student previous academic records with CRUD operations
 */

import { useState } from 'react';
import { Column, DataTable } from '../../components/common/DataTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/ui/badge';
import { usePreviousAcademicRecords, useDeletePreviousAcademicRecord } from '../../hooks/useStudents';
import type { PreviousAcademicRecordFilters, PreviousAcademicRecordListItem } from '../../types/students.types';

export const PreviousAcademicRecordsPage = () => {
  const [filters, setFilters] = useState<PreviousAcademicRecordFilters>({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = usePreviousAcademicRecords(filters);
  const deleteMutation = useDeletePreviousAcademicRecord();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<PreviousAcademicRecordListItem | null>(null);

  const columns: Column<PreviousAcademicRecordListItem>[] = [
    {
      key: 'student_name',
      label: 'Student Name',
      sortable: true,
      className: 'font-semibold',
    },
    {
      key: 'level',
      label: 'Level',
      sortable: true,
      render: (record) => (
        <Badge variant="outline" className="capitalize">
          {record.level}
        </Badge>
      ),
    },
    {
      key: 'institution_name',
      label: 'Institution',
      sortable: true,
    },
    {
      key: 'year_of_passing',
      label: 'Year of Passing',
      sortable: true,
    },
    {
      key: 'percentage',
      label: 'Percentage',
      render: (record) => record.percentage || '-',
    },
    {
      key: 'grade',
      label: 'Grade',
      render: (record) => record.grade || '-',
    },
  ];

  const handleDelete = (record: PreviousAcademicRecordListItem) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (recordToDelete) {
      await deleteMutation.mutateAsync(recordToDelete.id);
      refetch();
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <DataTable
        title="Previous Academic Records"
        description="Manage student previous academic records (10th, 12th, UG, PG). Click on any row to view details."
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error}
        onRefresh={refetch}
        onDelete={handleDelete}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search academic records..."
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Previous Academic Record"
        description={`Are you sure you want to delete the ${recordToDelete?.level} record for "${recordToDelete?.student_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
};
