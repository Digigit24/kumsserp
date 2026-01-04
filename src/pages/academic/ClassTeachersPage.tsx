/**
 * Class Teachers Page
 */

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useClassTeachers, useDeleteClassTeacher } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ClassTeacherForm } from './components/ClassTeacherForm';
import type { ClassTeacher, ClassTeacherFilters } from '../../types/academic.types';

export default function ClassTeachersPage() {
    const [filters, setFilters] = useState<ClassTeacherFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useClassTeachers(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedClassTeacher, setSelectedClassTeacher] = useState<ClassTeacher | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const deleteMutation = useDeleteClassTeacher();

    const columns: Column<ClassTeacher>[] = [
        { key: 'class_name', label: 'Class', sortable: true, className: 'font-semibold' },
        { key: 'section_name', label: 'Section', sortable: true },
        {
            key: 'teacher',
            label: 'Teacher',
            sortable: true,
            render: (ct) => ct.teacher_details?.full_name || ct.teacher_details?.username || '-'
        },
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

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteMutation.mutate(deleteId);
            toast.success('Class teacher assignment deleted successfully');
            setDeleteId(null);
            setIsSidebarOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete class teacher assignment');
        }
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
                {sidebarMode === 'edit' && selectedClassTeacher && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setDeleteId(selectedClassTeacher.id)}
                            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
                <ClassTeacherForm mode={sidebarMode} classTeacherId={selectedClassTeacher?.id} onSuccess={() => { setIsSidebarOpen(false); refetch(); }} onCancel={() => setIsSidebarOpen(false)} />
            </DetailSidebar>

            <ConfirmDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Class Teacher Assignment"
                description="Are you sure you want to delete this class teacher assignment? This action cannot be undone."
                variant="destructive"
            />
        </div>
    );
}