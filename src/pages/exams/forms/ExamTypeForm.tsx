/**
 * Exam Type Form
 * Create/Edit exam types
 */

import { useState, useEffect } from 'react';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { ExamType, ExamTypeCreateInput } from '../../../types/examination.types';

interface ExamTypeFormProps {
  examType?: ExamType | null;
  onSubmit: (data: Partial<ExamType>) => void;
  onCancel: () => void;
}

export const ExamTypeForm = ({ examType, onSubmit, onCancel }: ExamTypeFormProps) => {
  const [formData, setFormData] = useState<Partial<ExamTypeCreateInput>>({
    name: '',
    code: '',
    description: '',
    weightage: 0,
    display_order: 1,
    college: 1, // Default college
    is_active: true,
  });

  useEffect(() => {
    if (examType) {
      setFormData(examType);
    }
  }, [examType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof ExamTypeCreateInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Mid-Term Examination"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Code *</Label>
          <Input
            id="code"
            value={formData.code || ''}
            onChange={(e) => handleChange('code', e.target.value)}
            placeholder="e.g., MID"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weightage">Weightage (%) *</Label>
          <Input
            id="weightage"
            type="number"
            value={formData.weightage || 0}
            onChange={(e) => handleChange('weightage', parseFloat(e.target.value))}
            placeholder="e.g., 30"
            required
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order || 1}
            onChange={(e) => handleChange('display_order', parseInt(e.target.value))}
            placeholder="e.g., 1"
            min="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter exam type description"
          rows={3}
        />
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
          {examType ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};
