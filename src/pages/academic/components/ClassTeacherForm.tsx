/**
 * Class Teacher Form Component
 * Enhanced with section support and better UX
 */

import { useState, useEffect } from 'react';
import { classTeacherApi, classApi, sectionApi } from '../../../services/academic.service';
import { useAcademicSessions } from '../../../hooks/useCore';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { ClassTeacher, ClassTeacherCreateInput } from '../../../types/academic.types';

interface ClassTeacherFormProps {
    mode: 'view' | 'create' | 'edit';
    classTeacherId?: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export function ClassTeacherForm({ mode, classTeacherId, onSuccess, onCancel }: ClassTeacherFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [loadingSections, setLoadingSections] = useState(false);

    const { data: sessionsData, isLoading: isLoadingSessions } = useAcademicSessions({ page_size: 100 });

    const [formData, setFormData] = useState<ClassTeacherCreateInput>({
        class_obj: 0,
        section: 0,
        teacher: '',
        academic_session: 0,
        assigned_from: new Date().toISOString().split('T')[0],
        is_active: true,
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if ((mode === 'edit' || mode === 'view') && classTeacherId) {
            fetchClassTeacher();
        }
    }, [mode, classTeacherId]);

    // Fetch sections when class is selected
    useEffect(() => {
        if (formData.class_obj) {
            fetchSections(formData.class_obj);
        } else {
            setSections([]);
            setFormData(prev => ({ ...prev, section: 0 }));
        }
    }, [formData.class_obj]);

    const fetchClasses = async () => {
        try {
            const data = await classApi.list({ page_size: 100, is_active: true });
            setClasses(data.results);
        } catch (err) {
            console.error('Failed to fetch classes:', err);
        }
    };

    const fetchSections = async (classId: number) => {
        try {
            setLoadingSections(true);
            const data = await sectionApi.list({
                class_obj: classId,
                page_size: 100,
                is_active: true
            });
            setSections(data.results);
        } catch (err) {
            console.error('Failed to fetch sections:', err);
            setSections([]);
        } finally {
            setLoadingSections(false);
        }
    };

    const fetchClassTeacher = async () => {
        if (!classTeacherId) return;
        try {
            setIsFetching(true);
            const data = await classTeacherApi.get(classTeacherId);

            // Note: ClassTeacher doesn't have academic_session, 
            // so we'll need to fetch it or use a default
            setFormData({
                class_obj: data.class_obj,
                section: data.section,
                teacher: data.teacher,
                academic_session: 0, // This needs to be fetched separately or derived
                assigned_from: data.assigned_from,
                assigned_to: data.assigned_to || undefined,
                is_current: data.is_current,
                is_active: data.is_active,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch class teacher');
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
        if (!formData.academic_session) {
            setError('Please select an academic session');
            return;
        }
        if (!formData.teacher.trim()) {
            setError('Please enter teacher username or email');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            if (mode === 'create') {
                await classTeacherApi.create(formData);
            } else if (mode === 'edit' && classTeacherId) {
                await classTeacherApi.update(classTeacherId, formData);
            }

            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to save class teacher');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading class teacher details...</p>
                </div>
            </div>
        );
    }

    const isViewMode = mode === 'view';
    const selectedClass = classes.find(c => c.id === formData.class_obj);

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

            {/* Class Selection */}
            <div className="space-y-2">
                <Label htmlFor="class">
                    Class <span className="text-destructive">*</span>
                </Label>
                <Select
                    value={formData.class_obj?.toString()}
                    onValueChange={(v) => setFormData({ ...formData, class_obj: parseInt(v), section: 0 })}
                    disabled={isViewMode}
                >
                    <SelectTrigger id="class">
                        <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                        {classes.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                                {c.name} - {c.program_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {selectedClass && (
                    <p className="text-xs text-muted-foreground">
                        {selectedClass.program_name} • {selectedClass.session_name}
                    </p>
                )}
            </div>

            {/* Section Selection (Required) */}
            <div className="space-y-2">
                <Label htmlFor="section">
                    Section <span className="text-destructive">*</span>
                </Label>
                <Select
                    value={formData.section?.toString()}
                    onValueChange={(v) => setFormData({ ...formData, section: parseInt(v) })}
                    disabled={isViewMode || !formData.class_obj || loadingSections}
                >
                    <SelectTrigger id="section">
                        <SelectValue placeholder={
                            loadingSections ? "Loading sections..." :
                                !formData.class_obj ? "Select a class first" :
                                    sections.length === 0 ? "No sections available" :
                                        "Select section"
                        } />
                    </SelectTrigger>
                    <SelectContent>
                        {sections.map((s) => (
                            <SelectItem key={s.id} value={s.id.toString()}>
                                {s.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {sections.length === 0 && formData.class_obj && !loadingSections && (
                    <p className="text-xs text-amber-600">
                        ⚠️ No sections found for this class. Please create sections first.
                    </p>
                )}
            </div>

            {/* Academic Session */}
            <div className="space-y-2">
                <Label htmlFor="session">
                    Academic Session <span className="text-destructive">*</span>
                </Label>
                <Select
                    value={formData.academic_session?.toString()}
                    onValueChange={(v) => setFormData({ ...formData, academic_session: parseInt(v) })}
                    disabled={isViewMode || isLoadingSessions}
                >
                    <SelectTrigger id="session">
                        <SelectValue placeholder="Select academic session" />
                    </SelectTrigger>
                    <SelectContent>
                        {sessionsData?.results.map((s) => (
                            <SelectItem key={s.id} value={s.id.toString()}>
                                {s.name} {s.is_active && <span className="text-xs text-green-600 ml-2">(Active)</span>}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Teacher */}
            <div className="space-y-2">
                <Label htmlFor="teacher">
                    Teacher Username/Email <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="teacher"
                    value={formData.teacher}
                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                    placeholder="e.g., john.doe or john.doe@school.edu"
                    disabled={isViewMode}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    Enter the teacher's username or email address from the system
                </p>
            </div>

            {/* Assigned From Date */}
            <div className="space-y-2">
                <Label htmlFor="assigned_from">
                    Assignment Start Date <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="assigned_from"
                    type="date"
                    value={formData.assigned_from}
                    onChange={(e) => setFormData({ ...formData, assigned_from: e.target.value })}
                    disabled={isViewMode}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    The date from which this teacher assignment is effective
                </p>
            </div>

            {/* Assigned To Date (Optional) */}
            <div className="space-y-2">
                <Label htmlFor="assigned_to">
                    Assignment End Date <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Input
                    id="assigned_to"
                    type="date"
                    value={formData.assigned_to || ''}
                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value || undefined })}
                    disabled={isViewMode}
                    min={formData.assigned_from}
                />
                <p className="text-xs text-muted-foreground">
                    Leave blank if the assignment is ongoing
                </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
                <div className="space-y-0.5">
                    <Label className="text-base">Active Status</Label>
                    <p className="text-xs text-muted-foreground">
                        {formData.is_active ? 'This assignment is active' : 'This assignment is inactive'}
                    </p>
                </div>
                <Switch
                    checked={formData.is_active}
                    onCheckedChange={(c) => setFormData({ ...formData, is_active: c })}
                    disabled={isViewMode}
                />
            </div>

            {/* View Mode Info */}
            {isViewMode && classTeacherId && (
                <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
                    <h4 className="font-semibold">Assignment Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                        <span>Assignment ID:</span>
                        <span className="font-mono">#{classTeacherId}</span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {!isViewMode && (
                <div className="flex gap-3 pt-4 border-t">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {isLoading ? 'Saving...' : mode === 'create' ? 'Assign Class Teacher' : 'Update Assignment'}
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