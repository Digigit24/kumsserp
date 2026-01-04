/**
 * Programs Page
 * Manages academic programs with CRUD operations
 */

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { usePrograms, useDeleteProgram } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ProgramForm } from './components/ProgramForm';
import type { ProgramListItem, ProgramFilters } from '../../types/academic.types';

export default function ProgramsPage() {
    const [filters, setFilters] = useState<ProgramFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = usePrograms(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedProgram, setSelectedProgram] = useState<ProgramListItem | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const deleteMutation = useDeleteProgram();

    const columns: Column<ProgramListItem>[] = [
        {
            key: 'code',
            label: 'Code',
            sortable: true,
            className: 'font-medium',
        },
        {
            key: 'name',
            label: 'Program Name',
            sortable: true,
            className: 'font-semibold',
        },
        {
            key: 'short_name',
            label: 'Short Name',
            sortable: true,
        },
        {
            key: 'faculty_name',
            label: 'Faculty',
            sortable: true,
        },
        {
            key: 'program_type',
            label: 'Type',
            render: (program) => (
                <Badge variant="outline">{program.program_type}</Badge>
            ),
        },
        {
            key: 'college_name',
            label: 'College',
            sortable: true,
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (program) => (
                <Badge variant={program.is_active ? 'default' : 'secondary'}>
                    {program.is_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
    ];

    const handleAdd = () => {
        setSelectedProgram(null);
        setSidebarMode('create');
        setIsSidebarOpen(true);
    };

    const handleSuccess = () => {
        setIsSidebarOpen(false);
        refetch();
    };

    const handleRowClick = (program: ProgramListItem) => {
        setSelectedProgram(program);
        setSidebarMode('edit');
        setIsSidebarOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteMutation.mutate(deleteId);
            toast.success('Program deleted successfully');
            setDeleteId(null);
            setIsSidebarOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete program');
        }
    };

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Programs"
                description="Manage academic programs and courses. Click on any row to edit."
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                onAdd={handleAdd}
                onRowClick={handleRowClick}
                filters={filters}
                onFiltersChange={setFilters}
                searchPlaceholder="Search programs..."
                addButtonLabel="Add Program"
            />

            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title={
                    sidebarMode === 'create'
                        ? 'Create Program'
                        : sidebarMode === 'edit'
                            ? 'Edit Program'
                            : 'Program Details'
                }
                mode={sidebarMode}
            >
                {sidebarMode === 'edit' && selectedProgram && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setDeleteId(selectedProgram.id)}
                            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
                <ProgramForm
                    mode={sidebarMode}
                    programId={selectedProgram?.id}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsSidebarOpen(false)}
                />
            </DetailSidebar>

            <ConfirmDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Program"
                description="Are you sure you want to delete this program? This action cannot be undone."
                variant="destructive"
            />
        </div>
    );
}