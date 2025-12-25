/**
 * Class Teachers Page
 */

import { useState } from 'react';
import { useClassTeachers } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { ClassTeacherForm } from './components/ClassTeacherForm';
import type { ClassTeacher, ClassTeacherFilters } from '../../types/academic.types';

export default function ClassTeachersPage() {
    const [filters, setFilters] = useState<ClassTeacherFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useClassTeachers(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedClassTeacher, setSelectedClassTeacher] = useState<ClassTeacher | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const columns: Column<ClassTeacher>[] = [
        { key: 'class_name', label: 'Class', sortable: true, className: 'font-semibold' },
        { key: 'section_name', label: 'Section', sortable: true },
        { key: 'teacher_name', label: 'Teacher', sortable: true },
        { key: 'academic_session_name', label: 'Session', sortable: true },
        {
            key: 'is_active',
            label: 'Status',
            render: (ct) => <Badge variant={ct.is_active ? 'default' : 'secondary'}>{ct.is_active ? 'Active' : 'Inactive'}</Badge>,
        },
    ];

    const handleRowClick = (classTeacher: ClassTeacher) => {
        setSelectedClassTeacher(classTeacher);
        setSidebarMode('edit');
        setIsSidebarOpen(true);
    };

    const handleAdd = () => {
        setSelectedClassTeacher(null);
        setSidebarMode('create');
        setIsSidebarOpen(true);
    };

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Class Teachers"
                description="Assign class teachers to classes and sections. Click on any row to edit."
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                onAdd={handleAdd}
                onRowClick={handleRowClick}
                filters={filters}
                onFiltersChange={setFilters}
                searchPlaceholder="Search class teachers..."
                addButtonLabel="Assign Class Teacher"
            />

            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title={sidebarMode === 'create' ? 'Assign Class Teacher' : 'Edit Class Teacher Assignment'}
                mode={sidebarMode}
            >
                <ClassTeacherForm mode={sidebarMode} classTeacherId={selectedClassTeacher?.id} onSuccess={() => { setIsSidebarOpen(false); refetch(); }} onCancel={() => setIsSidebarOpen(false)} />
            </DetailSidebar>
        </div>
    );
}