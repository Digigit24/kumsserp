/**
 * Optional Subjects Page
 */

import { useState } from 'react';
import { useOptionalSubjects } from '../../hooks/useAcademic';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import type { OptionalSubject, OptionalSubjectFilters } from '../../types/academic.types';

export default function OptionalSubjectsPage() {
    const [filters, setFilters] = useState<OptionalSubjectFilters>({ page: 1, page_size: 20 });
    const { data, isLoading, error, refetch } = useOptionalSubjects(filters);

    const columns: Column<OptionalSubject>[] = [
        { key: 'name', label: 'Group Name', sortable: true, className: 'font-semibold' },
        { key: 'class_name', label: 'Class', sortable: true },
        { key: 'min_selection', label: 'Min Selection', sortable: true },
        { key: 'max_selection', label: 'Max Selection', sortable: true },
        { key: 'subjects_list', label: 'Subjects', render: (opt) => opt.subjects_list.length },
        {
            key: 'is_active',
            label: 'Status',
            render: (opt) => <Badge variant={opt.is_active ? 'default' : 'secondary'}>{opt.is_active ? 'Active' : 'Inactive'}</Badge>,
        },
    ];

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <DataTable
                title="Optional Subject Groups"
                description="Manage optional subject selection groups for classes"
                data={data}
                columns={columns}
                isLoading={isLoading}
                error={error}
                onRefresh={refetch}
                filters={filters}
                onFiltersChange={setFilters}
                searchPlaceholder="Search optional subject groups..."
                addButtonLabel="Add Optional Subject Group"
            />
        </div>
    );
}