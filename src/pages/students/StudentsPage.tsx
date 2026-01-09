/**
 * Students Page - Main students management page
 * Uses DataTable and DetailSidebar for CRUD operations
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { ContextSelectorToolbar } from '../../components/context';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { useHierarchicalContext } from '../../contexts/HierarchicalContext';
import { usePermissions } from '../../contexts/PermissionsContext';
import { useAuth } from '../../hooks/useAuth';
import { useColleges } from '../../hooks/useCore';
import { useDeleteStudent, useStudents } from '../../hooks/useStudents';
import type { StudentFilters, StudentListItem } from '../../types/students.types';
import { isSuperAdmin } from '../../utils/auth.utils';
import { StudentForm } from './components/StudentForm';
import { StudentCreationPipeline } from './forms/StudentCreationPipeline';

export const StudentsPage = () => {
    const navigate = useNavigate();
    const { selectedClass, selectedSection } = useHierarchicalContext();
    const { permissions } = usePermissions();

    // Debug: Log permissions for students
    console.log('🔷 [StudentsPage] Permissions:', {
        canCreateStudents: permissions?.canCreateStudents,
        canViewStudents: permissions?.canViewStudents,
        canEditStudents: permissions?.canEditStudents,
        canDeleteStudents: permissions?.canDeleteStudents,
        allPermissions: permissions
    });

    const [filters, setFilters] = useState<StudentFilters>({ page: 1, page_size: 20 });
    const normalizedFilters: StudentFilters = {
        ...filters,
        college: filters.college ? Number(filters.college) : undefined,
        current_class: selectedClass || undefined,
        current_section: selectedSection || undefined,
    };

    const { data, isLoading, error, refetch } = useStudents(normalizedFilters);
    const deleteMutation = useDeleteStudent();

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentListItem | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [wizardDialogOpen, setWizardDialogOpen] = useState(false);

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
            key: 'college_name',
            label: 'College',
            sortable: true,
            render: (student) => student.college_name || `College #${student.college}`,
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
    // Fetch colleges for filter
    const { user } = useAuth();
    const { data: collegesData } = useColleges({ page_size: 100, is_active: true });

    // Define filter configuration
    const filterConfig: FilterConfig[] = [
        ...(isSuperAdmin(user as any) ? [{
            name: 'college',
            label: 'College',
            type: 'select' as const,
            options: [
                { value: '', label: 'All Colleges' },
                ...(collegesData?.results.map(c => ({ value: c.id.toString(), label: c.name })) || [])
            ],
        }] : []),
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
        setWizardDialogOpen(true);
    };

    const handleDelete = (student: StudentListItem) => {
        setSelectedStudent(student);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedStudent) {
            await deleteMutation.mutate(selectedStudent.id);
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

    const handleWizardSubmit = () => {
        setWizardDialogOpen(false);
        refetch();
    };

    const handleWizardCancel = () => {
        setWizardDialogOpen(false);
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
                loading={deleteMutation.isLoading}
            />

            {/* Student Creation Wizard Sidebar */}
            {permissions?.canCreateStudents && (
                <DetailSidebar
                    isOpen={wizardDialogOpen}
                    onClose={handleWizardCancel}
                    title="Create New Student"
                    subtitle="Complete the wizard to create a student account and record in one streamlined process"
                    mode="create"
                    width="3xl"
                >
                    <StudentCreationPipeline
                        onSubmit={handleWizardSubmit}
                        onCancel={handleWizardCancel}
                    />
                </DetailSidebar>
            )}
        </div>
    );
};
