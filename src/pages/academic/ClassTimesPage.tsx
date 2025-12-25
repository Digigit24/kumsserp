/**
 * Class Times Page
 */

import { useState } from 'react';
import { useClassTimes } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { ClassTimeForm } from './components/ClassTimeForm';
import type { ClassTime, ClassTimeFilters } from '../../types/academic.types';

export default function ClassTimesPage() {
    const [filters, setFilters] = useState<ClassTimeFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useClassTimes(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedClassTime, setSelectedClassTime] = useState<ClassTime | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                <ClassTimeForm mode={sidebarMode} classTimeId={selectedClassTime?.id} onSuccess={() => { setIsSidebarOpen(false); refetch(); }} onCancel={() => setIsSidebarOpen(false)} />
            </DetailSidebar>
        </div>
    );
}