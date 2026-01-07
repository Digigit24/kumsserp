
import { fetchApi } from '@/api/apiClient';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { isSuperAdmin } from '@/utils/auth.utils';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface College {
    id: number;
    name: string;
    code: string;
}

interface CollegeFieldProps {
    value: number | string | null;
    onChange: (value: number | string) => void;
    error?: string;
    label?: string;
    required?: boolean;
    className?: string;
    placeholder?: string;
}

export const CollegeField: React.FC<CollegeFieldProps> = ({
    value,
    onChange,
    error,
    label = "College",
    required = true,
    className,
    placeholder = "Select college"
}) => {
    const { user } = useAuth();
    const isSuper = isSuperAdmin(user);

    // Fetch colleges only if user is super admin
    const { data: collegesData, isLoading } = useQuery({
        queryKey: ['colleges-list'],
        queryFn: async () => {
            const response = await fetchApi<any>('/api/v1/core/colleges/');
            return response;
        },
        enabled: isSuper,
        staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    });

    // Extract results array if paginated
    const colleges: College[] = collegesData?.results || collegesData || [];

    // Don't render anything if not super admin
    if (!isSuper) return null;

    return (
        <div className={className}>
            <Label className="mb-2 block">
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <Select
                value={value?.toString()}
                onValueChange={(v) => onChange(Number(v))}
            >
                <SelectTrigger className={error ? "border-destructive" : ""}>
                    <SelectValue placeholder={isLoading ? "Loading colleges..." : placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {colleges.map((college) => (
                        <SelectItem key={college.id} value={college.id.toString()}>
                            {college.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-sm font-medium text-destructive mt-1">{error}</p>}
        </div>
    );
};
