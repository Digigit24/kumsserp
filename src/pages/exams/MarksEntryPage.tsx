/**
 * Marks Entry Page - Teacher View
 * Teachers can enter marks for students
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useStudentMarks, useCreateStudentMarks, useUpdateStudentMarks, useDeleteStudentMarks } from '../../hooks/useExamination';
import { StudentMarksForm } from './forms';
import { toast } from 'sonner';

const MarksEntryPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedMarks, setSelectedMarks] = useState<any | null>(null);

  // Fetch student marks using real API
  const { data, isLoading, error, refetch } = useStudentMarks(filters);
  const createMutation = useCreateStudentMarks();
  const updateMutation = useUpdateStudentMarks();
  const deleteMutation = useDeleteStudentMarks();

  const columns: Column<any>[] = [
    { key: 'student_roll_number', label: 'Roll No', sortable: true },
    { key: 'student_name', label: 'Student Name', sortable: true },
    {
      key: 'theory_marks',
      label: 'Theory',
      render: (marks) => marks.theory_marks ?? '-',
    },
    {
      key: 'practical_marks',
      label: 'Practical',
      render: (marks) => marks.practical_marks ?? '-',
    },
    {
      key: 'internal_marks',
      label: 'Internal',
      render: (marks) => marks.internal_marks ?? '-',
    },
    {
      key: 'total_marks',
      label: 'Total',
      render: (marks) => <span className="font-semibold">{marks.total_marks}</span>,
      sortable: true,
    },
    {
      key: 'is_absent',
      label: 'Status',
      render: (marks) => (
        <Badge variant={marks.is_absent ? 'destructive' : 'success'}>
          {marks.is_absent ? 'Absent' : 'Present'}
        </Badge>
      ),
    },
    {
      key: 'grade',
      label: 'Grade',
      render: (marks) => marks.grade || '-',
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'is_absent',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'false', label: 'Present' },
        { value: 'true', label: 'Absent' },
      ],
    },
  ];

  const handleAddNew = () => {
    setSelectedMarks(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (marks: StudentMarks) => {
    setSelectedMarks(marks);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (sidebarMode === 'edit' && selectedMarks?.id) {
        await updateMutation.mutateAsync({ id: selectedMarks.id, data });
        toast.success('Student marks updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Student marks created successfully');
      }
      setIsSidebarOpen(false);
      refetch();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to save student marks';
      toast.error(errorMessage);
      console.error('Failed to save student marks:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedMarks?.id) return;

    if (window.confirm('Are you sure you want to delete these marks?')) {
      try {
        await deleteMutation.mutateAsync(selectedMarks.id);
        toast.success('Student marks deleted successfully');
        setIsSidebarOpen(false);
        refetch();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete student marks');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedMarks(null);
  };

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold">Marks Entry</h1>
        <p className="text-muted-foreground">Enter and manage student marks</p>
      </div>

      <DataTable
        title="Student Marks"
        description="View and enter marks for students"
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
        searchPlaceholder="Search students..."
        addButtonLabel="Add Marks"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Enter Student Marks' : `${selectedMarks?.student_name || 'Student'} Marks`}
        mode={sidebarMode}
        width="lg"
      >
        {sidebarMode === 'view' && selectedMarks ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Roll Number</h3>
                <p className="mt-1 text-lg">{selectedMarks.student_roll_number}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Student Name</h3>
                <p className="mt-1 text-lg">{selectedMarks.student_name}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Theory Marks</h3>
                <p className="mt-1">{selectedMarks.theory_marks ?? '-'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Practical Marks</h3>
                <p className="mt-1">{selectedMarks.practical_marks ?? '-'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Internal Marks</h3>
                <p className="mt-1">{selectedMarks.internal_marks ?? '-'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Marks</h3>
              <p className="mt-1 text-lg font-semibold">{selectedMarks.total_marks}</p>
            </div>
            {selectedMarks.grade && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Grade</h3>
                <p className="mt-1">{selectedMarks.grade}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedMarks.is_absent ? 'destructive' : 'success'}>
                  {selectedMarks.is_absent ? 'Absent' : 'Present'}
                </Badge>
              </p>
            </div>
            {selectedMarks.remarks && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Remarks</h3>
                <p className="mt-1">{selectedMarks.remarks}</p>
              </div>
            )}
            <div className="pt-4 flex gap-2">
              <Button onClick={handleEdit}>Edit</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        ) : (
          <StudentMarksForm
            marks={sidebarMode === 'edit' ? selectedMarks : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default MarksEntryPage;
