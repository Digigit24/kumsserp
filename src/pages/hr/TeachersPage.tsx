/**
 * Teachers Page - Main teachers management page
 * Uses DataTable and DetailSidebar for CRUD operations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../hooks/useAccounts';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { TeacherForm } from './components/TeacherForm';
import type { UserListItem, UserFilters } from '../../types/accounts.types';

export const TeachersPage = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        page_size: 20,
        user_type: 'teacher' // Filter only teachers
    });
    const { data, isLoading, error, refetch } = useUsers(filters);

    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [selectedTeacher, setSelectedTeacher] = useState<UserListItem | null>(null);
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
    const columns: Column<UserListItem>[] = [
        {
            key: 'username',
            label: 'Username',
            sortable: true,
            className: 'font-medium',
        },
        {
            key: 'full_name',
            label: 'Teacher Name',
            sortable: true,
            render: (teacher) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                            {getInitials(teacher.full_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{teacher.full_name}</span>
                        <span className="text-xs text-muted-foreground">{teacher.email}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'college_name',
            label: 'College',
            sortable: true,
            render: (teacher) => (
                <Badge variant="secondary" className="transition-all hover:scale-105">
                    {teacher.college_name || 'N/A'}
                </Badge>
            ),
        },
        {
            key: 'date_joined',
            label: 'Joined Date',
            render: (teacher) => (
                <span className="text-sm">
                    {new Date(teacher.date_joined).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: 'is_verified',
            label: 'Verified',
            render: (teacher) => (
                <Badge variant={teacher.is_verified ? 'default' : 'outline'} className="transition-all">
                    {teacher.is_verified ? 'Verified' : 'Unverified'}
                </Badge>
            ),
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (teacher) => (
                <Badge variant={teacher.is_active ? 'success' : 'destructive'} className="transition-all">
                    {teacher.is_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
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
            name: 'is_verified',
            label: 'Verification Status',
            type: 'select',
            options: [
                { value: '', label: 'All' },
                { value: 'true', label: 'Verified' },
                { value: 'false', label: 'Unverified' },
            ],
        },
    ];

    const handleRowClick = (teacher: UserListItem) => {
        setSelectedTeacher(teacher);
        setSidebarMode('edit');
        setIsSidebarOpen(true);
    };

    const handleAdd = () => {
        setSelectedTeacher(null);
        setSidebarMode('create');
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedTeacher(null);
    };

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Teachers"
                description="Manage all teacher records, accounts, and information"
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
                searchPlaceholder="Search by name, username, email..."
                addButtonLabel="Add Teacher"
            />

            {/* Create/Edit Sidebar */}
            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={handleCloseSidebar}
                title={sidebarMode === 'create' ? 'Add New Teacher' : 'Edit Teacher'}
                mode={sidebarMode}
                width="2xl"
            >
                <TeacherForm
                    mode={sidebarMode}
                    teacherId={selectedTeacher?.id}
                    onSuccess={() => {
                        handleCloseSidebar();
                        refetch();
                    }}
                    onCancel={handleCloseSidebar}
                />
            </DetailSidebar>
        </div>
    );
};
