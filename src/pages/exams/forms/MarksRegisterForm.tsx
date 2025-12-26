/**
 * Marks Register Form
 * Create/Edit marks registers
 */

import { useState, useEffect } from 'react';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { MarksRegister, mockExams } from '../../../data/examinationMockData';

interface MarksRegisterFormProps {
  register?: MarksRegister | null;
  onSubmit: (data: Partial<MarksRegister>) => void;
  onCancel: () => void;
}

export const MarksRegisterForm = ({ register, onSubmit, onCancel }: MarksRegisterFormProps) => {
  const [formData, setFormData] = useState<Partial<MarksRegister>>({
    max_marks: 100,
    pass_marks: 40,
    is_active: true,
    exam: undefined,
    subject: undefined,
    section: undefined,
  });

  useEffect(() => {
    if (register) {
      setFormData(register);
    }
  }, [register]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof MarksRegister, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="exam">Exam *</Label>
        <Select
          value={formData.exam?.toString()}
          onValueChange={(value) => handleChange('exam', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select exam" />
          </SelectTrigger>
          <SelectContent>
            {mockExams.map((exam) => (
              <SelectItem key={exam.id} value={exam.id.toString()}>
                {exam.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Select
          value={formData.subject?.toString()}
          onValueChange={(value) => handleChange('subject', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Mathematics</SelectItem>
            <SelectItem value="2">Physics</SelectItem>
            <SelectItem value="3">Chemistry</SelectItem>
            <SelectItem value="4">Biology</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="section">Section</Label>
        <Select
          value={formData.section?.toString() || ''}
          onValueChange={(value) => handleChange('section', value ? parseInt(value) : null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select section (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Section A</SelectItem>
            <SelectItem value="2">Section B</SelectItem>
            <SelectItem value="3">Section C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="max_marks">Maximum Marks *</Label>
          <Input
            id="max_marks"
            type="number"
            value={formData.max_marks || ''}
            onChange={(e) => handleChange('max_marks', parseInt(e.target.value))}
            required
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pass_marks">Passing Marks *</Label>
          <Input
            id="pass_marks"
            type="number"
            value={formData.pass_marks || ''}
            onChange={(e) => handleChange('pass_marks', parseInt(e.target.value))}
            required
            min="1"
          />
        </div>
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
          {register ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};
