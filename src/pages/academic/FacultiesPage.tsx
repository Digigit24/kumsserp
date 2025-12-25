/**
 * Faculties Page
 * Manages college faculties with CRUD operations
 */

import { useState } from 'react';
import { useFaculties } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { FacultyForm } from './components/FacultyForm';
import type { FacultyListItem, FacultyFilters } from '../../types/academic.types';

export default function FacultiesPage() {
    const [filters, setFilters] = useState<FacultyFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useFaculties(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedFaculty, setSelectedFaculty] = useState<FacultyListItem | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const columns: Column<FacultyListItem>[] = [
        {
            key: 'code',
            label: 'Code',
            sortable: true,
            className: 'font-medium',
        },
        {
            key: 'name',
            label: 'Faculty Name',
            sortable: true,
            className: 'font-semibold',
        },
        {
            key: 'short_name',
            label: 'Short Name',
            sortable: true,
        },
        {
            key: 'college_name',
            label: 'College',
            sortable: true,
        },
        {
            key: 'hod_name',
            label: 'Head of Department',
            render: (faculty) => faculty.hod_name || <span className="text-muted-foreground">Not Assigned</span>,
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (faculty) => (
                <Badge variant={faculty.is_active ? 'default' : 'secondary'}>
                    {faculty.is_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
    ];

    const handleRowClick = (faculty: FacultyListItem) => {
        setSelectedFaculty(faculty);
        setSidebarMode('edit'); // Open in edit mode when clicking row
        setIsSidebarOpen(true);
    };

    const handleAdd = () => {
        setSelectedFaculty(null);
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
                title="Faculties"
                description="Manage college faculties and departments. Click on any row to edit."
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                onAdd={handleAdd}
                onRowClick={handleRowClick}
                filters={filters}
                onFiltersChange={setFilters}
                searchPlaceholder="Search faculties..."
                addButtonLabel="Add Faculty"
            />

            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title={
                    sidebarMode === 'create'
                        ? 'Create Faculty'
                        : sidebarMode === 'edit'
                            ? 'Edit Faculty'
                            : 'Faculty Details'
                }
                mode={sidebarMode}
            >
                <FacultyForm
                    mode={sidebarMode}
                    facultyId={selectedFaculty?.id}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsSidebarOpen(false)}
                />
            </DetailSidebar>
        </div>
    );
}