/**
 * Students Page - Main students management page
 * Uses DataTable and DetailSidebar for CRUD operations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '../../hooks/useStudents';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { StudentForm } from './components/StudentForm';
import type { StudentListItem, StudentFilters } from '../../types/students.types';

export const StudentsPage = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<StudentFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useStudents(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Define table columns
    const columns: Column<StudentListItem>[] = [
        {
            key: 'admission_number',
            label: 'Admission No.',
            sortable: true,
            className: 'font-medium',
        },
        {
            key: 'full_name',
            label: 'Student Name',
            sortable: true,
            render: (student) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                            {getInitials(student.full_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{student.full_name}</span>
                        <span className="text-xs text-muted-foreground">{student.registration_number}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'program_name',
            label: 'Program',
            sortable: true,
            render: (student) => (
                <Badge variant="secondary" className="transition-all hover:scale-105">{student.program_name}</Badge>
            ),
        },
        {
            key: 'current_class_name',
            label: 'Class',
            render: (student) => student.current_class_name || '-',
        },
        {
            key: 'email',
            label: 'Email',
            render: (student) => (
                <span className="text-sm">{student.email}</span>
            ),
        },
        {
            key: 'phone',
            label: 'Phone',
            render: (student) => student.phone || '-',
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (student) => (
                <Badge variant={student.is_active ? 'success' : 'destructive'} className="transition-all">
                    {student.is_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            key: 'is_alumni',
            label: 'Alumni',
            render: (student) => student.is_alumni ? (
                <Badge variant="outline">Alumni</Badge>
            ) : null,
        },
    ];

    // Define filter configuration
    const filterConfig: FilterConfig[] = [
        {
            name: 'is_active',
            label: 'Active Status',
            type: 'select',
            options: [
                { value: '', label: 'All' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
            ],
        },
        {
            name: 'is_alumni',
            label: 'Alumni Status',
            type: 'select',
            options: [
                { value: '', label: 'All' },
                { value: 'true', label: 'Alumni' },
                { value: 'false', label: 'Current Students' },
            ],
        },
        {
            name: 'gender',
            label: 'Gender',
            type: 'select',
            options: [
                { value: '', label: 'All' },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
            ],
        },
    ];

    const handleRowClick = (student: StudentListItem) => {
        navigate(`/students/${student.id}`);
    };

    const handleAdd = () => {
        setSidebarMode('create');
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleFormSuccess = () => {
        setIsSidebarOpen(false);
        refetch();
    };

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Students"
                description="Manage all student records, admissions, and information"
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                onAdd={handleAdd}
                onRowClick={handleRowClick}
                filters={filters}
                onFiltersChange={setFilters}
                filterConfig={filterConfig}
                searchPlaceholder="Search by name, admission number, email..."
                addButtonLabel="Add Student"
            />

            {/* Create Sidebar */}
            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={handleCloseSidebar}
                title={sidebarMode === 'create' ? 'Add New Student' : 'Edit Student'}
                mode={sidebarMode}
                width="2xl"
            >
                <StudentForm
                    mode={sidebarMode}
                    onSuccess={handleFormSuccess}
                    onCancel={handleCloseSidebar}
                />
            </DetailSidebar>
        </div>
    );
};
