/**
 * Exam Form
 * Create/Edit exams
 */

import { useState, useEffect } from 'react';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Exam, ExamCreateInput } from '../../../types/examination.types';
import { useExamTypes } from '../../../hooks/useExamination';
import { useClasses } from '../../../hooks/useAcademic';
import { Loader2 } from 'lucide-react';

interface ExamFormProps {
  exam?: Exam | null;
  onSubmit: (data: Partial<Exam>) => void;
  onCancel: () => void;
}

export const ExamForm = ({ exam, onSubmit, onCancel }: ExamFormProps) => {
  const { data: examTypesData, isLoading: examTypesLoading } = useExamTypes({ page_size: 100 });
  const { data: classesData, isLoading: classesLoading } = useClasses({ page_size: 100 });

  const examTypes = examTypesData?.results || [];
  const classes = classesData?.results || [];

  const [formData, setFormData] = useState<Partial<ExamCreateInput>>({
    name: '',
    code: '',
    exam_date_start: '',
    exam_date_end: '',
    registration_start: '',
    registration_end: '',
    is_published: false,
    is_active: true,
    exam_type: undefined,
    academic_session: 1, // Default session
    college: 1, // Default college
  });

  useEffect(() => {
    if (exam) {
      setFormData(exam);
    }
  }, [exam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof ExamCreateInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Exam Name *</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Mid-Term Exam 2025"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Exam Code *</Label>
          <Input
            id="code"
            value={formData.code || ''}
            onChange={(e) => handleChange('code', e.target.value)}
            placeholder="e.g., MTE2025"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="exam_type">Exam Type *</Label>
        {examTypesLoading ? (
          <div className="flex items-center justify-center h-10 border rounded-md bg-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <Select
            value={formData.exam_type?.toString()}
            onValueChange={(value) => handleChange('exam_type', parseInt(value))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select exam type" />
            </SelectTrigger>
            <SelectContent>
              {examTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="exam_date_start">Exam Start Date *</Label>
          <Input
            id="exam_date_start"
            type="date"
            value={formData.exam_date_start || ''}
            onChange={(e) => handleChange('exam_date_start', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="exam_date_end">Exam End Date *</Label>
          <Input
            id="exam_date_end"
            type="date"
            value={formData.exam_date_end || ''}
            onChange={(e) => handleChange('exam_date_end', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="registration_start">Registration Start *</Label>
          <Input
            id="registration_start"
            type="date"
            value={formData.registration_start || ''}
            onChange={(e) => handleChange('registration_start', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="registration_end">Registration End *</Label>
          <Input
            id="registration_end"
            type="date"
            value={formData.registration_end || ''}
            onChange={(e) => handleChange('registration_end', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_published"
          checked={formData.is_published || false}
          onCheckedChange={(checked) => handleChange('is_published', checked)}
        />
        <Label htmlFor="is_published">Published</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active || false}
          onCheckedChange={(checked) => handleChange('is_active', checked)}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {exam ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};
