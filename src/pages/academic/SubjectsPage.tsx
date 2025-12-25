/**
 * Subjects Page
 */

import { useState } from 'react';
import { useSubjects } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { SubjectForm } from './components/SubjectForm';
import type { SubjectListItem, SubjectFilters } from '../../types/academic.types';

export default function SubjectsPage() {
    const [filters, setFilters] = useState<SubjectFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useSubjects(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedSubject, setSelectedSubject] = useState<SubjectListItem | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const columns: Column<SubjectListItem>[] = [
        { key: 'code', label: 'Code', sortable: true, className: 'font-medium' },
        { key: 'name', label: 'Subject Name', sortable: true, className: 'font-semibold' },
        { key: 'short_name', label: 'Short Name', sortable: true },
        { key: 'subject_type', label: 'Type', render: (subject) => <Badge variant="outline">{subject.subject_type}</Badge> },
        { key: 'credits', label: 'Credits', sortable: true },
        { key: 'college_name', label: 'College', sortable: true },
        {
            key: 'is_active',
            label: 'Status',
            render: (subject) => <Badge variant={subject.is_active ? 'default' : 'secondary'}>{subject.is_active ? 'Active' : 'Inactive'}</Badge>,
        },
    ];

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Subjects"
                description="Manage academic subjects and courses"
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                onAdd={() => { setSelectedSubject(null); setSidebarMode('create'); setIsSidebarOpen(true); }}
                filters={filters}
                onFiltersChange={setFilters}
                searchPlaceholder="Search subjects..."
                addButtonLabel="Add Subject"
            />

            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title={sidebarMode === 'create' ? 'Create Subject' : sidebarMode === 'edit' ? 'Edit Subject' : 'Subject Details'}
                mode={sidebarMode}
            >
                <SubjectForm mode={sidebarMode} subjectId={selectedSubject?.id} onSuccess={() => { setIsSidebarOpen(false); refetch(); }} onCancel={() => setIsSidebarOpen(false)} />
            </DetailSidebar>
        </div>
    );
}