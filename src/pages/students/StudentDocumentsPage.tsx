/**
 * Student Documents Page
 * Displays all student documents with CRUD operations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentDocuments, useDeleteStudentDocument } from '../../hooks/useStudentDocuments';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { FileText } from 'lucide-react';
import type { StudentDocument } from '../../types/students.types';

export const StudentDocumentsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useStudentDocuments(filters);
  const deleteMutation = useDeleteStudentDocument();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<StudentDocument | null>(null);

  // Define table columns
  const columns: Column<StudentDocument>[] = [
    {
      key: 'document_name',
      label: 'Document Name',
      sortable: true,
      render: (doc) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{doc.document_name}</span>
        </div>
      ),
    },
    {
      key: 'document_type',
      label: 'Type',
      render: (doc) => (
        <Badge variant="outline" className="capitalize">
          {doc.document_type.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      key: 'student_name',
      label: 'Student',
      render: (doc) => doc.student_name || `Student #${doc.student}`,
    },
    {
      key: 'is_verified',
      label: 'Status',
      render: (doc) => (
        <div className="flex gap-2">
          {doc.is_verified && <Badge variant="success">Verified</Badge>}
          {doc.is_active ? (
            <Badge variant="default">Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'uploaded_date',
      label: 'Uploaded',
      render: (doc) => new Date(doc.uploaded_date || doc.created_at).toLocaleDateString(),
    },
  ];

  const handleDelete = (document: StudentDocument) => {
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedDocument) {
      await deleteMutation.mutateAsync(selectedDocument.id);
      refetch();
      setDeleteDialogOpen(false);
      setSelectedDocument(null);
    }
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <DataTable
        title="Student Documents"
        description="View and manage all student documents across the system. To add documents, go to a specific student's detail page."
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error}
        onRefresh={refetch}
        onDelete={handleDelete}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search by document name, type, student..."
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
};
