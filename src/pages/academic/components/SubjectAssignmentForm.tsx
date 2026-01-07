/**
 * Subject Assignment Form Component
 */

import { useAuth } from '@/hooks/useAuth';
import { getCurrentUserCollege } from '@/utils/auth.utils';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CollegeField } from '../../../components/common/CollegeField';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Switch } from '../../../components/ui/switch';
import { classApi, sectionApi, subjectApi, subjectAssignmentApi } from '../../../services/academic.service';
import { userApi } from '../../../services/accounts.service';
import type { SubjectAssignmentCreateInput } from '../../../types/academic.types';
import type { UserListItem } from '../../../types/accounts.types';

interface SubjectAssignmentFormProps {
    mode: 'view' | 'create' | 'edit';
    subjectAssignmentId?: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export function SubjectAssignmentForm({ mode, subjectAssignmentId, onSuccess, onCancel }: SubjectAssignmentFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [subjects, setSubjects] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<UserListItem[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);

    const { user } = useAuth();
    const [formData, setFormData] = useState<SubjectAssignmentCreateInput>({
        college: getCurrentUserCollege(user as any) || 0,
        subject: 0,
        class_obj: 0,
        section: null,
        teacher: null,
        lab_instructor: null,
        is_optional: false,
        is_active: true,
    });

    useEffect(() => {
        fetchFormData();
    }, []);

    useEffect(() => {
        if ((mode === 'edit' || mode === 'view') && subjectAssignmentId) {
            fetchSubjectAssignment();
        }
    }, [mode, subjectAssignmentId]);

    // Fetch sections when class is selected
    useEffect(() => {
        if (formData.class_obj) {
            fetchSections(formData.class_obj);
        } else {
            setSections([]);
            setFormData(prev => ({ ...prev, section: null }));
        }
    }, [formData.class_obj]);

    const fetchFormData = async () => {
        try {
            setLoadingData(true);
            const [subjectsData, classesData, teachersData] = await Promise.all([
                subjectApi.list({ page_size: 500, is_active: true }),
                classApi.list({ page_size: 200, is_active: true }),
                userApi.list({ user_type: 'teacher', page_size: 200, is_active: true })
            ]);
            setSubjects(subjectsData.results);
            setClasses(classesData.results);
            setTeachers(teachersData.results);
        } catch (err) {
            console.error('Failed to fetch form data:', err);
        } finally {
            setLoadingData(false);
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

    const fetchSubjectAssignment = async () => {
        if (!subjectAssignmentId) return;
        try {
            setIsFetching(true);
            const data = await subjectAssignmentApi.get(subjectAssignmentId);
            setFormData({
                subject: data.subject,
                class_obj: data.class_obj,
                section: data.section,
                teacher: data.teacher,
                lab_instructor: data.lab_instructor,
                is_optional: data.is_optional,
                is_active: data.is_active,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch subject assignment');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.subject) {
            setError('Please select a subject');
            return;
        }
        if (!formData.class_obj) {
            setError('Please select a class');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            if (mode === 'create') {
                await subjectAssignmentApi.create(formData);
            } else if (mode === 'edit' && subjectAssignmentId) {
                await subjectAssignmentApi.update(subjectAssignmentId, formData);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to save subject assignment');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading subject assignment...</p>
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

            {/* College Selection */}
            <CollegeField
                value={formData.college}
                onChange={(val: number | string) => {
                    setFormData({ ...formData, college: Number(val), class_obj: 0, section: null });
                }}
                className="mb-4"
            />

            {/* Subject */}
            <div className="space-y-2">
                <Label htmlFor="subject">
                    Subject <span className="text-destructive">*</span>
                </Label>
                <Select
                    value={formData.subject?.toString()}
                    onValueChange={(v) => setFormData({ ...formData, subject: parseInt(v) })}
                    disabled={isViewMode || loadingData}
                >
                    <SelectTrigger id="subject">
                        <SelectValue placeholder={loadingData ? "Loading..." : "Select subject"} />
                    </SelectTrigger>
                    <SelectContent>
                        {subjects.map((s) => (
                            <SelectItem key={s.id} value={s.id.toString()}>
                                {s.name} ({s.code})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Class */}
            <div className="space-y-2">
                <Label htmlFor="class_obj">
                    Class <span className="text-destructive">*</span>
                </Label>
                <Select
                    value={formData.class_obj?.toString()}
                    onValueChange={(v) => setFormData({ ...formData, class_obj: parseInt(v), section: null })}
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

            {/* Section (Optional) */}
            <div className="space-y-2">
                <Label htmlFor="section">
                    Section <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Select
                    value={formData.section?.toString() || undefined}
                    onValueChange={(v) => setFormData({ ...formData, section: v ? parseInt(v) : null })}
                    disabled={isViewMode || !formData.class_obj || loadingSections}
                >
                    <SelectTrigger id="section">
                        <SelectValue placeholder={
                            loadingSections ? "Loading sections..." :
                                !formData.class_obj ? "Select a class first" :
                                    sections.length === 0 ? "No sections available" :
                                        "Select section (optional)"
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
                <p className="text-xs text-muted-foreground">
                    Leave blank to assign to all sections of the class
                </p>
            </div>

            {/* Teacher (Optional) */}
            <div className="space-y-2">
                <Label htmlFor="teacher">
                    Teacher <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Select
                    value={formData.teacher || undefined}
                    onValueChange={(v) => setFormData({ ...formData, teacher: v || null })}
                    disabled={isViewMode || loadingData}
                >
                    <SelectTrigger id="teacher">
                        <SelectValue placeholder={loadingData ? "Loading..." : "Select teacher (optional)"} />
                    </SelectTrigger>
                    <SelectContent>
                        {teachers.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                                {t.full_name || t.username} {t.email && `(${t.email})`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Lab Instructor (Optional) */}
            <div className="space-y-2">
                <Label htmlFor="lab_instructor">
                    Lab Instructor <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Select
                    value={formData.lab_instructor || undefined}
                    onValueChange={(v) => setFormData({ ...formData, lab_instructor: v || null })}
                    disabled={isViewMode || loadingData}
                >
                    <SelectTrigger id="lab_instructor">
                        <SelectValue placeholder={loadingData ? "Loading..." : "Select lab instructor (optional)"} />
                    </SelectTrigger>
                    <SelectContent>
                        {teachers.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                                {t.full_name || t.username} {t.email && `(${t.email})`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Is Optional */}
            <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
                <div className="space-y-0.5">
                    <Label className="text-base">Optional Subject</Label>
                    <p className="text-xs text-muted-foreground">
                        {formData.is_optional ? 'This is an optional subject for students' : 'This is a mandatory subject'}
                    </p>
                </div>
                <Switch
                    checked={formData.is_optional}
                    onCheckedChange={(c) => setFormData({ ...formData, is_optional: c })}
                    disabled={isViewMode}
                />
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

            {/* Action Buttons */}
            {!isViewMode && (
                <div className="flex gap-3 pt-4 border-t">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {isLoading ? 'Saving...' : mode === 'create' ? 'Create Subject Assignment' : 'Update Subject Assignment'}
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
