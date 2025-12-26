/**
 * Student Marks Form
 * Create/Edit student marks entry
 */

import { useState, useEffect } from 'react';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { StudentMarks, mockMarksRegisters } from '../../../data/examinationMockData';

interface StudentMarksFormProps {
  marks?: StudentMarks | null;
  onSubmit: (data: Partial<StudentMarks>) => void;
  onCancel: () => void;
}

export const StudentMarksForm = ({ marks, onSubmit, onCancel }: StudentMarksFormProps) => {
  const [formData, setFormData] = useState<Partial<StudentMarks>>({
    theory_marks: null,
    practical_marks: null,
    internal_marks: null,
    total_marks: 0,
    grade: '',
    is_absent: false,
    is_active: true,
    register: undefined,
    student: undefined,
  });

  useEffect(() => {
    if (marks) {
      setFormData(marks);
    }
  }, [marks]);

  // Calculate total marks when component marks change
  useEffect(() => {
    const theory = formData.theory_marks || 0;
    const practical = formData.practical_marks || 0;
    const internal = formData.internal_marks || 0;
    const total = theory + practical + internal;
    setFormData(prev => ({ ...prev, total_marks: total }));
  }, [formData.theory_marks, formData.practical_marks, formData.internal_marks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof StudentMarks, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register">Marks Register *</Label>
        <Select
          value={formData.register?.toString()}
          onValueChange={(value) => handleChange('register', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select marks register" />
          </SelectTrigger>
          <SelectContent>
            {mockMarksRegisters.map((reg) => (
              <SelectItem key={reg.id} value={reg.id.toString()}>
                Register #{reg.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="student">Student *</Label>
        <Select
          value={formData.student?.toString()}
          onValueChange={(value) => handleChange('student', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select student" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">John Doe (Roll: 001)</SelectItem>
            <SelectItem value="2">Jane Smith (Roll: 002)</SelectItem>
            <SelectItem value="3">Bob Johnson (Roll: 003)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="theory_marks">Theory Marks</Label>
          <Input
            id="theory_marks"
            type="number"
            value={formData.theory_marks || ''}
            onChange={(e) => handleChange('theory_marks', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="0"
            min="0"
            step="0.01"
            disabled={formData.is_absent}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="practical_marks">Practical Marks</Label>
          <Input
            id="practical_marks"
            type="number"
            value={formData.practical_marks || ''}
            onChange={(e) => handleChange('practical_marks', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="0"
            min="0"
            step="0.01"
            disabled={formData.is_absent}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="internal_marks">Internal Marks</Label>
          <Input
            id="internal_marks"
            type="number"
            value={formData.internal_marks || ''}
            onChange={(e) => handleChange('internal_marks', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="0"
            min="0"
            step="0.01"
            disabled={formData.is_absent}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="total_marks">Total Marks</Label>
        <Input
          id="total_marks"
          type="number"
          value={formData.total_marks || 0}
          readOnly
          className="bg-muted"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="grade">Grade</Label>
        <Select
          value={formData.grade || ''}
          onValueChange={(value) => handleChange('grade', value)}
          disabled={formData.is_absent}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A+">A+ (90-100)</SelectItem>
            <SelectItem value="A">A (80-89)</SelectItem>
            <SelectItem value="B+">B+ (70-79)</SelectItem>
            <SelectItem value="B">B (60-69)</SelectItem>
            <SelectItem value="C">C (50-59)</SelectItem>
            <SelectItem value="D">D (40-49)</SelectItem>
            <SelectItem value="F">F (Below 40)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_absent"
          checked={formData.is_absent || false}
          onCheckedChange={(checked) => {
            handleChange('is_absent', checked);
            if (checked) {
              setFormData(prev => ({
                ...prev,
                theory_marks: null,
                practical_marks: null,
                internal_marks: null,
                total_marks: 0,
                grade: null,
              }));
            }
          }}
        />
        <Label htmlFor="is_absent">Mark as Absent</Label>
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
          {marks ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};
