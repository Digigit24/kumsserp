/**
 * College Dropdown Component
 * Reusable dropdown for selecting college in forms
 * Handles super admin (can select any college) and regular users (pre-filled)
 */

import { useEffect, useState } from 'react';
import { useColleges } from '../../hooks/useCore';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Building2, AlertCircle } from 'lucide-react';

interface CollegeDropdownProps {
    value?: number | null;
    onChange: (collegeId: number | null) => void;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    label?: string;
    showLabel?: boolean;
    placeholder?: string;
    allowAll?: boolean; // Allow "All Colleges" option for super admins
    className?: string;
}

export function CollegeDropdown({
    value,
    onChange,
    disabled = false,
    required = true,
    error,
    label = "College",
    showLabel = true,
    placeholder = "Select college",
    allowAll = false,
    className = "",
}: CollegeDropdownProps) {
    const { data: collegesData, isLoading } = useColleges({ page_size: 100, is_active: true });
    const [userCollege, setUserCollege] = useState<number | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        // Get user's college from localStorage
        const storedUser = localStorage.getItem('kumss_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const userType = user.user_type || user.userType;

            // Check if super admin
            const isSuper = userType === 'super_admin' || user.is_staff === true;
            setIsSuperAdmin(isSuper);

            // Set user's college
            if (user.college) {
                setUserCollege(user.college);

                // Auto-select user's college if not super admin and no value set
                if (!isSuper && !value) {
                    onChange(user.college);
                }
            }
        }
    }, []);

    const handleChange = (selectedValue: string) => {
        if (selectedValue === 'all') {
            onChange(null); // null = all colleges
        } else {
            onChange(parseInt(selectedValue));
        }
    };

    // For non-super admins, auto-select their college and disable dropdown
    const isDisabled = disabled || (!isSuperAdmin && userCollege !== null);

    if (isLoading) {
        return (
            <div className="space-y-2">
                {showLabel && <Label>{label}</Label>}
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted">
                    <Building2 className="h-4 w-4 animate-pulse text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Loading colleges...</span>
                </div>
            </div>
        );
    }

    const colleges = collegesData?.results || [];
    const selectedCollege = colleges.find(c => c.id === value);

    return (
        <div className={`space-y-2 ${className}`}>
            {showLabel && (
                <Label>
                    {label} {required && <span className="text-destructive">*</span>}
                </Label>
            )}

            <Select
                value={value === null ? 'all' : value?.toString()}
                onValueChange={handleChange}
                disabled={isDisabled}
            >
                <SelectTrigger className={error ? 'border-destructive' : ''}>
                    <SelectValue placeholder={placeholder}>
                        {value === null ? (
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                <span>All Colleges</span>
                            </div>
                        ) : selectedCollege ? (
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                <span>{selectedCollege.name}</span>
                            </div>
                        ) : null}
                    </SelectValue>
                </SelectTrigger>

                <SelectContent>
                    {/* All Colleges option for super admins */}
                    {isSuperAdmin && allowAll && (
                        <SelectItem value="all">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-primary" />
                                <div>
                                    <div className="font-medium">All Colleges</div>
                                    <div className="text-xs text-muted-foreground">View/Manage all</div>
                                </div>
                            </div>
                        </SelectItem>
                    )}

                    {/* Individual colleges */}
                    {colleges.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                            No colleges available
                        </div>
                    ) : (
                        colleges.map((college) => (
                            <SelectItem key={college.id} value={college.id.toString()}>
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    <div>
                                        <div className="font-medium">{college.name}</div>
                                        {college.short_name && (
                                            <div className="text-xs text-muted-foreground">
                                                {college.short_name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>

            {/* Helper text */}
            {!isSuperAdmin && userCollege && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    This is your assigned college
                </p>
            )}

            {isSuperAdmin && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    As super admin, you can select any college
                </p>
            )}

            {/* Error message */}
            {error && (
                <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {error}
                </p>
            )}

            {/* Info about selection */}
            {value && selectedCollege && (
                <div className="rounded-md bg-primary/5 border border-primary/20 p-2">
                    <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Selected:</span> {selectedCollege.name}
                        {selectedCollege.code && ` (${selectedCollege.code})`}
                    </p>
                </div>
            )}
        </div>
    );
}