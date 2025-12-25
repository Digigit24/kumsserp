import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { academicYearApi, collegeApi } from '../../../services/core.service';

interface AcademicSessionFormProps {
  mode: 'create' | 'edit';
  academicSession?: any;
  onSuccess: () => void;
  onCancel: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const AcademicSessionForm = ({
  mode,
  academicSession,
  onSuccess,
  onCancel,
  onSubmit,
}: AcademicSessionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    college: null as number | null,
    academic_year: null as number | null,
    name: '',
    semester: 1,
    start_date: '',
    end_date: '',
    is_current: false,
  });
  const selectedCollegeId = formData.college;

  /* ---------------- FETCH COLLEGES ---------------- */
  const { data: collegesData } = useQuery({
    queryKey: ['colleges'],
    queryFn: () => collegeApi.list({ page_size: 1000 }),
  });

  const colleges = collegesData?.results ?? [];

  /* ---------------- FETCH ACADEMIC YEARS ---------------- */
  const { data: academicYears } = useQuery({
    queryKey: ['academic-years', formData.college],
    queryFn: () =>
      academicYearApi.list({
        page: 1,
        page_size: 100,
        college: formData.college!,
      }),
    enabled: !!formData.college,
  });

  /* ---------------- EDIT MODE ---------------- */
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
    }
  }, [mode, academicSession]);

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.college) newErrors.college = 'College is required';
    if (!formData.academic_year) newErrors.academic_year = 'Academic year is required';
    if (!formData.name.trim()) newErrors.name = 'Session name is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';

    if (
      formData.start_date &&
      formData.end_date &&
      formData.end_date <= formData.start_date
    ) {
      newErrors.end_date = 'End date must be after start date';
    }

    if (formData.semester < 1 || formData.semester > 8) {
      newErrors.semester = 'Semester must be between 1 and 8';
    }

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
        college: formData.college,              // ✅ SINGLE COLLEGE
        academic_year: formData.academic_year,
        name: formData.name,
        semester: formData.semester,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_current: formData.is_current,
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Failed to save academic session');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* College */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Select College <span className="text-destructive">*</span>
        </label>

        <select
          className="w-full border rounded-md px-3 py-2"
          value={formData.college ?? ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              college: Number(e.target.value),
              academic_year: null, // 🔥 YAHI RESET IMPORTANT HAI
            })
          }
        >
          <option value="">-- Select College --</option>
          {colleges.map((college: any) => (
            <option key={college.id} value={college.id}>
              {college.name}
            </option>
          ))}
        </select>

        {errors.college && (
          <p className="text-sm text-destructive mt-1">{errors.college}</p>
        )}
      </div>

      {/* Academic Year */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Academic Year <span className="text-destructive">*</span>
        </label>
        <Select
          value={formData.academic_year ? String(formData.academic_year) : ''}
          onValueChange={(value) =>
            setFormData({ ...formData, academic_year: Number(value) })
          }
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
        {errors.academic_year && (
          <p className="text-sm text-destructive mt-1">{errors.academic_year}</p>
        )}
      </div>

      {/* Session Name */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Session Name <span className="text-destructive">*</span>
        </label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Semester 1"
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name}</p>
        )}
      </div>

      {/* Semester */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Semester <span className="text-destructive">*</span>
        </label>
        <Select
          value={String(formData.semester)}
          onValueChange={(value) =>
            setFormData({ ...formData, semester: Number(value) })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <SelectItem key={s} value={String(s)}>
                Semester {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          value={formData.start_date}
          onChange={(e) =>
            setFormData({ ...formData, start_date: e.target.value })
          }
        />
        <Input
          type="date"
          value={formData.end_date}
          onChange={(e) =>
            setFormData({ ...formData, end_date: e.target.value })
          }
        />
      </div>

      {/* Current */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={formData.is_current}
          onCheckedChange={(v) =>
            setFormData({ ...formData, is_current: Boolean(v) })
          }
        />
        <span className="text-sm">Set as Current Session</span>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create Session' : 'Update Session'}
        </Button>
      </div>
    </form>
  );
};
