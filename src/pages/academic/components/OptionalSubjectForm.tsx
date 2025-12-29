/**
 * Optional Subject Form Component
 */

import { useState, useEffect } from 'react';
import { optionalSubjectApi, classApi, subjectApi } from '../../../services/academic.service';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Checkbox } from '../../../components/ui/checkbox';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { OptionalSubject, OptionalSubjectCreateInput } from '../../../types/academic.types';

interface OptionalSubjectFormProps {
    mode: 'view' | 'create' | 'edit';
    optionalSubjectId?: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export function OptionalSubjectForm({ mode, optionalSubjectId, onSuccess, onCancel }: OptionalSubjectFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    const [formData, setFormData] = useState<OptionalSubjectCreateInput>({
        class_obj: 0,
        name: '',
        description: null,
        subjects: [],
        min_selection: 1,
        max_selection: 1,
        is_active: true,
    });

    useEffect(() => {
        fetchFormData();
    }, []);

    useEffect(() => {
        if ((mode === 'edit' || mode === 'view') && optionalSubjectId) {
            fetchOptionalSubject();
        }
    }, [mode, optionalSubjectId]);

    const fetchFormData = async () => {
        try {
            setLoadingData(true);
            const [classesData, subjectsData] = await Promise.all([
                classApi.list({ page_size: 200, is_active: true }),
                subjectApi.list({ page_size: 500, is_active: true })
            ]);
            setClasses(classesData.results);
            setSubjects(subjectsData.results);
        } catch (err) {
            console.error('Failed to fetch form data:', err);
        } finally {
            setLoadingData(false);
        }
    };

    const fetchOptionalSubject = async () => {
        if (!optionalSubjectId) return;
        try {
            setIsFetching(true);
            const data = await optionalSubjectApi.get(optionalSubjectId);
            setFormData({
                class_obj: data.class_obj,
                name: data.name,
                description: data.description,
                subjects: data.subjects,
                min_selection: data.min_selection,
                max_selection: data.max_selection,
                is_active: data.is_active,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch optional subject group');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.class_obj) {
            setError('Please select a class');
            return;
        }
        if (!formData.name.trim()) {
            setError('Please enter a name');
            return;
        }
        if (formData.subjects.length === 0) {
            setError('Please select at least one subject');
            return;
        }
        if (formData.min_selection < 1) {
            setError('Minimum selection must be at least 1');
            return;
        }
        if (formData.max_selection < formData.min_selection) {
            setError('Maximum selection cannot be less than minimum selection');
            return;
        }
        if (formData.max_selection > formData.subjects.length) {
            setError('Maximum selection cannot exceed number of subjects');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            if (mode === 'create') {
                await optionalSubjectApi.create(formData);
            } else if (mode === 'edit' && optionalSubjectId) {
                await optionalSubjectApi.update(optionalSubjectId, formData);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to save optional subject group');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSubject = (subjectId: number) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.includes(subjectId)
                ? prev.subjects.filter(id => id !== subjectId)
                : [...prev.subjects, subjectId]
        }));
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading optional subject group...</p>
                </div>
            </div>
        );
    }

    const isViewMode = mode === 'view';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-destructive">Error</h4>
                            <p className="text-sm text-destructive/90 mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Class */}
            <div className="space-y-2">
                <Label htmlFor="class_obj">
                    Class <span className="text-destructive">*</span>
                </Label>
                <Select
                    value={formData.class_obj?.toString()}
                    onValueChange={(v) => setFormData({ ...formData, class_obj: parseInt(v) })}
                    disabled={isViewMode || loadingData}
                >
                    <SelectTrigger id="class_obj">
                        <SelectValue placeholder={loadingData ? "Loading..." : "Select class"} />
                    </SelectTrigger>
                    <SelectContent>
                        {classes.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                                {c.name} - {c.program_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name">
                    Group Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Elective Group A, Optional Sciences"
                    disabled={isViewMode}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    A descriptive name for this optional subject group
                </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">
                    Description <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
                    placeholder="Additional details about this subject group..."
                    disabled={isViewMode}
                    rows={3}
                />
            </div>

            {/* Subjects */}
            <div className="space-y-2">
                <Label>
                    Subjects <span className="text-destructive">*</span>
                </Label>
                <div className="rounded-lg border p-4 max-h-64 overflow-y-auto space-y-2">
                    {loadingData ? (
                        <div className="text-center py-4 text-sm text-muted-foreground">Loading subjects...</div>
                    ) : subjects.length === 0 ? (
                        <div className="text-center py-4 text-sm text-muted-foreground">No subjects available</div>
                    ) : (
                        subjects.map((subject) => (
                            <div key={subject.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`subject-${subject.id}`}
                                    checked={formData.subjects.includes(subject.id)}
                                    onCheckedChange={() => toggleSubject(subject.id)}
                                    disabled={isViewMode}
                                />
                                <label
                                    htmlFor={`subject-${subject.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {subject.name} ({subject.code})
                                </label>
                            </div>
                        ))
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    Selected: {formData.subjects.length} subject(s)
                </p>
            </div>

            {/* Min and Max Selection */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="min_selection">
                        Minimum Selection <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="min_selection"
                        type="number"
                        min="1"
                        max={formData.subjects.length}
                        value={formData.min_selection}
                        onChange={(e) => setFormData({ ...formData, min_selection: parseInt(e.target.value) || 1 })}
                        disabled={isViewMode}
                        required
                    />
                    <p className="text-xs text-muted-foreground">
                        Minimum subjects students must select
                    </p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="max_selection">
                        Maximum Selection <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="max_selection"
                        type="number"
                        min={formData.min_selection}
                        max={formData.subjects.length}
                        value={formData.max_selection}
                        onChange={(e) => setFormData({ ...formData, max_selection: parseInt(e.target.value) || 1 })}
                        disabled={isViewMode}
                        required
                    />
                    <p className="text-xs text-muted-foreground">
                        Maximum subjects students can select
                    </p>
                </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
                <div className="space-y-0.5">
                    <Label className="text-base">Active Status</Label>
                    <p className="text-xs text-muted-foreground">
                        {formData.is_active ? 'This subject group is active' : 'This subject group is inactive'}
                    </p>
                </div>
                <Switch
                    checked={formData.is_active}
                    onCheckedChange={(c) => setFormData({ ...formData, is_active: c })}
                    disabled={isViewMode}
                />
            </div>

            {/* Action Buttons */}
            {!isViewMode && (
                <div className="flex gap-3 pt-4 border-t">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {isLoading ? 'Saving...' : mode === 'create' ? 'Create Optional Subject Group' : 'Update Optional Subject Group'}
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
