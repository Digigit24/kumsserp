/**
 * Student Documents Page
 * Displays all student documents with CRUD operations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentDocuments, useDeleteStudentDocument, useStudents } from '../../hooks/useStudents';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SideDrawer, SideDrawerContent } from '../../components/common/SideDrawer';
import { UploadDocumentDialog } from './components/UploadDocumentDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { FileText, Upload } from 'lucide-react';
import type { StudentDocument } from '../../types/students.types';

export const StudentDocumentsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useStudentDocuments(filters);
  const { data: studentsData } = useStudents({ page_size: 100, is_active: true });
  const deleteMutation = useDeleteStudentDocument();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<StudentDocument | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

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

  const handleAdd = () => {
    setSelectedDocument(null);
    setSelectedStudentId(null);
    setUploadDialogOpen(true);
  };

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

  const handleUploadSuccess = () => {
    refetch();
    setUploadDialogOpen(false);
    setSelectedStudentId(null);
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <DataTable
        title="Student Documents"
        description="Manage all student documents across the system"
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error}
        onRefresh={refetch}
        onAdd={handleAdd}
        onDelete={handleDelete}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search by document name, type, student..."
        addButtonLabel="Upload Document"
      />

      {/* Upload Dialog with Student Selector */}
      <SideDrawer open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <SideDrawerContent
          title="Upload Document"
          description="Select a student and upload their document"
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

            {/* Show upload form only when student is selected */}
            {selectedStudentId ? (
              <UploadDocumentDialog
                open={true}
                onOpenChange={() => {}}
                studentId={selectedStudentId}
                onSuccess={handleUploadSuccess}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Upload className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Please select a student to upload document</p>
              </div>
            )}
          </div>
        </SideDrawerContent>
      </SideDrawer>

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
