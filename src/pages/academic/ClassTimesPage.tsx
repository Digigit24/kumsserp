/**
 * Class Times Page
 */

import { useMemo, useState } from 'react';
import { Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useClassTimes, useDeleteClassTime } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ClassTimeForm } from './components/ClassTimeForm';
import type { ClassTime, ClassTimeFilters } from '../../types/academic.types';
import type { ClassTimeCreateInput } from '../../types/academic.types';

export default function ClassTimesPage() {
    const [filters, setFilters] = useState<ClassTimeFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useClassTimes(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedClassTime, setSelectedClassTime] = useState<ClassTime | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [prefill, setPrefill] = useState<Partial<ClassTimeCreateInput> | null>(null);

    const deleteMutation = useDeleteClassTime();
    const classTimes = data?.results || [];

    const timelineSlots = useMemo(() => {
        const startHour = 8;
        const endHour = 18;
        const slots: { start: string; end: string }[] = [];
        for (let h = startHour; h < endHour; h++) {
            const start = `${String(h).padStart(2, '0')}:00`;
            const end = `${String(h + 1).padStart(2, '0')}:00`;
            slots.push({ start, end });
        }
        return slots;
    }, []);

    const isOccupied = (slotStart: string) => {
        return classTimes.some(ct => ct.start_time === slotStart);
    };

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
        setPrefill(null);
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
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Visual Timetable</h2>
                </div>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {timelineSlots.map((slot, idx) => {
                        const occupied = isOccupied(slot.start);
                        return (
                            <motion.button
                                key={slot.start}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={`flex items-center justify-between rounded-md border px-3 py-2 text-left transition ${
                                    occupied
                                        ? 'bg-muted cursor-not-allowed border-muted-foreground/20'
                                        : 'bg-primary/5 hover:bg-primary/10 border-primary/30'
                                }`}
                                disabled={occupied}
                                onClick={() => {
                                    setSidebarMode('create');
                                    setSelectedClassTime(null);
                                    setPrefill({
                                        start_time: slot.start,
                                        end_time: slot.end,
                                        period_number: classTimes.length + 1,
                                    });
                                    setIsSidebarOpen(true);
                                }}
                            >
                                <div>
                                    <p className="font-semibold">{slot.start} - {slot.end}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {occupied ? 'Already scheduled' : 'Tap to create class time'}
                                    </p>
                                </div>
                                <Badge variant={occupied ? 'secondary' : 'outline'} className="text-xs">
                                    {occupied ? 'Filled' : 'Available'}
                                </Badge>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

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
                <ClassTimeForm
                    mode={sidebarMode}
                    classTimeId={selectedClassTime?.id}
                    prefill={prefill || undefined}
                    onSuccess={() => { setIsSidebarOpen(false); refetch(); }}
                    onCancel={() => setIsSidebarOpen(false)}
                />
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
