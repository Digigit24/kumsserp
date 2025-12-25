/**
 * Class Form Component
 * Form for creating and editing classes
 */

import { useState, useEffect } from 'react';
import { classApi, programApi } from '../../../services/academic.service';
import { useAcademicSessions } from '../../../hooks/useCore';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import type { Class, ClassCreateInput } from '../../../types/academic.types';

interface ClassFormProps {
    mode: 'view' | 'create' | 'edit';
    classId?: number;
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

export function ClassForm({ mode, classId, onSuccess, onCancel }: ClassFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [classData, setClassData] = useState<Class | null>(null);
    const [programs, setPrograms] = useState<any[]>([]);

    const { data: sessionsData } = useAcademicSessions({ page_size: 100 });

    const [formData, setFormData] = useState<ClassCreateInput>({
        college: getCollegeId(),
        program: 0,
        academic_session: 0,
        name: '',
        semester: 1,
        year: 1,
        max_students: 60,
        is_active: true,
    });

    useEffect(() => {
        fetchPrograms();
    }, []);

    useEffect(() => {
        if ((mode === 'edit' || mode === 'view') && classId) {
            fetchClass();
        }
    }, [mode, classId]);

    const fetchPrograms = async () => {
        try {
            const data = await programApi.list({ page_size: 100, is_active: true });
            setPrograms(data.results);
        } catch (err) {
            console.error('Failed to fetch programs:', err);
        }
    };

    const fetchClass = async () => {
        if (!classId) return;

        try {
            setIsFetching(true);
            const data = await classApi.get(classId);
            setClassData(data);
            setFormData({
                college: data.college,
                program: data.program,
                academic_session: data.academic_session,
                name: data.name,
                semester: data.semester,
                year: data.year,
                max_students: data.max_students,
                is_active: data.is_active,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch class');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            setError(null);

            // ✅ Log the data being sent for debugging
            console.log('Submitting class data:', formData);

            if (mode === 'create') {
                await classApi.create(formData);
            } else if (mode === 'edit' && classId) {
                await classApi.update(classId, formData);
            }

            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to save class');
            console.error('Class form error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="flex items-center justify-center py-8"><p className="text-muted-foreground">Loading...</p></div>;
    }

    const isViewMode = mode === 'view';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4"><p className="text-sm text-destructive">{error}</p></div>}

            {/* ✅ Show college info for debugging (optional - remove in production) */}
            {mode === 'create' && (
                <div className="rounded-md bg-muted p-3 text-sm">
                    <p className="text-muted-foreground">College ID: {formData.college}</p>
                </div>
            )}

            <div className="space-y-2">
                <Label>Program <span className="text-destructive">*</span></Label>
                <Select 
                    value={formData.program?.toString()} 
                    onValueChange={(v) => setFormData({ ...formData, program: parseInt(v) })} 
                    disabled={isViewMode}
                >
                    <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                    <SelectContent>
                        {programs.map((p) => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Academic Session <span className="text-destructive">*</span></Label>
                <Select 
                    value={formData.academic_session?.toString()} 
                    onValueChange={(v) => setFormData({ ...formData, academic_session: parseInt(v) })} 
                    disabled={isViewMode}
                >
                    <SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger>
                    <SelectContent>
                        {sessionsData?.results.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Class Name <span className="text-destructive">*</span></Label>
                <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="e.g., BSc CS - Sem 1" 
                    disabled={isViewMode} 
                    required 
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Semester</Label>
                    <Input 
                        type="number" 
                        value={formData.semester} 
                        onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })} 
                        min={1}
                        max={12}
                        disabled={isViewMode} 
                    />
                </div>
                <div className="space-y-2">
                    <Label>Year</Label>
                    <Input 
                        type="number" 
                        value={formData.year} 
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 1 })} 
                        min={1}
                        max={6}
                        disabled={isViewMode} 
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Max Students</Label>
                <Input 
                    type="number" 
                    value={formData.max_students} 
                    onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) || 60 })} 
                    min={1}
                    disabled={isViewMode} 
                />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
                <Label>Active Status</Label>
                <Switch 
                    checked={formData.is_active} 
                    onCheckedChange={(c) => setFormData({ ...formData, is_active: c })} 
                    disabled={isViewMode} 
                />
            </div>

            {!isViewMode && (
                <div className="flex gap-3 pt-4 border-t">
                    <Button type="submit" disabled={isLoading} className="flex-1">
                        {isLoading ? 'Saving...' : mode === 'create' ? 'Create Class' : 'Update Class'}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                </div>
            )}
        </form>
    );
}