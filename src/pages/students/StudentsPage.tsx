/**
 * Students Page - Main students management page
 * Uses DataTable and DetailSidebar for CRUD operations
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents, useDeleteStudent } from '../../hooks/useStudents';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { StudentForm } from './components/StudentForm';
import { ContextSelectorToolbar } from '../../components/context';
import { useHierarchicalContext } from '../../contexts/HierarchicalContext';
import { usePermissions } from '../../contexts/PermissionsContext';
import type { StudentListItem, StudentFilters } from '../../types/students.types';

export const StudentsPage = () => {
    const navigate = useNavigate();
    const { selectedClass, selectedSection } = useHierarchicalContext();
    const { permissions } = usePermissions();

    const [filters, setFilters] = useState<StudentFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useStudents({
        ...filters,
        class_obj: selectedClass || undefined,
        section: selectedSection || undefined,
    });
    const deleteMutation = useDeleteStudent();

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentListItem | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Update filters when context changes
    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            page: 1, // Reset to first page
        }));
    }, [selectedClass, selectedSection]);

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
            render: (student) => permissions?.canViewStudentSensitiveFields ? (
                <span className="text-sm">{student.email}</span>
            ) : (
                <span className="text-sm text-muted-foreground">Hidden</span>
            ),
        },
        {
            key: 'phone',
            label: 'Phone',
            render: (student) => permissions?.canViewStudentSensitiveFields
                ? student.phone || '-'
                : 'Hidden',
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
        if (!permissions?.canCreateStudents) {
            return;
        }
        setSidebarMode('create');
        setIsSidebarOpen(true);
    };

    const handleDelete = (student: StudentListItem) => {
        setSelectedStudent(student);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedStudent) {
            await deleteMutation.mutateAsync(selectedStudent.id);
            refetch();
            setDeleteDialogOpen(false);
            setSelectedStudent(null);
        }
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleFormSuccess = () => {
        setIsSidebarOpen(false);
        refetch();
    };

    return (
        <div className="p-4 md:p-6 animate-fade-in space-y-6">
            {/* Context Selectors - Permission-driven */}
            <ContextSelectorToolbar />

            <DataTable
                title="Students"
                description="Manage all student records, admissions, and information"
                data={data || { count: 0, next: null, previous: null, results: [] }}
                columns={columns}
                isLoading={isLoading}
                error={error || null}
                onRefresh={refetch}
                onAdd={permissions?.canCreateStudents ? handleAdd : undefined}
                onDelete={handleDelete}
                onRowClick={handleRowClick}
                filters={filters}
                onFiltersChange={setFilters}
                filterConfig={filterConfig}
                searchPlaceholder="Search by name, admission number, email..."
                addButtonLabel="Add Student"
            />

            {/* Create Sidebar */}
            {permissions?.canCreateStudents && (
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
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Student"
                description={`Are you sure you want to delete ${selectedStudent?.full_name}? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                loading={deleteMutation.isPending}
            />
        </div>
    );
};
