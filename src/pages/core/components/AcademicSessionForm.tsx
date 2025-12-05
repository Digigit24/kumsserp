/**
 * Academic Session Form Component
 */

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Checkbox } from '../../../components/ui/checkbox';
import { getCurrentUser } from '../../../services/auth.service';
import { academicYearApi } from '../../../services/core.service';
import { useQuery } from '@tanstack/react-query';

interface AcademicSessionFormProps {
  mode: 'create' | 'edit';
  academicSession?: any;
  onSuccess: () => void;
  onCancel: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const AcademicSessionForm = ({ mode, academicSession, onSuccess, onCancel, onSubmit }: AcademicSessionFormProps) => {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    college: 0,
    academic_year: 0,
    name: '',
    semester: 1,
    start_date: '',
    end_date: '',
    is_current: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch academic years for dropdown
  const { data: academicYears } = useQuery({
    queryKey: ['academic-years', 'all'],
    queryFn: () => academicYearApi.list({ page: 1, page_size: 100 }),
  });

  useEffect(() => {
    if (mode === 'edit' && academicSession) {
      setFormData({
        college: academicSession.college,
        academic_year: academicSession.academic_year,
        name: academicSession.name,
        semester: academicSession.semester,
        start_date: academicSession.start_date,
        end_date: academicSession.end_date,
        is_current: academicSession.is_current,
      });
    } else if (mode === 'create') {
      const user = getCurrentUser();
      const collegeId = user?.college || 0;
      setFormData(prev => ({ ...prev, college: collegeId }));
    }
  }, [mode, academicSession]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Session name is required';
    if (!formData.academic_year) newErrors.academic_year = 'Academic year is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    if (formData.semester < 1 || formData.semester > 8) newErrors.semester = 'Semester must be between 1 and 8';

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
      setError(err.message || 'Failed to save academic session');
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
          <label htmlFor="academic_year" className="block text-sm font-medium mb-2">
            Academic Year <span className="text-destructive">*</span>
          </label>
          <Select
            value={formData.academic_year ? String(formData.academic_year) : ''}
            onValueChange={(value) => handleChange('academic_year', parseInt(value))}
          >
            <SelectTrigger className={errors.academic_year ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              {academicYears?.results?.map((year: any) => (
                <SelectItem key={year.id} value={String(year.id)}>
                  {year.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.academic_year && <p className="text-sm text-destructive mt-1">{errors.academic_year}</p>}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Session Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Fall 2025, Spring 2026"
            disabled={isSubmitting}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="semester" className="block text-sm font-medium mb-2">
            Semester <span className="text-destructive">*</span>
          </label>
          <Select
            value={String(formData.semester)}
            onValueChange={(value) => handleChange('semester', parseInt(value))}
          >
            <SelectTrigger className={errors.semester ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <SelectItem key={sem} value={String(sem)}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.semester && <p className="text-sm text-destructive mt-1">{errors.semester}</p>}
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

        <div className="flex items-center gap-2">
          <Checkbox
            id="is_current"
            checked={formData.is_current}
            onCheckedChange={(checked) => handleChange('is_current', checked)}
            disabled={isSubmitting}
          />
          <label htmlFor="is_current" className="text-sm font-medium cursor-pointer">
            Set as Current Session
          </label>
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
            mode === 'create' ? 'Create Session' : 'Update Session'
          )}
        </Button>
      </div>
    </form>
  );
};
