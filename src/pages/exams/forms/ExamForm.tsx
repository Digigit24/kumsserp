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
import { Exam, mockExamTypes } from '../../../data/examinationMockData';

interface ExamFormProps {
  exam?: Exam | null;
  onSubmit: (data: Partial<Exam>) => void;
  onCancel: () => void;
}

export const ExamForm = ({ exam, onSubmit, onCancel }: ExamFormProps) => {
  const [formData, setFormData] = useState<Partial<Exam>>({
    name: '',
    start_date: '',
    end_date: '',
    is_published: false,
    is_active: true,
    exam_type: undefined,
    class_obj: undefined,
    academic_session: undefined,
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

  const handleChange = (field: keyof Exam, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="exam_type">Exam Type *</Label>
        <Select
          value={formData.exam_type?.toString()}
          onValueChange={(value) => handleChange('exam_type', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select exam type" />
          </SelectTrigger>
          <SelectContent>
            {mockExamTypes.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="class_obj">Class *</Label>
          <Select
            value={formData.class_obj?.toString()}
            onValueChange={(value) => handleChange('class_obj', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Class 10</SelectItem>
              <SelectItem value="2">Class 11</SelectItem>
              <SelectItem value="3">Class 12</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="academic_session">Academic Session *</Label>
          <Select
            value={formData.academic_session?.toString()}
            onValueChange={(value) => handleChange('academic_session', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select session" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">2024-2025</SelectItem>
              <SelectItem value="2">2025-2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date *</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date || ''}
            onChange={(e) => handleChange('start_date', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date *</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date || ''}
            onChange={(e) => handleChange('end_date', e.target.value)}
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
