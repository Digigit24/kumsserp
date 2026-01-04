/**
 * Sections Page
 */

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSections, useDeleteSection } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SectionForm } from './components/SectionForm';
import type { Section, SectionFilters } from '../../types/academic.types';

export default function SectionsPage() {
    const [filters, setFilters] = useState<SectionFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useSections(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const deleteMutation = useDeleteSection();

    const columns: Column<Section>[] = [
        { key: 'name', label: 'Section Name', sortable: true, className: 'font-semibold' },
        { key: 'class_name', label: 'Class', sortable: true },
        { key: 'max_students', label: 'Max Students', sortable: true, render: (section) => `${section.max_students} students` },
        {
            key: 'is_active',
            label: 'Status',
            render: (section) => <Badge variant={section.is_active ? 'default' : 'secondary'}>{section.is_active ? 'Active' : 'Inactive'}</Badge>,
        },
    ];

    const handleRowClick = (section: Section) => {
        setSelectedSection(section);
        setSidebarMode('edit');
        setIsSidebarOpen(true);
    };

    const handleAdd = () => {
        setSelectedSection(null);
        setSidebarMode('create');
        setIsSidebarOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteMutation.mutate(deleteId);
            toast.success('Section deleted successfully');
            setDeleteId(null);
            setIsSidebarOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete section');
        }
    };

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Sections"
                description="Manage sections within classes. Click on any row to edit."
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                onAdd={handleAdd}
                onRowClick={handleRowClick}
                filters={filters}
                onFiltersChange={setFilters}
                searchPlaceholder="Search sections..."
                addButtonLabel="Add Section"
            />

            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title={sidebarMode === 'create' ? 'Create Section' : 'Edit Section'}
                mode={sidebarMode}
            >
                {sidebarMode === 'edit' && selectedSection && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setDeleteId(selectedSection.id)}
                            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
                <SectionForm mode={sidebarMode} sectionId={selectedSection?.id} onSuccess={() => { setIsSidebarOpen(false); refetch(); }} onCancel={() => setIsSidebarOpen(false)} />
            </DetailSidebar>

            <ConfirmDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Section"
                description="Are you sure you want to delete this section? This action cannot be undone."
                variant="destructive"
            />
        </div>
    );
}