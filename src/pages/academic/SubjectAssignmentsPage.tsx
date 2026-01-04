/**
 * Subject Assignments Page
 */

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSubjectAssignments, useDeleteSubjectAssignment } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SubjectAssignmentForm } from './components/SubjectAssignmentForm';
import type { SubjectAssignmentListItem, SubjectAssignmentFilters } from '../../types/academic.types';

export default function SubjectAssignmentsPage() {
    const [filters, setFilters] = useState<SubjectAssignmentFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useSubjectAssignments(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedSubjectAssignment, setSelectedSubjectAssignment] = useState<SubjectAssignmentListItem | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const deleteMutation = useDeleteSubjectAssignment();

    const columns: Column<SubjectAssignmentListItem>[] = [
        { key: 'subject_name', label: 'Subject', sortable: true, className: 'font-semibold' },
        { key: 'class_name', label: 'Class', sortable: true },
        { key: 'section_name', label: 'Section', sortable: true, render: (assignment) => assignment.section_name || '-' },
        { key: 'teacher_name', label: 'Teacher', sortable: true, render: (assignment) => assignment.teacher_name || <span className="text-muted-foreground">Not Assigned</span> },
        {
            key: 'is_optional',
            label: 'Type',
            render: (assignment) => (
                <Badge variant={assignment.is_optional ? 'secondary' : 'default'}>
                    {assignment.is_optional ? 'Optional' : 'Mandatory'}
                </Badge>
            ),
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (assignment) => (
                <Badge variant={assignment.is_active ? 'default' : 'secondary'}>
                    {assignment.is_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
    ];

    const handleRowClick = (subjectAssignment: SubjectAssignmentListItem) => {
        setSelectedSubjectAssignment(subjectAssignment);
        setSidebarMode('edit');
        setIsSidebarOpen(true);
    };

    const handleAdd = () => {
        setSelectedSubjectAssignment(null);
        setSidebarMode('create');
        setIsSidebarOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteMutation.mutate(deleteId);
            toast.success('Subject assignment deleted successfully');
            setDeleteId(null);
            setIsSidebarOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete subject assignment');
        }
    };

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Subject Assignments"
                description="Assign subjects to classes and teachers. Click on any row to edit."
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                onAdd={handleAdd}
                onRowClick={handleRowClick}
                filters={filters}
                onFiltersChange={setFilters}
                searchPlaceholder="Search assignments..."
                addButtonLabel="Add Assignment"
            />

            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title={sidebarMode === 'create' ? 'Create Subject Assignment' : 'Edit Subject Assignment'}
                mode={sidebarMode}
            >
                {sidebarMode === 'edit' && selectedSubjectAssignment && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setDeleteId(selectedSubjectAssignment.id)}
                            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
                <SubjectAssignmentForm mode={sidebarMode} subjectAssignmentId={selectedSubjectAssignment?.id} onSuccess={() => { setIsSidebarOpen(false); refetch(); }} onCancel={() => setIsSidebarOpen(false)} />
            </DetailSidebar>

            <ConfirmDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Subject Assignment"
                description="Are you sure you want to delete this subject assignment? This action cannot be undone."
                variant="destructive"
            />
        </div>
    );
}