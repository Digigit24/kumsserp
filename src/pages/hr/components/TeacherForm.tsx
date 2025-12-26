/**
 * Teacher Form Component
 * Used for creating and editing teachers (users with user_type='teacher')
 */

import { useState, useEffect } from 'react';
import { userApi } from '../../../services/accounts.service';
import { useDepartments } from '../../../hooks/useAccounts';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import type { User, UserCreateInput, GenderChoices } from '../../../types/accounts.types';

interface TeacherFormProps {
    mode: 'view' | 'create' | 'edit';
    teacherId?: string;
    onSuccess: () => void;
    onCancel: () => void;
}

interface TeacherFormData {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    phone: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    gender: GenderChoices | '';
    date_of_birth: string;
    college: number;
    department?: number | null;
}

const GENDERS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
];

export function TeacherForm({ mode, teacherId, onSuccess, onCancel }: TeacherFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("account");

    const { data: departmentsData } = useDepartments({ page_size: 100, is_active: true });

    const [formData, setFormData] = useState<TeacherFormData>({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        phone: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        gender: '',
        date_of_birth: '',
        college: 1, // Default college
        department: null,
    });

    useEffect(() => {
        if ((mode === 'edit' || mode === 'view') && teacherId) {
            fetchTeacher();
        }
    }, [mode, teacherId]);

    const fetchTeacher = async () => {
        if (!teacherId) return;
        try {
            setIsFetching(true);
            const data = await userApi.get(teacherId);
            setFormData({
                username: data.username,
                email: data.email,
                password: '',
                password_confirm: '',
                phone: data.phone || '',
                first_name: data.first_name,
                last_name: data.last_name,
                middle_name: data.middle_name || '',
                gender: data.gender || '',
                date_of_birth: data.date_of_birth || '',
                college: data.college || 1,
                department: null, // This would need to come from UserProfile
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch teacher');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.first_name || !formData.last_name || !formData.email) {
            setError('Please fill all required fields (marked with *)');
            return;
        }

        if (mode === 'create') {
            if (!formData.username || !formData.password || !formData.password_confirm) {
                setError('Please fill all required fields');
                return;
            }

            if (formData.password !== formData.password_confirm) {
                setError('Passwords do not match');
                return;
            }

            if (formData.password.length < 8) {
                setError('Password must be at least 8 characters');
                return;
            }
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Invalid email format');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            if (mode === 'create') {
                const payload: UserCreateInput = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    password_confirm: formData.password_confirm,
                    phone: formData.phone || null,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    middle_name: formData.middle_name || null,
                    gender: (formData.gender || null) as GenderChoices | null,
                    date_of_birth: formData.date_of_birth || null,
                    college: formData.college,
                    user_type: 'teacher', // Fixed as teacher
                    is_active: true,
                };
                await userApi.create(payload);
            } else if (mode === 'edit' && teacherId) {
                const payload = {
                    email: formData.email,
                    phone: formData.phone || null,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    middle_name: formData.middle_name || null,
                    gender: (formData.gender || null) as GenderChoices | null,
                    date_of_birth: formData.date_of_birth || null,
                };
                await userApi.update(teacherId, payload);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to save teacher');
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Account Info</TabsTrigger>
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                </TabsList>

                {/* ACCOUNT INFO TAB */}
                <TabsContent value="account" className="space-y-4 mt-4">
                    {mode === 'create' && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="username">
                                    Username <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                                    placeholder="e.g., john.doe"
                                    disabled={isViewMode}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">
                                        Password <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Min. 8 characters"
                                        disabled={isViewMode}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirm">
                                        Confirm Password <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="password_confirm"
                                        type="password"
                                        value={formData.password_confirm}
                                        onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
                                        placeholder="Confirm password"
                                        disabled={isViewMode}
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="teacher@example.com"
                                disabled={isViewMode}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+91 XXXXX XXXXX"
                                disabled={isViewMode}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Department</Label>
                        <Select
                            value={formData.department?.toString() || ''}
                            onValueChange={(v) => setFormData({ ...formData, department: v ? parseInt(v) : null })}
                            disabled={isViewMode}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select department (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {departmentsData?.results.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                        {dept.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>

                {/* PERSONAL INFO TAB */}
                <TabsContent value="personal" className="space-y-4 mt-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">
                                First Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="first_name"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                disabled={isViewMode}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="middle_name">Middle Name</Label>
                            <Input
                                id="middle_name"
                                value={formData.middle_name}
                                onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                                disabled={isViewMode}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">
                                Last Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="last_name"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                disabled={isViewMode}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date_of_birth">Date of Birth</Label>
                            <Input
                                id="date_of_birth"
                                type="date"
                                value={formData.date_of_birth}
                                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                disabled={isViewMode}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select
                                value={formData.gender}
                                onValueChange={(v) => setFormData({ ...formData, gender: v as GenderChoices })}
                                disabled={isViewMode}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">None</SelectItem>
                                    {GENDERS.map((g) => (
                                        <SelectItem key={g.value} value={g.value}>
                                            {g.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {!isViewMode && (
                <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-background">
                    <Button type="submit" disabled={isLoading} className="flex-1">
                        {isLoading ? 'Saving...' : mode === 'create' ? 'Create Teacher' : 'Update Teacher'}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                </div>
            )}
        </form>
    );
}
