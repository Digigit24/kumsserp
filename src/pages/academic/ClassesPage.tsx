/**
 * Classes Page
 */

import { useState } from 'react';
import { useClasses } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { ClassForm } from './components/ClassForm';
import type { ClassListItem, ClassFilters } from '../../types/academic.types';

export default function ClassesPage() {
    const [filters, setFilters] = useState<ClassFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useClasses(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedClass, setSelectedClass] = useState<ClassListItem | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const columns: Column<ClassListItem>[] = [
        { key: 'name', label: 'Class Name', sortable: true, className: 'font-semibold' },
        { key: 'program_name', label: 'Program', sortable: true },
        { key: 'session_name', label: 'Session', sortable: true },
        { key: 'semester', label: 'Semester', sortable: true, render: (cls) => `Semester ${cls.semester}` },
        { key: 'year', label: 'Year', sortable: true, render: (cls) => `Year ${cls.year}` },
        { key: 'college_name', label: 'College', sortable: true },
        {
            key: 'is_active',
            label: 'Status',
            render: (cls) => <Badge variant={cls.is_active ? 'default' : 'secondary'}>{cls.is_active ? 'Active' : 'Inactive'}</Badge>,
        },
    ];

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Classes"
                description="Manage academic classes for programs and sessions"
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                onAdd={() => { setSelectedClass(null); setSidebarMode('create'); setIsSidebarOpen(true); }}
                filters={filters}
                onFiltersChange={setFilters}
                searchPlaceholder="Search classes..."
                addButtonLabel="Add Class"
            />

            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title={sidebarMode === 'create' ? 'Create Class' : sidebarMode === 'edit' ? 'Edit Class' : 'Class Details'}
                mode={sidebarMode}
            >
                <ClassForm mode={sidebarMode} classId={selectedClass?.id} onSuccess={() => { setIsSidebarOpen(false); refetch(); }} onCancel={() => setIsSidebarOpen(false)} />
            </DetailSidebar>
        </div>
    );
}