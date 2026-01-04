/**
 * Class Times Page
 */

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useClassTimes, useDeleteClassTime } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ClassTimeForm } from './components/ClassTimeForm';
import type { ClassTime, ClassTimeFilters } from '../../types/academic.types';

export default function ClassTimesPage() {
    const [filters, setFilters] = useState<ClassTimeFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useClassTimes(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedClassTime, setSelectedClassTime] = useState<ClassTime | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const deleteMutation = useDeleteClassTime();

    const columns: Column<ClassTime>[] = [
        { key: 'time_slot_name', label: 'Time Slot', sortable: true, className: 'font-semibold' },
        { key: 'start_time', label: 'Start Time', sortable: true },
        { key: 'end_time', label: 'End Time', sortable: true },
        {
            key: 'is_active',
            label: 'Status',
            render: (time) => <Badge variant={time.is_active ? 'default' : 'secondary'}>{time.is_active ? 'Active' : 'Inactive'}</Badge>,
        },
    ];

    const handleRowClick = (classTime: ClassTime) => {
        setSelectedClassTime(classTime);
        setSidebarMode('edit');
        setIsSidebarOpen(true);
    };

    const handleAdd = () => {
        setSelectedClassTime(null);
        setSidebarMode('create');
        setIsSidebarOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteMutation.mutate(deleteId);
            toast.success('Class time deleted successfully');
            setDeleteId(null);
            setIsSidebarOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete class time');
        }
    };

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Class Times"
                description="Manage class time slots and schedules. Click on any row to edit."
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                onAdd={handleAdd}
                onRowClick={handleRowClick}
                filters={filters}
                onFiltersChange={setFilters}
                searchPlaceholder="Search time slots..."
                addButtonLabel="Add Time Slot"
            />

            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title={sidebarMode === 'create' ? 'Create Time Slot' : 'Edit Time Slot'}
                mode={sidebarMode}
            >
                {sidebarMode === 'edit' && selectedClassTime && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setDeleteId(selectedClassTime.id)}
                            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
                <ClassTimeForm mode={sidebarMode} classTimeId={selectedClassTime?.id} onSuccess={() => { setIsSidebarOpen(false); refetch(); }} onCancel={() => setIsSidebarOpen(false)} />
            </DetailSidebar>

            <ConfirmDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Class Time"
                description="Are you sure you want to delete this class time? This action cannot be undone."
                variant="destructive"
            />
        </div>
    );
}