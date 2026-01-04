/**
 * Timetables Page
 */

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTimetable, useDeleteTimetable } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { TimetableForm } from './components/TimetableForm';
import type { TimetableListItem, TimetableFilters } from '../../types/academic.types';

export default function TimetablesPage() {
    const [filters, setFilters] = useState<TimetableFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useTimetable(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedTimetable, setSelectedTimetable] = useState<TimetableListItem | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const deleteMutation = useDeleteTimetable();

    const columns: Column<TimetableListItem>[] = [
        { key: 'class_name', label: 'Class', sortable: true, className: 'font-semibold' },
        { key: 'section_name', label: 'Section', sortable: true },
        { key: 'subject_name', label: 'Subject', sortable: true },
        { key: 'day_of_week', label: 'Day', sortable: true, render: (tt) => <Badge variant="outline">{tt.day_of_week}</Badge> },
        { key: 'time_slot', label: 'Time', sortable: true },
        { key: 'classroom_name', label: 'Room', sortable: true },
    ];

    const handleRowClick = (timetable: TimetableListItem) => {
        setSelectedTimetable(timetable);
        setSidebarMode('edit');
        setIsSidebarOpen(true);
    };

    const handleAdd = () => {
        setSelectedTimetable(null);
        setSidebarMode('create');
        setIsSidebarOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteMutation.mutate(deleteId);
            toast.success('Timetable entry deleted successfully');
            setDeleteId(null);
            setIsSidebarOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete timetable entry');
        }
    };

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Timetables"
                description="Manage class schedules and timetables. Click on any row to edit."
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                onAdd={handleAdd}
                onRowClick={handleRowClick}
                filters={filters}
                onFiltersChange={setFilters}
                searchPlaceholder="Search timetables..."
                addButtonLabel="Add Timetable Entry"
            />

            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title={sidebarMode === 'create' ? 'Create Timetable Entry' : 'Edit Timetable Entry'}
                mode={sidebarMode}
            >
                {sidebarMode === 'edit' && selectedTimetable && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setDeleteId(selectedTimetable.id)}
                            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
                <TimetableForm mode={sidebarMode} timetableId={selectedTimetable?.id} onSuccess={() => { setIsSidebarOpen(false); refetch(); }} onCancel={() => setIsSidebarOpen(false)} />
            </DetailSidebar>

            <ConfirmDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Timetable Entry"
                description="Are you sure you want to delete this timetable entry? This action cannot be undone."
                variant="destructive"
            />
        </div>
    );
}