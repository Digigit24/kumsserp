/**
 * Faculty Form Component
 * Form for creating and editing faculties
 */

import { useState, useEffect } from 'react';
import { facultyApi } from '../../../services/academic.service';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import type { Faculty, FacultyCreateInput, FacultyUpdateInput } from '../../../types/academic.types';

interface FacultyFormProps {
    mode: 'view' | 'create' | 'edit';
    facultyId?: number;
    onSuccess: () => void;
    onCancel: () => void;
}

// Helper function to get college ID from logged-in user
const getCollegeId = (): number => {
    try {
        const storedUser = localStorage.getItem('kumss_user');
        if (!storedUser) return 0;
        const user = JSON.parse(storedUser);
        return user.college || 0;
    } catch {
        return 0;
    }
};

export function FacultyForm({ mode, facultyId, onSuccess, onCancel }: FacultyFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [faculty, setFaculty] = useState<Faculty | null>(null);

    const [formData, setFormData] = useState<FacultyCreateInput>({
        college: getCollegeId(), // ✅ Get from logged-in user
        code: '',
        name: '',
        short_name: '',
        description: '',
        hod: null,
        display_order: 0,
        is_active: true,
    });

    // Fetch faculty data if editing or viewing
    useEffect(() => {
        if ((mode === 'edit' || mode === 'view') && facultyId) {
            fetchFaculty();
        }
    }, [mode, facultyId]);

    const fetchFaculty = async () => {
        if (!facultyId) return;

        try {
            setIsFetching(true);
            setError(null);
            const data = await facultyApi.get(facultyId);
            setFaculty(data);
            setFormData({
                college: data.college,
                code: data.code,
                name: data.name,
                short_name: data.short_name,
                description: data.description || '',
                hod: data.hod,
                display_order: data.display_order,
                is_active: data.is_active,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch faculty');
            console.error('Fetch faculty error:', err);
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            setError(null);

            console.log('Submitting faculty data:', formData); // ✅ Debug log

            if (mode === 'create') {
                await facultyApi.create(formData);
            } else if (mode === 'edit' && facultyId) {
                await facultyApi.update(facultyId, formData as FacultyUpdateInput);
            }

            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to save faculty');
            console.error('Save faculty error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: keyof FacultyCreateInput, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Loading faculty data...</p>
            </div>
        );
    }

    const isViewMode = mode === 'view';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            {/* Code */}
            <div className="space-y-2">
                <Label htmlFor="code">
                    Faculty Code <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value)}
                    placeholder="e.g., ENG, SCI, ARTS"
                    disabled={isViewMode}
                    required
                />
            </div>

            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name">
                    Faculty Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., Faculty of Engineering"
                    disabled={isViewMode}
                    required
                />
            </div>

            {/* Short Name */}
            <div className="space-y-2">
                <Label htmlFor="short_name">
                    Short Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="short_name"
                    value={formData.short_name}
                    onChange={(e) => handleChange('short_name', e.target.value)}
                    placeholder="e.g., Engineering"
                    disabled={isViewMode}
                    required
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Enter faculty description..."
                    disabled={isViewMode}
                    rows={3}
                />
            </div>

            {/* Display Order */}
            <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)}
                    disabled={isViewMode}
                />
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="is_active">Active Status</Label>
                    <p className="text-sm text-muted-foreground">
                        Inactive faculties won't be available for selection
                    </p>
                </div>
                <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleChange('is_active', checked)}
                    disabled={isViewMode}
                />
            </div>

            {/* View Mode Info */}
            {isViewMode && faculty && (
                <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                    <div className="text-sm">
                        <span className="text-muted-foreground">Created:</span>{' '}
                        {new Date(faculty.created_at).toLocaleString()}
                        {faculty.created_by && ` by ${faculty.created_by.full_name}`}
                    </div>
                    <div className="text-sm">
                        <span className="text-muted-foreground">Last Updated:</span>{' '}
                        {new Date(faculty.updated_at).toLocaleString()}
                        {faculty.updated_by && ` by ${faculty.updated_by.full_name}`}
                    </div>
                </div>
            )}

            {/* Actions */}
            {!isViewMode && (
                <div className="flex gap-3 pt-4 border-t">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {isLoading ? 'Saving...' : mode === 'create' ? 'Create Faculty' : 'Update Faculty'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                </div>
            )}
        </form>
    );
}