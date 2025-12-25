/**
 * Classrooms Page
 */

import { useState } from 'react';
import { useClassrooms } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { ClassroomForm } from './components/ClassroomForm';
import type { ClassroomListItem, ClassroomFilters } from '../../types/academic.types';

export default function ClassroomsPage() {
    const [filters, setFilters] = useState<ClassroomFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useClassrooms(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedClassroom, setSelectedClassroom] = useState<ClassroomListItem | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const columns: Column<ClassroomListItem>[] = [
        { key: 'code', label: 'Code', sortable: true, className: 'font-medium' },
        { key: 'name', label: 'Room Name', sortable: true, className: 'font-semibold' },
        { key: 'room_type', label: 'Type', render: (room) => <Badge variant="outline">{room.room_type}</Badge> },
        { key: 'capacity', label: 'Capacity', sortable: true, render: (room) => `${room.capacity} students` },
        { key: 'college_name', label: 'College', sortable: true },
        {
            key: 'is_active',
            label: 'Status',
            render: (room) => <Badge variant={room.is_active ? 'default' : 'secondary'}>{room.is_active ? 'Available' : 'Unavailable'}</Badge>,
        },
    ];

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Classrooms"
                description="Manage classrooms and their availability"
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                onAdd={() => { setSelectedClassroom(null); setSidebarMode('create'); setIsSidebarOpen(true); }}
                filters={filters}
                onFiltersChange={setFilters}
                searchPlaceholder="Search classrooms..."
                addButtonLabel="Add Classroom"
            />

            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title={sidebarMode === 'create' ? 'Create Classroom' : sidebarMode === 'edit' ? 'Edit Classroom' : 'Classroom Details'}
                mode={sidebarMode}
            >
                <ClassroomForm mode={sidebarMode} classroomId={selectedClassroom?.id} onSuccess={() => { setIsSidebarOpen(false); refetch(); }} onCancel={() => setIsSidebarOpen(false)} />
            </DetailSidebar>
        </div>
    );
}