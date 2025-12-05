/**
 * User Form Component
 * Used for creating and editing users
 */

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Checkbox } from '../../../components/ui/checkbox';
import type { User, UserCreateInput, UserUpdateInput, UserType, GenderChoices } from '../../../types/accounts.types';

interface UserFormData {
  username: string;
  email: string;
  password?: string;
  password_confirm?: string;
  phone: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  gender: GenderChoices | '';
  date_of_birth: string;
  college: number | '';
  user_type: UserType;
  is_active: boolean;
}

interface UserFormProps {
  mode: 'create' | 'edit';
  user?: User;
  onSuccess: () => void;
  onCancel: () => void;
  onSubmit: (data: UserCreateInput | UserUpdateInput) => Promise<void>;
}

export const UserForm = ({ mode, user, onSuccess, onCancel, onSubmit }: UserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserFormData>({
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
    college: '',
    user_type: 'student',
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        username: user.username,
        email: user.email,
        phone: user.phone || '',
        first_name: user.first_name,
        last_name: user.last_name,
        middle_name: user.middle_name || '',
        gender: user.gender || '',
        date_of_birth: user.date_of_birth || '',
        college: user.college || '',
        user_type: user.user_type,
        is_active: user.is_active,
      });
    }
  }, [mode, user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'create') {
      if (!formData.username.trim()) newErrors.username = 'Username is required';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (!formData.password_confirm) newErrors.password_confirm = 'Please confirm password';
      else if (formData.password !== formData.password_confirm) newErrors.password_confirm = 'Passwords do not match';
      if (!formData.college) newErrors.college = 'College is required';
    }

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const submitData: any = {
        email: formData.email,
        phone: formData.phone || null,
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name || null,
        gender: formData.gender || null,
        date_of_birth: formData.date_of_birth || null,
      };

      if (mode === 'create') {
        submitData.username = formData.username;
        submitData.password = formData.password;
        submitData.password_confirm = formData.password_confirm;
        submitData.college = Number(formData.college);
        submitData.user_type = formData.user_type;
        submitData.is_active = formData.is_active;
      }

      await onSubmit(submitData);
      onSuccess();
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || 'Failed to save user');
      if (err.errors) {
        const backendErrors: Record<string, string> = {};
        Object.entries(err.errors).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            backendErrors[key] = value[0];
          } else {
            backendErrors[key] = String(value);
          }
        });
        setErrors(backendErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Account Information */}
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
            Account Information
          </h3>
          <div className="space-y-4">
            {mode === 'create' && (
              <>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-2">
                    Username <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value.toLowerCase())}
                    placeholder="Enter username"
                    disabled={isSubmitting}
                    className={errors.username ? 'border-destructive' : ''}
                  />
                  {errors.username && <p className="text-sm text-destructive mt-1">{errors.username}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                      Password <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="Enter password"
                      disabled={isSubmitting}
                      className={errors.password ? 'border-destructive' : ''}
                    />
                    {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label htmlFor="password_confirm" className="block text-sm font-medium mb-2">
                      Confirm Password <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="password_confirm"
                      type="password"
                      value={formData.password_confirm}
                      onChange={(e) => handleChange('password_confirm', e.target.value)}
                      placeholder="Confirm password"
                      disabled={isSubmitting}
                      className={errors.password_confirm ? 'border-destructive' : ''}
                    />
                    {errors.password_confirm && <p className="text-sm text-destructive mt-1">{errors.password_confirm}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="college" className="block text-sm font-medium mb-2">
                      College <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="college"
                      type="number"
                      value={formData.college}
                      onChange={(e) => handleChange('college', e.target.value)}
                      placeholder="Enter college ID"
                      disabled={isSubmitting}
                      className={errors.college ? 'border-destructive' : ''}
                    />
                    {errors.college && <p className="text-sm text-destructive mt-1">{errors.college}</p>}
                  </div>

                  <div>
                    <label htmlFor="user_type" className="block text-sm font-medium mb-2">
                      User Type
                    </label>
                    <select
                      id="user_type"
                      value={formData.user_type}
                      onChange={(e) => handleChange('user_type', e.target.value as UserType)}
                      disabled={isSubmitting}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="staff">Staff</option>
                      <option value="parent">Parent</option>
                      <option value="college_admin">College Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="user@example.com"
                  disabled={isSubmitting}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
            Personal Information
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium mb-2">
                  First Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  placeholder="Enter first name"
                  disabled={isSubmitting}
                  className={errors.first_name ? 'border-destructive' : ''}
                />
                {errors.first_name && <p className="text-sm text-destructive mt-1">{errors.first_name}</p>}
              </div>

              <div>
                <label htmlFor="middle_name" className="block text-sm font-medium mb-2">
                  Middle Name
                </label>
                <Input
                  id="middle_name"
                  value={formData.middle_name}
                  onChange={(e) => handleChange('middle_name', e.target.value)}
                  placeholder="Enter middle name"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium mb-2">
                  Last Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  placeholder="Enter last name"
                  disabled={isSubmitting}
                  className={errors.last_name ? 'border-destructive' : ''}
                />
                {errors.last_name && <p className="text-sm text-destructive mt-1">{errors.last_name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  disabled={isSubmitting}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium mb-2">
                  Date of Birth
                </label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleChange('date_of_birth', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        {mode === 'create' && (
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
              Settings
            </h3>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleChange('is_active', checked)}
                disabled={isSubmitting}
              />
              <label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                Active
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Saving...
            </>
          ) : (
            mode === 'create' ? 'Create User' : 'Update User'
          )}
        </Button>
      </div>
    </form>
  );
};
