/**
 * Classroom Form Component
 */

import { useAuth } from '@/hooks/useAuth';
import { getCurrentUserCollege } from '@/utils/auth.utils';
import { useEffect, useState } from 'react';
import { CollegeField } from '../../../components/common/CollegeField';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Switch } from '../../../components/ui/switch';
import { classroomApi } from '../../../services/academic.service';
import type { ClassroomCreateInput } from '../../../types/academic.types';

interface ClassroomFormProps {
    mode: 'view' | 'create' | 'edit';
    classroomId?: number;
    onSuccess: () => void;
    onCancel: () => void;
}

const ROOM_TYPES = [
    { value: 'classroom', label: 'Classroom' },
    { value: 'laboratory', label: 'Laboratory' },
    { value: 'library', label: 'Library' },
    { value: 'auditorium', label: 'Auditorium' },
    { value: 'conference', label: 'Conference Room' },
];

export function ClassroomForm({ mode, classroomId, onSuccess, onCancel }: ClassroomFormProps) {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<ClassroomCreateInput>({
        college: getCurrentUserCollege(user as any) || 0,
        code: '',
        name: '',
        room_type: 'classroom',
        building: '',
        floor: '',
        capacity: 60,
        has_projector: false,
        has_ac: false,
        has_computer: false,
        is_active: true,
    });

    useEffect(() => {
        if ((mode === 'edit' || mode === 'view') && classroomId) {
            fetchClassroom();
        }
    }, [mode, classroomId]);

    const fetchClassroom = async () => {
        if (!classroomId) return;
        try {
            setIsFetching(true);
            const data = await classroomApi.get(classroomId);
            setFormData({
                college: data.college,
                code: data.code,
                name: data.name,
                room_type: data.room_type,
                building: data.building || '',
                floor: data.floor || '',
                capacity: data.capacity,
                has_projector: data.has_projector,
                has_ac: data.has_ac,
                has_computer: data.has_computer,
                is_active: data.is_active,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch classroom');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setError(null);

            console.log('Submitting classroom data:', formData); // ✅ Debug log

            if (mode === 'create') {
                await classroomApi.create(formData);
            } else if (mode === 'edit' && classroomId) {
                await classroomApi.update(classroomId, formData);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to save classroom');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div className="flex items-center justify-center py-8"><p className="text-muted-foreground">Loading...</p></div>;

    const isViewMode = mode === 'view';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4"><p className="text-sm text-destructive">{error}</p></div>}

            <CollegeField
                value={formData.college}
                onChange={(val: number | string) => setFormData({ ...formData, college: Number(val) })}
                className="mb-4"
            />


            <div className="space-y-2">
                <Label htmlFor="code">Room Code <span className="text-destructive">*</span></Label>
                <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g., R-101, LAB-201" disabled={isViewMode} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Room Name <span className="text-destructive">*</span></Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Computer Lab 1, Lecture Hall A" disabled={isViewMode} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="building">Building</Label>
                    <Input id="building" value={formData.building || ''} onChange={(e) => setFormData({ ...formData, building: e.target.value })} placeholder="e.g., Block A" disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="floor">Floor</Label>
                    <Input id="floor" value={formData.floor || ''} onChange={(e) => setFormData({ ...formData, floor: e.target.value })} placeholder="e.g., Ground, 1st" disabled={isViewMode} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="room_type">Room Type</Label>
                <Select value={formData.room_type} onValueChange={(v) => setFormData({ ...formData, room_type: v })} disabled={isViewMode}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {ROOM_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 60 })} min={1} disabled={isViewMode} />
            </div>

            <div className="space-y-4">
                <Label>Facilities</Label>

                <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="has_projector">Projector</Label>
                    <Switch id="has_projector" checked={formData.has_projector} onCheckedChange={(c) => setFormData({ ...formData, has_projector: c })} disabled={isViewMode} />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="has_ac">Air Conditioning</Label>
                    <Switch id="has_ac" checked={formData.has_ac} onCheckedChange={(c) => setFormData({ ...formData, has_ac: c })} disabled={isViewMode} />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="has_computer">Computer/Lab Equipment</Label>
                    <Switch id="has_computer" checked={formData.has_computer} onCheckedChange={(c) => setFormData({ ...formData, has_computer: c })} disabled={isViewMode} />
                </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="is_active">Active Status</Label>
                    <p className="text-sm text-muted-foreground">Inactive rooms won't be available for booking</p>
                </div>
                <Switch id="is_active" checked={formData.is_active} onCheckedChange={(c) => setFormData({ ...formData, is_active: c })} disabled={isViewMode} />
            </div>

            {!isViewMode && (
                <div className="flex gap-3 pt-4 border-t">
                    <Button type="submit" disabled={isLoading} className="flex-1">{isLoading ? 'Saving...' : mode === 'create' ? 'Create Classroom' : 'Update Classroom'}</Button>
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                </div>
            )}
        </form>
    );
}