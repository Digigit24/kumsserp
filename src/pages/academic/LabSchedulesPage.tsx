/**
 * Lab Schedules Page
 */

import { useState } from 'react';
import { useLabSchedules } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { LabScheduleForm } from './components/LabScheduleForm';
import type { LabSchedule, LabScheduleFilters } from '../../types/academic.types';

export default function LabSchedulesPage() {
    const [filters, setFilters] = useState<LabScheduleFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useLabSchedules(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedLabSchedule, setSelectedLabSchedule] = useState<LabSchedule | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const columns: Column<LabSchedule>[] = [
        { key: 'subject_name', label: 'Subject', sortable: true, className: 'font-semibold' },
        { key: 'class_name', label: 'Class', sortable: true },
        { key: 'section_name', label: 'Section', sortable: true },
        { key: 'classroom_name', label: 'Laboratory', sortable: true, render: (lab) => lab.classroom_name || '-' },
        { key: 'day_of_week', label: 'Day', render: (lab) => <Badge variant="outline">{dayLabels[lab.day_of_week]}</Badge> },
        { key: 'start_time', label: 'Time', render: (lab) => `${lab.start_time} - ${lab.end_time}` },
        {
            key: 'is_active',
            label: 'Status',
            render: (lab) => <Badge variant={lab.is_active ? 'default' : 'secondary'}>{lab.is_active ? 'Active' : 'Inactive'}</Badge>,
        },
    ];

    const handleRowClick = (labSchedule: LabSchedule) => {
        setSelectedLabSchedule(labSchedule);
        setSidebarMode('edit');
        setIsSidebarOpen(true);
    };

    const handleAdd = () => {
        setSelectedLabSchedule(null);
        setSidebarMode('create');
        setIsSidebarOpen(true);
    };

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Lab Schedules"
                description="Manage laboratory session schedules. Click on any row to edit."
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                onAdd={handleAdd}
                onRowClick={handleRowClick}
                filters={filters}
                onFiltersChange={setFilters}
                searchPlaceholder="Search lab schedules..."
                addButtonLabel="Add Lab Schedule"
            />

            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title={sidebarMode === 'create' ? 'Create Lab Schedule' : 'Edit Lab Schedule'}
                mode={sidebarMode}
            >
                <LabScheduleForm mode={sidebarMode} labScheduleId={selectedLabSchedule?.id} onSuccess={() => { setIsSidebarOpen(false); refetch(); }} onCancel={() => setIsSidebarOpen(false)} />
            </DetailSidebar>
        </div>
    );
}