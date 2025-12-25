/**
 * Programs Page
 * Manages academic programs with CRUD operations
 */

import { useState } from 'react';
import { usePrograms } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { ProgramForm } from './components/ProgramForm';
import type { ProgramListItem, ProgramFilters } from '../../types/academic.types';

export default function ProgramsPage() {
    const [filters, setFilters] = useState<ProgramFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = usePrograms(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedProgram, setSelectedProgram] = useState<ProgramListItem | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Programs"
                description="Manage academic programs and courses"
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                onAdd={handleAdd}
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
                <ProgramForm
                    mode={sidebarMode}
                    programId={selectedProgram?.id}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsSidebarOpen(false)}
                />
            </DetailSidebar>
        </div>
    );
}