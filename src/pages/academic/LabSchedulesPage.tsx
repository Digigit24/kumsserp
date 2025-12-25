/**
 * Lab Schedules Page
 */

import { useState } from 'react';
import { useLabSchedules } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import type { LabSchedule, LabScheduleFilters } from '../../types/academic.types';

export default function LabSchedulesPage() {
    const [filters, setFilters] = useState<LabScheduleFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useLabSchedules(filters);

    const columns: Column<LabSchedule>[] = [
        { key: 'subject_name', label: 'Subject', sortable: true, className: 'font-semibold' },
        { key: 'class_name', label: 'Class', sortable: true },
        { key: 'section_name', label: 'Section', sortable: true },
        { key: 'lab_name', label: 'Laboratory', sortable: true },
        { key: 'day_of_week', label: 'Day', render: (lab) => <Badge variant="outline">{lab.day_of_week}</Badge> },
        { key: 'start_time', label: 'Time', render: (lab) => `${lab.start_time} - ${lab.end_time}` },
    ];

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Lab Schedules"
                description="Manage laboratory session schedules"
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                filters={filters}
                onFiltersChange={setFilters}
                searchPlaceholder="Search lab schedules..."
                addButtonLabel="Add Lab Schedule"
            />
        </div>
    );
}