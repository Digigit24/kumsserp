/**
 * Student Documents Page
 * Displays all student documents with CRUD operations
 */

import { isSuperAdmin, getCurrentUserCollege } from '@/utils/auth.utils';
import { FileText, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { CollegeField } from '../../components/common/CollegeField';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { SideDrawer, SideDrawerContent } from '../../components/common/SideDrawer';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuth } from '../../hooks/useAuth';
import { useColleges } from '../../hooks/useCore';
import { useDeleteStudentDocument, useStudentDocuments, useStudents } from '../../hooks/useStudents';
import type { StudentDocumentListItem } from '../../types/students.types';
import { UploadDocumentDialog } from './components/UploadDocumentDialog';

export const StudentDocumentsPage = () => {
  const { user } = useAuth();
  const isSuper = isSuperAdmin(user as any);
  const defaultCollegeId = getCurrentUserCollege(user as any);
  const { data: collegesData } = useColleges({ page_size: 100, is_active: true });

  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(
    isSuper ? null : defaultCollegeId
  );
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 20,
    ...(isSuper ? {} : defaultCollegeId ? { college: defaultCollegeId } : {}),
  });
  const { data, isLoading, error, refetch } = useStudentDocuments(filters);
  const studentFilters = {
    page_size: 100,
    is_active: true,
    ...(selectedCollegeId ? { college: selectedCollegeId } : {}),
  };
  const { data: studentsData } = useStudents(studentFilters);
  const deleteMutation = useDeleteStudentDocument();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<StudentDocumentListItem | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  const normalizeCollegeId = (value: any): number | null => {
    if (value === '' || value === undefined || value === null) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const handleCollegeChange = (collegeId: number | string) => {
    const parsedId = collegeId === '' ? null : Number(collegeId);
    const normalized = Number.isFinite(parsedId) ? (parsedId as number) : null;
    setSelectedCollegeId(normalized);
    setSelectedStudentId(null);
    setFilters((prev) => {
      const next = { ...prev, page: 1 };
      if (normalized) {
        return { ...next, college: normalized };
      }
      const { college, ...rest } = next as any;
      return rest;
    });
  };

  // Define table columns
  const columns: Column<any>[] = [
    {
      key: 'document_name',
      label: 'Document Name',
      sortable: true,
      render: (doc: StudentDocumentListItem) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{doc.document_name}</span>
        </div>
      ),
    },
    {
      key: 'document_type',
      label: 'Type',
      render: (doc: StudentDocumentListItem) => (
        <Badge variant="outline" className="capitalize">
          {doc.document_type.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      key: 'student_name',
      label: 'Student',
      render: (doc: StudentDocumentListItem) => doc.student_name || `Student #${doc.student}`,
    },
    {
      key: 'is_verified',
      label: 'Status',
      render: (doc: StudentDocumentListItem) => (
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
      render: (doc: StudentDocumentListItem) => new Date(doc.uploaded_date).toLocaleDateString(),
    },
  ];

  const handleAdd = () => {
    if (isSuper && !selectedCollegeId) {
      alert('Please select a college before uploading documents.');
      return;
    }
    setSelectedDocument(null);
    setSelectedStudentId(null);
    setUploadDialogOpen(true);
  };

  const handleDelete = (document: StudentDocumentListItem) => {
    if (isSuper && !selectedCollegeId) {
      alert('Please select a college before deleting documents.');
      return;
    }
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedDocument) {
      await deleteMutation.mutate(selectedDocument.id);
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

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters((prev) => {
      const next = { ...prev, ...newFilters };
      if (isSuper && Object.prototype.hasOwnProperty.call(newFilters, 'college')) {
        const parsed = normalizeCollegeId(newFilters.college);
        setSelectedCollegeId(parsed);
        setSelectedStudentId(null);
        if (parsed) {
          return { ...next, college: parsed };
        }
        const { college, ...rest } = next as any;
        return rest;
      }
      return next;
    });
  };

  useEffect(() => {
    if (!selectedCollegeId) {
      setSelectedStudentId(null);
    }
  }, [selectedCollegeId]);

  const filteredStudents =
    studentsData?.results?.filter((student) =>
      selectedCollegeId ? student.college === selectedCollegeId : true
    ) || [];

  const disableStudentSelection = isSuper && !selectedCollegeId;

  // Define filter configuration
  const filterConfig: FilterConfig[] = [
    ...(isSuper ? [{
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
      {isSuper && (
        <div className="mb-4">
          <CollegeField
            value={selectedCollegeId}
            onChange={handleCollegeChange}
            placeholder="Select college to filter students"
          />
        </div>
      )}
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
        onFiltersChange={handleFiltersChange}
        filterConfig={filterConfig}
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
                disabled={disableStudentSelection}
                onValueChange={(value) => setSelectedStudentId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={disableStudentSelection ? "Select college to load students" : "Choose a student..."} />
                </SelectTrigger>
                <SelectContent>
                  {filteredStudents.map((student) => (
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
                onOpenChange={() => { }}
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
        loading={deleteMutation.isLoading}
      />
    </div>
  );
};
