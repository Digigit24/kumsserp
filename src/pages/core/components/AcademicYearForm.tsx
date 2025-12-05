/**
 * Academic Year Form Component
 */

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Checkbox } from '../../../components/ui/checkbox';
import { getCurrentUser } from '../../../services/auth.service';

interface AcademicYearFormProps {
  mode: 'create' | 'edit';
  academicYear?: any;
  onSuccess: () => void;
  onCancel: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const AcademicYearForm = ({ mode, academicYear, onSuccess, onCancel, onSubmit }: AcademicYearFormProps) => {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    college: 0,
    year: '',
    start_date: '',
    end_date: '',
    is_current: false,
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && academicYear) {
      setFormData({
        college: academicYear.college,
        year: academicYear.year,
        start_date: academicYear.start_date,
        end_date: academicYear.end_date,
        is_current: academicYear.is_current,
        is_active: academicYear.is_active,
      });
    } else if (mode === 'create') {
      const user = getCurrentUser();
      const collegeId = user?.college || 0;
      setFormData(prev => ({ ...prev, college: collegeId }));
    }
  }, [mode, academicYear]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.year.trim()) newErrors.year = 'Year is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';

    if (formData.start_date && formData.end_date && formData.end_date <= formData.start_date) {
      newErrors.end_date = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
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
      await onSubmit(formData);
      onSuccess();
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || 'Failed to save academic year');
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

      <div className="space-y-4">
        <div>
          <label htmlFor="year" className="block text-sm font-medium mb-2">
            Academic Year <span className="text-destructive">*</span>
          </label>
          <Input
            id="year"
            value={formData.year}
            onChange={(e) => handleChange('year', e.target.value)}
            placeholder="e.g., 2025-2026"
            disabled={isSubmitting}
            className={errors.year ? 'border-destructive' : ''}
          />
          {errors.year && <p className="text-sm text-destructive mt-1">{errors.year}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium mb-2">
              Start Date <span className="text-destructive">*</span>
            </label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => handleChange('start_date', e.target.value)}
              disabled={isSubmitting}
              className={errors.start_date ? 'border-destructive' : ''}
            />
            {errors.start_date && <p className="text-sm text-destructive mt-1">{errors.start_date}</p>}
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium mb-2">
              End Date <span className="text-destructive">*</span>
            </label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => handleChange('end_date', e.target.value)}
              disabled={isSubmitting}
              className={errors.end_date ? 'border-destructive' : ''}
            />
            {errors.end_date && <p className="text-sm text-destructive mt-1">{errors.end_date}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="is_current"
              checked={formData.is_current}
              onCheckedChange={(checked) => handleChange('is_current', checked)}
              disabled={isSubmitting}
            />
            <label htmlFor="is_current" className="text-sm font-medium cursor-pointer">
              Set as Current Academic Year
            </label>
          </div>

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
      </div>

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
            mode === 'create' ? 'Create Academic Year' : 'Update Academic Year'
          )}
        </Button>
      </div>
    </form>
  );
};
