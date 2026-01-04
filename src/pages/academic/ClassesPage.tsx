/**
 * Classes Page
 */

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useClasses, useDeleteClass } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ClassForm } from './components/ClassForm';
import type { ClassListItem, ClassFilters } from '../../types/academic.types';

export default function ClassesPage() {
    const [filters, setFilters] = useState<ClassFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useClasses(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedClass, setSelectedClass] = useState<ClassListItem | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const deleteMutation = useDeleteClass();

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

    const handleRowClick = (cls: ClassListItem) => {
        setSelectedClass(cls);
        setSidebarMode('edit');
        setIsSidebarOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteMutation.mutate(deleteId);
            toast.success('Class deleted successfully');
            setDeleteId(null);
            setIsSidebarOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete class');
        }
    };

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Classes"
                description="Manage academic classes for programs and sessions. Click on any row to edit."
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                onAdd={() => { setSelectedClass(null); setSidebarMode('create'); setIsSidebarOpen(true); }}
                onRowClick={handleRowClick}
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
                {sidebarMode === 'edit' && selectedClass && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setDeleteId(selectedClass.id)}
                            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
                <ClassForm mode={sidebarMode} classId={selectedClass?.id} onSuccess={() => { setIsSidebarOpen(false); refetch(); }} onCancel={() => setIsSidebarOpen(false)} />
            </DetailSidebar>

            <ConfirmDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Class"
                description="Are you sure you want to delete this class? This action cannot be undone."
                variant="destructive"
            />
        </div>
    );
}