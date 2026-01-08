/**
 * Lab Schedule Form Component
 */

import { useAuth } from '@/hooks/useAuth';
import { getCurrentUserCollege } from '@/utils/auth.utils';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CollegeField } from '../../../components/common/CollegeField';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Switch } from '../../../components/ui/switch';
import { classroomApi, labScheduleApi, sectionApi, subjectAssignmentApi } from '../../../services/academic.service';
import type { LabScheduleCreateInput } from '../../../types/academic.types';

interface LabScheduleFormProps {
    mode: 'view' | 'create' | 'edit';
    labScheduleId?: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export function LabScheduleForm({ mode, labScheduleId, onSuccess, onCancel }: LabScheduleFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [subjectAssignments, setSubjectAssignments] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    const { user } = useAuth();
    const [formData, setFormData] = useState<LabScheduleCreateInput>({
        college: getCurrentUserCollege(user as any) || 0,
        subject_assignment: 0,
        section: 0,
        day_of_week: 1,
        start_time: '',
        end_time: '',
        classroom: null,
        batch_name: null,
        effective_from: new Date().toISOString().split('T')[0],
        effective_to: null,
        is_active: true,
    });

    useEffect(() => {
        fetchFormData();
    }, []);

    useEffect(() => {
        if ((mode === 'edit' || mode === 'view') && labScheduleId) {
            fetchLabSchedule();
        }
    }, [mode, labScheduleId]);

    const fetchFormData = async () => {
        try {
            setLoadingData(true);
            const [assignments, sectionsData, classroomsData] = await Promise.all([
                subjectAssignmentApi.list({ page_size: 200, is_active: true }),
                sectionApi.list({ page_size: 200, is_active: true }),
                classroomApi.list({ page_size: 200, is_active: true })
            ]);
            setSubjectAssignments(assignments.results);
            setSections(sectionsData.results);
            setClassrooms(classroomsData.results);
        } catch (err) {
            console.error('Failed to fetch form data:', err);
        } finally {
            setLoadingData(false);
        }
    };

    const fetchLabSchedule = async () => {
        if (!labScheduleId) return;
        try {
            setIsFetching(true);
            const data = await labScheduleApi.get(labScheduleId);
            setFormData({
                subject_assignment: data.subject_assignment,
                section: data.section,
                day_of_week: data.day_of_week,
                start_time: data.start_time,
                end_time: data.end_time,
                classroom: data.classroom,
                batch_name: data.batch_name,
                effective_from: data.effective_from,
                effective_to: data.effective_to,
                is_active: data.is_active,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch lab schedule');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.subject_assignment) {
            setError('Please select a subject assignment');
            return;
        }
        if (!formData.section) {
            setError('Please select a section');
            return;
        }
        if (!formData.start_time || !formData.end_time) {
            setError('Please enter both start and end times');
            return;
        }
        if (formData.start_time >= formData.end_time) {
            setError('End time must be after start time');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            if (mode === 'create') {
                await labScheduleApi.create(formData);
            } else if (mode === 'edit' && labScheduleId) {
                await labScheduleApi.update(labScheduleId, formData);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to save lab schedule');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading lab schedule details...</p>
                </div>
            </div>
        );
    }

    const isViewMode = mode === 'view';

    const dayOptions = [
        { value: 0, label: 'Monday' },
        { value: 1, label: 'Tuesday' },
        { value: 2, label: 'Wednesday' },
        { value: 3, label: 'Thursday' },
        { value: 4, label: 'Friday' },
        { value: 5, label: 'Saturday' },
        { value: 6, label: 'Sunday' },
    ];

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

            <CollegeField
                value={formData.college ?? null}
                onChange={(val: number | string) => {
                    setFormData({
                        ...formData,
                        college: Number(val),
                        subject_assignment: 0,
                        section: 0,
                        classroom: null
                    });
                }}
                className="mb-4"
            />

            {/* Subject Assignment */}
            <div className="space-y-2">
                <Label htmlFor="subject_assignment">
                    Subject Assignment <span className="text-destructive">*</span>
                </Label>
                <Select
                    value={formData.subject_assignment?.toString()}
                    onValueChange={(v) => setFormData({ ...formData, subject_assignment: parseInt(v) })}
                    disabled={isViewMode || loadingData}
                >
                    <SelectTrigger id="subject_assignment">
                        <SelectValue placeholder={loadingData ? "Loading..." : "Select subject assignment"} />
                    </SelectTrigger>
                    <SelectContent>
                        {subjectAssignments.map((sa) => (
                            <SelectItem key={sa.id} value={sa.id.toString()}>
                                {sa.subject_name} - {sa.class_name} ({sa.teacher_name})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Section */}
            <div className="space-y-2">
                <Label htmlFor="section">
                    Section <span className="text-destructive">*</span>
                </Label>
                <Select
                    value={formData.section?.toString()}
                    onValueChange={(v) => setFormData({ ...formData, section: parseInt(v) })}
                    disabled={isViewMode || loadingData}
                >
                    <SelectTrigger id="section">
                        <SelectValue placeholder={loadingData ? "Loading..." : "Select section"} />
                    </SelectTrigger>
                    <SelectContent>
                        {sections.map((s) => (
                            <SelectItem key={s.id} value={s.id.toString()}>
                                {s.name} - {s.class_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Day of Week */}
            <div className="space-y-2">
                <Label htmlFor="day_of_week">
                    Day of Week <span className="text-destructive">*</span>
                </Label>
                <Select
                    value={formData.day_of_week.toString()}
                    onValueChange={(v) => setFormData({ ...formData, day_of_week: parseInt(v) })}
                    disabled={isViewMode}
                >
                    <SelectTrigger id="day_of_week">
                        <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                        {dayOptions.map((day) => (
                            <SelectItem key={day.value} value={day.value.toString()}>
                                {day.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="start_time">
                        Start Time <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="start_time"
                        type="time"
                        value={formData.start_time}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        disabled={isViewMode}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="end_time">
                        End Time <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="end_time"
                        type="time"
                        value={formData.end_time}
                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                        disabled={isViewMode}
                        min={formData.start_time}
                        required
                    />
                </div>
            </div>

            {/* Classroom (Optional) */}
            <div className="space-y-2">
                <Label htmlFor="classroom">
                    Classroom <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Select
                    value={formData.classroom?.toString() || undefined}
                    onValueChange={(v) => setFormData({ ...formData, classroom: v ? parseInt(v) : null })}
                    disabled={isViewMode || loadingData}
                >
                    <SelectTrigger id="classroom">
                        <SelectValue placeholder={loadingData ? "Loading..." : "Select classroom"} />
                    </SelectTrigger>
                    <SelectContent>
                        {classrooms.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                                {c.name} ({c.code}) - Capacity: {c.capacity}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Batch Name (Optional) */}
            <div className="space-y-2">
                <Label htmlFor="batch_name">
                    Batch Name <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Input
                    id="batch_name"
                    value={formData.batch_name || ''}
                    onChange={(e) => setFormData({ ...formData, batch_name: e.target.value || null })}
                    placeholder="e.g., Batch A, Group 1"
                    disabled={isViewMode}
                />
            </div>

            {/* Effective Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="effective_from">
                        Effective From <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="effective_from"
                        type="date"
                        value={formData.effective_from}
                        onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })}
                        disabled={isViewMode}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="effective_to">
                        Effective To <span className="text-muted-foreground text-xs">(Optional)</span>
                    </Label>
                    <Input
                        id="effective_to"
                        type="date"
                        value={formData.effective_to || ''}
                        onChange={(e) => setFormData({ ...formData, effective_to: e.target.value || null })}
                        disabled={isViewMode}
                        min={formData.effective_from}
                    />
                </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
                <div className="space-y-0.5">
                    <Label className="text-base">Active Status</Label>
                    <p className="text-xs text-muted-foreground">
                        {formData.is_active ? 'This lab schedule is active' : 'This lab schedule is inactive'}
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
                        {isLoading ? 'Saving...' : mode === 'create' ? 'Create Lab Schedule' : 'Update Lab Schedule'}
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
