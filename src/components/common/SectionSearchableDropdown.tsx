/**
 * Section Searchable Dropdown Component
 * Reusable searchable dropdown for selecting sections
 */

import { useSections } from '../../hooks/useAcademic';
import { Label } from '../ui/label';
import { SearchableSelect, SearchableSelectOption } from '../ui/searchable-select';
import { Users, AlertCircle } from 'lucide-react';

interface SectionSearchableDropdownProps {
    value?: number | null;
    onChange: (sectionId: number | null) => void;
    classId?: number | null; // Filter by class
    disabled?: boolean;
    required?: boolean;
    error?: string;
    label?: string;
    showLabel?: boolean;
    placeholder?: string;
    className?: string;
}

export function SectionSearchableDropdown({
    value,
    onChange,
    classId,
    disabled = false,
    required = true,
    error,
    label = "Section",
    showLabel = true,
    placeholder = "Select section",
    className = "",
}: SectionSearchableDropdownProps) {
    const filters: any = { page_size: 100, is_active: true };

    if (classId) {
        filters.class_obj = classId;
    }

    const { data: sectionsData, isLoading } = useSections(filters);

    const handleChange = (selectedValue: string | number) => {
        onChange(selectedValue as number);
    };

    if (isLoading) {
        return (
            <div className="space-y-2">
                {showLabel && <Label required={required}>{label}</Label>}
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted">
                    <Users className="h-4 w-4 animate-pulse text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Loading sections...</span>
                </div>
            </div>
        );
    }

    const sections = sectionsData?.results || [];

    // Transform sections to SearchableSelectOption format
    const options: SearchableSelectOption[] = sections.map((section) => ({
        value: section.id,
        label: section.name,
        subtitle: `${section.class_name} • Max ${section.max_students} students`,
    }));

    return (
        <div className={`space-y-2 ${className}`}>
            {showLabel && (
                <Label required={required}>
                    {label}
                </Label>
            )}

            <SearchableSelect
                options={options}
                value={value || undefined}
                onChange={handleChange}
                placeholder={placeholder}
                searchPlaceholder="Search by section name..."
                emptyText="No sections found"
                disabled={disabled}
                className={error ? 'border-destructive' : ''}
            />

            {/* Error message */}
            {error && (
                <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {error}
                </p>
            )}

            {/* Helper text */}
            {options.length === 0 && !isLoading && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {classId
                      ? 'No sections available for selected class.'
                      : 'No sections available. Please select a class first or create sections.'}
                </p>
            )}
        </div>
    );
}
