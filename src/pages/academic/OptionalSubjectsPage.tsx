/**
 * Optional Subjects Page
 */

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useOptionalSubjects, useDeleteOptionalSubject } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { OptionalSubjectForm } from './components/OptionalSubjectForm';
import type { OptionalSubject, OptionalSubjectFilters } from '../../types/academic.types';

export default function OptionalSubjectsPage() {
    const [filters, setFilters] = useState<OptionalSubjectFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useOptionalSubjects(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedOptionalSubject, setSelectedOptionalSubject] = useState<OptionalSubject | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const deleteMutation = useDeleteOptionalSubject();

    const columns: Column<OptionalSubject>[] = [
        { key: 'name', label: 'Group Name', sortable: true, className: 'font-semibold' },
        { key: 'class_name', label: 'Class', sortable: true },
        { key: 'min_selection', label: 'Min Selection', sortable: true },
        { key: 'max_selection', label: 'Max Selection', sortable: true },
        { key: 'subjects_list', label: 'Subjects', render: (opt) => `${opt.subjects_list.length} subject(s)` },
        {
            key: 'is_active',
            label: 'Status',
            render: (opt) => <Badge variant={opt.is_active ? 'default' : 'secondary'}>{opt.is_active ? 'Active' : 'Inactive'}</Badge>,
        },
    ];

    const handleRowClick = (optionalSubject: OptionalSubject) => {
        setSelectedOptionalSubject(optionalSubject);
        setSidebarMode('edit');
        setIsSidebarOpen(true);
    };

    const handleAdd = () => {
        setSelectedOptionalSubject(null);
        setSidebarMode('create');
        setIsSidebarOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteMutation.mutate(deleteId);
            toast.success('Optional subject group deleted successfully');
            setDeleteId(null);
            setIsSidebarOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete optional subject group');
        }
    };

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Optional Subject Groups"
                description="Manage optional subject selection groups for classes. Click on any row to edit."
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                onAdd={handleAdd}
                onRowClick={handleRowClick}
                filters={filters}
                onFiltersChange={setFilters}
                searchPlaceholder="Search optional subject groups..."
                addButtonLabel="Add Optional Subject Group"
            />

            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title={sidebarMode === 'create' ? 'Create Optional Subject Group' : 'Edit Optional Subject Group'}
                mode={sidebarMode}
            >
                {sidebarMode === 'edit' && selectedOptionalSubject && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setDeleteId(selectedOptionalSubject.id)}
                            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
                <OptionalSubjectForm mode={sidebarMode} optionalSubjectId={selectedOptionalSubject?.id} onSuccess={() => { setIsSidebarOpen(false); refetch(); }} onCancel={() => setIsSidebarOpen(false)} />
            </DetailSidebar>

            <ConfirmDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Optional Subject Group"
                description="Are you sure you want to delete this optional subject group? This action cannot be undone."
                variant="destructive"
            />
        </div>
    );
}