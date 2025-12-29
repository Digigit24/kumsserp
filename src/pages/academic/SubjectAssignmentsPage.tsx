/**
 * Subject Assignments Page
 */

import { useState } from 'react';
import { useSubjectAssignments } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { SubjectAssignmentForm } from './components/SubjectAssignmentForm';
import type { SubjectAssignmentListItem, SubjectAssignmentFilters } from '../../types/academic.types';

export default function SubjectAssignmentsPage() {
    const [filters, setFilters] = useState<SubjectAssignmentFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useSubjectAssignments(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedSubjectAssignment, setSelectedSubjectAssignment] = useState<SubjectAssignmentListItem | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                <SubjectAssignmentForm mode={sidebarMode} subjectAssignmentId={selectedSubjectAssignment?.id} onSuccess={() => { setIsSidebarOpen(false); refetch(); }} onCancel={() => setIsSidebarOpen(false)} />
            </DetailSidebar>
        </div>
    );
}