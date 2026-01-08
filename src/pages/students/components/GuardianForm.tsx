/**
 * Guardian Form Component
 * Used for creating and editing guardians (parents/guardians)
 */

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { guardianApi } from '../../../services/students.service';
import { userApi } from '../../../services/accounts.service';
import type { Guardian, GuardianCreateInput, GuardianUpdateInput } from '../../../types/students.types';
import type { UserListItem } from '../../../types/accounts.types';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

interface GuardianFormProps {
  mode: 'create' | 'edit';
  guardian?: Guardian;
  onSuccess: () => void;
  onCancel: () => void;
}

type GuardianFormData = Omit<GuardianCreateInput, 'user' | 'photo' | 'annual_income'> & {
  user: string;
  photo: string;
  annual_income: string;
};

export const GuardianForm = ({ mode, guardian, onSuccess, onCancel }: GuardianFormProps) => {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [formData, setFormData] = useState<GuardianFormData>({
    user: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    relation: '',
    phone: '',
    email: '',
    alternate_phone: '',
    occupation: '',
    annual_income: '',
    address: '',
    photo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await userApi.list({ page_size: 500, is_active: true });
      setUsers(data.results);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Initialize form data for edit mode
  useEffect(() => {
    if (mode === 'edit' && guardian) {
      setFormData({
        user: guardian.user ? String(guardian.user) : '',
        first_name: guardian.first_name,
        last_name: guardian.last_name,
        middle_name: guardian.middle_name || '',
        relation: guardian.relation,
        phone: guardian.phone,
        email: guardian.email || '',
        alternate_phone: guardian.alternate_phone || '',
        occupation: guardian.occupation || '',
        annual_income: guardian.annual_income || '',
        address: guardian.address || '',
        photo: guardian.photo || '',
      });
    }
  }, [mode, guardian]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.relation) {
      newErrors.relation = 'Relation is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // Validate phone format
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Validate email if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof GuardianFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Clean up empty strings to null
      const cleanedData: GuardianCreateInput = {
        ...formData,
        user: formData.user ? Number(formData.user) : null,
        middle_name: formData.middle_name || null,
        email: formData.email || null,
        alternate_phone: formData.alternate_phone || null,
        occupation: formData.occupation || null,
        annual_income: formData.annual_income || null,
        address: formData.address || null,
        photo: formData.photo || null,
      };

      if (mode === 'create') {
        await guardianApi.create(cleanedData);
      } else if (guardian) {
        await guardianApi.update(guardian.id, cleanedData as GuardianUpdateInput);
      }

      onSuccess();
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || 'Failed to save guardian');

      // Handle field-specific errors from backend
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

  const relationOptions = [
    { value: 'father', label: 'Father' },
    { value: 'mother', label: 'Mother' },
    { value: 'guardian', label: 'Guardian' },
    { value: 'uncle', label: 'Uncle' },
    { value: 'aunt', label: 'Aunt' },
    { value: 'grandfather', label: 'Grandfather' },
    { value: 'grandmother', label: 'Grandmother' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Basic Information
          </h3>

          {/* User Selection */}
          <div>
            <label htmlFor="user" className="block text-sm font-medium mb-2">
              Link to User Account <span className="text-muted-foreground text-xs">(Optional)</span>
            </label>
            <Select
              value={formData.user || undefined}
              onValueChange={(v) => handleChange('user', v || '')}
              disabled={isSubmitting || loadingUsers}
            >
              <SelectTrigger id="user">
                <SelectValue placeholder={loadingUsers ? "Loading users..." : "Select user (optional)"} />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.full_name || user.username} {user.email && `(${user.email})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Link this guardian to an existing user account for portal access
            </p>
          </div>

          {/* Photo URL */}
          <div>
            <label htmlFor="photo" className="block text-sm font-medium mb-2">
              Photo URL
            </label>
            <Input
              id="photo"
              type="text"
              value={formData.photo || ''}
              onChange={(e) => handleChange('photo', e.target.value)}
              placeholder="Enter photo URL"
              disabled={isSubmitting}
            />
          </div>

          {/* First Name */}
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium mb-2">
              First Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="first_name"
              type="text"
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              placeholder="Enter first name"
              disabled={isSubmitting}
              className={errors.first_name ? 'border-destructive' : ''}
            />
            {errors.first_name && (
              <p className="text-sm text-destructive mt-1">{errors.first_name}</p>
            )}
          </div>

          {/* Middle Name */}
          <div>
            <label htmlFor="middle_name" className="block text-sm font-medium mb-2">
              Middle Name
            </label>
            <Input
              id="middle_name"
              type="text"
              value={formData.middle_name || ''}
              onChange={(e) => handleChange('middle_name', e.target.value)}
              placeholder="Enter middle name"
              disabled={isSubmitting}
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium mb-2">
              Last Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="last_name"
              type="text"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              placeholder="Enter last name"
              disabled={isSubmitting}
              className={errors.last_name ? 'border-destructive' : ''}
            />
            {errors.last_name && (
              <p className="text-sm text-destructive mt-1">{errors.last_name}</p>
            )}
          </div>

          {/* Relation */}
          <div>
            <label htmlFor="relation" className="block text-sm font-medium mb-2">
              Relation <span className="text-destructive">*</span>
            </label>
            <Select value={formData.relation} onValueChange={(value) => handleChange('relation', value)}>
              <SelectTrigger className={errors.relation ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select relation" />
              </SelectTrigger>
              <SelectContent>
                {relationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.relation && (
              <p className="text-sm text-destructive mt-1">{errors.relation}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Contact Information
          </h3>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number <span className="text-destructive">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Enter 10-digit phone number"
              disabled={isSubmitting}
              className={errors.phone ? 'border-destructive' : ''}
              maxLength={10}
            />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Alternate Phone */}
          <div>
            <label htmlFor="alternate_phone" className="block text-sm font-medium mb-2">
              Alternate Phone
            </label>
            <Input
              id="alternate_phone"
              type="tel"
              value={formData.alternate_phone || ''}
              onChange={(e) => handleChange('alternate_phone', e.target.value)}
              placeholder="Enter alternate phone number"
              disabled={isSubmitting}
              maxLength={10}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email address"
              disabled={isSubmitting}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Professional Information
          </h3>

          {/* Occupation */}
          <div>
            <label htmlFor="occupation" className="block text-sm font-medium mb-2">
              Occupation
            </label>
            <Input
              id="occupation"
              type="text"
              value={formData.occupation || ''}
              onChange={(e) => handleChange('occupation', e.target.value)}
              placeholder="Enter occupation"
              disabled={isSubmitting}
            />
          </div>

          {/* Annual Income */}
          <div>
            <label htmlFor="annual_income" className="block text-sm font-medium mb-2">
              Annual Income
            </label>
            <Input
              id="annual_income"
              type="number"
              value={formData.annual_income || ''}
              onChange={(e) => handleChange('annual_income', e.target.value)}
              placeholder="Enter annual income"
              disabled={isSubmitting}
              step="0.01"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-2">
            Address
          </label>
          <Textarea
            id="address"
            value={formData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Enter complete address"
            disabled={isSubmitting}
            rows={3}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[100px]"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Saving...
            </>
          ) : (
            mode === 'create' ? 'Create Guardian' : 'Update Guardian'
          )}
        </Button>
      </div>
    </form>
  );
};
