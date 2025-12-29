/**
 * Section Form Component - WITH COLLEGE DROPDOWN
 */

import { useState, useEffect } from 'react';
import { sectionApi, classApi } from '../../../services/academic.service';
import { useColleges } from '../../../hooks/useCore';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import type { Section, SectionCreateInput } from '../../../types/academic.types';

interface SectionFormProps {
    mode: 'view' | 'create' | 'edit';
    sectionId?: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export function SectionForm({ mode, sectionId, onSuccess, onCancel }: SectionFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuth();
    const userCollegeId = user?.college;
    const hasOnlyOneCollege = !!userCollegeId;

    // Fetch colleges
    const { data: collegesData } = useColleges({ page_size: 100, is_active: true });

    const [selectedCollege, setSelectedCollege] = useState<number>(hasOnlyOneCollege ? userCollegeId : 0);
    const [classes, setClasses] = useState<any[]>([]);
    const [allClasses, setAllClasses] = useState<any[]>([]);

    const [formData, setFormData] = useState<SectionCreateInput>({
        class_obj: 0,
        name: '',
        max_students: 60,
        is_active: true,
    });

    // Fetch all classes on mount
    useEffect(() => {
        fetchAllClasses();
    }, []);

    // Filter classes when college is selected
    useEffect(() => {
        if (selectedCollege) {
            const filteredClasses = allClasses.filter(c => c.college === selectedCollege);
            setClasses(filteredClasses);
        } else {
            setClasses(allClasses);
        }
    }, [selectedCollege, allClasses]);

    // Load section data for edit mode
    useEffect(() => {
        if ((mode === 'edit' || mode === 'view') && sectionId) {
            fetchSection();
        }
    }, [mode, sectionId]);

    const fetchAllClasses = async () => {
        try {
            const data = await classApi.list({ page_size: 100, is_active: true });
            setAllClasses(data.results);
            setClasses(data.results);
        } catch (err) {
            console.error('Failed to fetch classes:', err);
        }
    };

    const fetchSection = async () => {
        if (!sectionId) return;
        try {
            setIsFetching(true);
            const data = await sectionApi.get(sectionId);
            setFormData({
                class_obj: data.class_obj,
                name: data.name,
                max_students: data.max_students,
                is_active: data.is_active,
            });

            // Find the class to get its college
            const selectedClass = allClasses.find(c => c.id === data.class_obj);
            if (selectedClass) {
                setSelectedCollege(selectedClass.college);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch section');
        } finally {
            setIsFetching(false);
        }
    };

    const handleCollegeChange = (collegeId: string) => {
        const id = parseInt(collegeId);
        setSelectedCollege(id);
        // Reset class selection when college changes
        setFormData({ ...formData, class_obj: 0 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!selectedCollege || selectedCollege === 0) {
            setError('Please select a college first');
            return;
        }

        if (!formData.class_obj || formData.class_obj === 0) {
            setError('Please select a class');
            return;
        }

        if (!formData.name || formData.name.trim() === '') {
            setError('Please enter a section name');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Prepare payload
            const payload = {
                class_obj: formData.class_obj,
                name: formData.name.trim(),
                max_students: formData.max_students,
                is_active: formData.is_active,
            };

            console.log('=== SECTION CREATION ===');
            console.log('College:', selectedCollege);
            console.log('Payload:', payload);
            console.log('=======================');

            if (mode === 'create') {
                const response = await sectionApi.create(payload);
                console.log('✅ Section created successfully:', response);
            } else if (mode === 'edit' && sectionId) {
                const response = await sectionApi.update(sectionId, payload);
                console.log('✅ Section updated successfully:', response);
            }
            onSuccess();
        } catch (err: any) {
            console.error('❌ Section creation error:', err);
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.detail ||
                err.message ||
                'Failed to save section. Please check your inputs and try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    const isViewMode = mode === 'view';
    const selectedClass = classes.find(c => c.id === formData.class_obj);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
                    <p className="text-sm font-semibold text-destructive mb-2">Error:</p>
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            {/* STEP 1: Select College */}
            {!hasOnlyOneCollege && (
                <div className="space-y-2 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                    <Label className="text-base font-semibold">
                        Step 1: Select College <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={selectedCollege?.toString()}
                        onValueChange={handleCollegeChange}
                        disabled={isViewMode || mode === 'edit'}
                    >
                        <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Choose a college first" />
                        </SelectTrigger>
                        <SelectContent>
                            {collegesData?.results.length === 0 ? (
                                <div className="p-2 text-sm text-muted-foreground">
                                    No colleges available
                                </div>
                            ) : (
                                collegesData?.results.map((college) => (
                                    <SelectItem key={college.id} value={college.id.toString()}>
                                        {college.name}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                    {!selectedCollege && mode === 'create' && (
                        <p className="text-xs text-amber-600">
                            ⚠️ Select a college to see available classes
                        </p>
                    )}
                    {selectedCollege && (
                        <p className="text-xs text-green-600">
                            ✓ College selected - {classes.length} classes available
                        </p>
                    )}
                </div>
            )}

            {/* STEP 2: Select Class */}
            <div className="space-y-2">
                <Label>
                    Step 2: Select Class <span className="text-destructive">*</span>
                </Label>
                <Select
                    value={formData.class_obj?.toString()}
                    onValueChange={(v) => setFormData({ ...formData, class_obj: parseInt(v) })}
                    disabled={isViewMode || !selectedCollege}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={!selectedCollege ? "Select college first" : "Select class"} />
                    </SelectTrigger>
                    <SelectContent>
                        {classes.length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground">
                                {!selectedCollege
                                    ? "Please select a college first"
                                    : "No classes available for this college"}
                            </div>
                        ) : (
                            classes.map((c) => (
                                <SelectItem key={c.id} value={c.id.toString()}>
                                    {c.name} {c.program_name && `(${c.program_name})`}
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
                {selectedClass && (
                    <p className="text-xs text-muted-foreground">
                        Selected: {selectedClass.name} - {selectedClass.program_name}
                    </p>
                )}
            </div>

            {/* STEP 3: Section Details */}
            <div className="space-y-4 pt-2 border-t">
                <Label className="text-base font-semibold">Step 3: Section Details</Label>

                <div className="space-y-2">
                    <Label htmlFor="name">
                        Section Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Section A, Section B, Morning Batch"
                        disabled={isViewMode}
                        required
                    />
                    <p className="text-xs text-muted-foreground">
                        Use descriptive names like "Section A", "Morning Batch", "Group 1"
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="max_students">Maximum Students</Label>
                    <Input
                        id="max_students"
                        type="number"
                        min="1"
                        max="200"
                        value={formData.max_students}
                        onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) || 60 })}
                        disabled={isViewMode}
                    />
                    <p className="text-xs text-muted-foreground">
                        Maximum number of students allowed in this section
                    </p>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label>Active Status</Label>
                        <p className="text-xs text-muted-foreground">
                            Enable this section for new admissions
                        </p>
                    </div>
                    <Switch
                        checked={formData.is_active}
                        onCheckedChange={(c) => setFormData({ ...formData, is_active: c })}
                        disabled={isViewMode}
                    />
                </div>
            </div>

            {!isViewMode && (
                <div className="flex gap-3 pt-4 border-t">
                    <Button type="submit" disabled={isLoading || !selectedCollege} className="flex-1">
                        {isLoading ? 'Saving...' : mode === 'create' ? 'Create Section' : 'Update Section'}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                </div>
            )}
        </form>
    );
}