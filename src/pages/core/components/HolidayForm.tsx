/**
 * Holiday Form Component
 * Super Admin + Normal Admin compatible
 * College selection is MANDATORY
 */

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { collegeApi } from '../../../services/core.service';

interface HolidayFormProps {
  mode: 'create' | 'edit';
  holiday?: any;
  onSuccess: () => void;
  onCancel: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const HolidayForm = ({
  mode,
  holiday,
  onSuccess,
  onCancel,
  onSubmit,
}: HolidayFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---------------- FORM STATE ---------------- */
  const [formData, setFormData] = useState({
    college: null as number | null,
    name: '',
    date: '',
    holiday_type: '',
    description: '',
    is_active: true,
  });

  /* ---------------- FETCH COLLEGES ---------------- */
  const { data: collegesData } = useQuery({
    queryKey: ['colleges'],
    queryFn: () => collegeApi.list({ page_size: 1000 }),
  });

  const colleges = collegesData?.results ?? [];

  /* ---------------- EDIT MODE ---------------- */
  useEffect(() => {
    if (mode === 'edit' && holiday) {
      setFormData({
        college: holiday.college,
        name: holiday.name,
        date: holiday.date,
        holiday_type: holiday.holiday_type,
        description: holiday.description || '',
        is_active: holiday.is_active ?? true,
      });
    }
  }, [mode, holiday]);

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.college) newErrors.college = 'College is required';
    if (!formData.name.trim()) newErrors.name = 'Holiday name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.holiday_type) newErrors.holiday_type = 'Holiday type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        college: formData.college, // ✅ REQUIRED BY BACKEND
        name: formData.name,
        date: formData.date,
        holiday_type: formData.holiday_type,
        description: formData.description || null,
        is_active: formData.is_active,
      });

      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Failed to save holiday');
    } finally {
      setIsSubmitting(false);
    }
  };

  const holidayTypes = [
    { value: 'national', label: 'National Holiday' },
    { value: 'festival', label: 'Festival' },
    { value: 'college', label: 'College Holiday' },
    { value: 'exam', label: 'Exam Holiday' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* -------- College -------- */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Select College <span className="text-destructive">*</span>
        </label>

        <Select
          value={formData.college ? String(formData.college) : ''}
          onValueChange={(value) =>
            setFormData({ ...formData, college: Number(value) })
          }
        >
          <SelectTrigger
            className={`bg-background text-foreground border ${errors.college ? 'border-destructive' : ''
              }`}
          >
            <SelectValue placeholder="Select college" />
          </SelectTrigger>

          <SelectContent className="bg-background text-foreground">
            {colleges.map((college: any) => (
              <SelectItem key={college.id} value={String(college.id)}>
                {college.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.college && (
          <p className="text-sm text-destructive mt-1">{errors.college}</p>
        )}
      </div>


      {/* -------- Holiday Name -------- */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Holiday Name <span className="text-destructive">*</span>
        </label>
        <Input
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="e.g., Diwali, Independence Day"
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name}</p>
        )}
      </div>

      {/* -------- Date -------- */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Date <span className="text-destructive">*</span>
        </label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
        />
        {errors.date && (
          <p className="text-sm text-destructive mt-1">{errors.date}</p>
        )}
      </div>

      {/* -------- Holiday Type -------- */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Holiday Type <span className="text-destructive">*</span>
        </label>
        <Select
          value={formData.holiday_type}
          onValueChange={(value) =>
            setFormData({ ...formData, holiday_type: value })
          }
        >
          <SelectTrigger className={errors.holiday_type ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select holiday type" />
          </SelectTrigger>
          <SelectContent>
            {holidayTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.holiday_type && (
          <p className="text-sm text-destructive mt-1">{errors.holiday_type}</p>
        )}
      </div>

      {/* -------- Description -------- */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Description
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          placeholder="Optional description"
        />
      </div>

      {/* -------- Actions -------- */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
              ? 'Create Holiday'
              : 'Update Holiday'}
        </Button>
      </div>
    </form>
  );
};
