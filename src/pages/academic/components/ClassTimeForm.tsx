/**
 * Class Time Form Component
 * Enhanced with proper field mapping and better UX
 */

import { useState, useEffect } from 'react';
import { classTimeApi } from '../../../services/academic.service';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { AlertCircle, Loader2, Clock } from 'lucide-react';
import type { ClassTime, ClassTimeCreateInput } from '../../../types/academic.types';

interface ClassTimeFormProps {
    mode: 'view' | 'create' | 'edit';
    classTimeId?: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export function ClassTimeForm({ mode, classTimeId, onSuccess, onCancel }: ClassTimeFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuth();
    const collegeId = user?.college || user?.user_roles?.[0]?.college_id || 0;

    const [formData, setFormData] = useState<ClassTimeCreateInput>({
        college: collegeId,
        period_number: 1,
        start_time: '',
        end_time: '',
        is_break: false,
        break_name: null,
        is_active: true,
    });

    useEffect(() => {
        if ((mode === 'edit' || mode === 'view') && classTimeId) {
            fetchClassTime();
        }
    }, [mode, classTimeId]);

    const fetchClassTime = async () => {
        if (!classTimeId) return;
        try {
            setIsFetching(true);
            const data = await classTimeApi.get(classTimeId);
            setFormData({
                college: data.college,
                period_number: data.period_number,
                start_time: data.start_time,
                end_time: data.end_time,
                is_break: data.is_break,
                break_name: data.break_name,
                is_active: data.is_active,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch class time');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.period_number || formData.period_number < 1) {
            setError('Period number must be at least 1');
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
        if (formData.is_break && !formData.break_name?.trim()) {
            setError('Please enter a break name');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Clean up break_name if not a break and ensure college is set
            const submitData = {
                ...formData,
                college: collegeId,
                break_name: formData.is_break ? formData.break_name : null,
            };

            if (mode === 'create') {
                await classTimeApi.create(submitData);
            } else if (mode === 'edit' && classTimeId) {
                await classTimeApi.update(classTimeId, submitData);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to save class time');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading class time details...</p>
                </div>
            </div>
        );
    }

    const isViewMode = mode === 'view';

    // Calculate duration for preview
    const calculateDuration = () => {
        if (!formData.start_time || !formData.end_time) return null;
        const start = new Date(`2000-01-01T${formData.start_time}`);
        const end = new Date(`2000-01-01T${formData.end_time}`);
        const diff = (end.getTime() - start.getTime()) / (1000 * 60);
        return diff > 0 ? diff : null;
    };

    const duration = calculateDuration();

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

            {/* Period Number */}
            <div className="space-y-2">
                <Label htmlFor="period_number">
                    Period Number <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="period_number"
                    type="number"
                    min="1"
                    value={formData.period_number}
                    onChange={(e) => setFormData({ ...formData, period_number: parseInt(e.target.value) || 1 })}
                    placeholder="e.g., 1, 2, 3..."
                    disabled={isViewMode}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    Sequential number for this time slot in the daily schedule
                </p>
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

            {/* Duration Preview */}
            {duration && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <Clock className="h-4 w-4" />
                    <span>
                        Duration: <strong>{duration} minutes</strong>
                        {duration >= 60 && ` (${Math.floor(duration / 60)}h ${duration % 60}m)`}
                    </span>
                </div>
            )}

            {/* Is Break Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
                <div className="space-y-0.5">
                    <Label className="text-base">Is This a Break?</Label>
                    <p className="text-xs text-muted-foreground">
                        Mark this slot as a break period (lunch, recess, etc.)
                    </p>
                </div>
                <Switch
                    checked={formData.is_break}
                    onCheckedChange={(c) => setFormData({ ...formData, is_break: c, break_name: c ? formData.break_name : null })}
                    disabled={isViewMode}
                />
            </div>

            {/* Break Name (conditional) */}
            {formData.is_break && (
                <div className="space-y-2 animate-in slide-in-from-top-2">
                    <Label htmlFor="break_name">
                        Break Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="break_name"
                        value={formData.break_name || ''}
                        onChange={(e) => setFormData({ ...formData, break_name: e.target.value })}
                        placeholder="e.g., Lunch Break, Short Break, Recess"
                        disabled={isViewMode}
                        required={formData.is_break}
                    />
                    <p className="text-xs text-muted-foreground">
                        A descriptive name for this break period
                    </p>
                </div>
            )}

            {/* Active Status */}
            <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
                <div className="space-y-0.5">
                    <Label className="text-base">Active Status</Label>
                    <p className="text-xs text-muted-foreground">
                        {formData.is_active ? 'This time slot is active and available for scheduling' : 'This time slot is inactive'}
                    </p>
                </div>
                <Switch
                    checked={formData.is_active}
                    onCheckedChange={(c) => setFormData({ ...formData, is_active: c })}
                    disabled={isViewMode}
                />
            </div>

            {/* View Mode Info */}
            {isViewMode && classTimeId && (
                <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
                    <h4 className="font-semibold">Time Slot Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                        <span>Time Slot ID:</span>
                        <span className="font-mono">#{classTimeId}</span>
                        {formData.is_break && (
                            <>
                                <span>Type:</span>
                                <span className="text-orange-600 font-medium">Break Period</span>
                            </>
                        )}
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
                        {isLoading ? 'Saving...' : mode === 'create' ? 'Create Time Slot' : 'Update Time Slot'}
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