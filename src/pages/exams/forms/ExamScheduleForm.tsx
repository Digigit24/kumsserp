/**
 * Exam Schedule Form
 * Create/Edit exam schedules
 */

import { useState, useEffect } from 'react';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ExamSchedule, mockExams } from '../../../data/examinationMockData';

interface ExamScheduleFormProps {
  schedule?: ExamSchedule | null;
  onSubmit: (data: Partial<ExamSchedule>) => void;
  onCancel: () => void;
}

export const ExamScheduleForm = ({ schedule, onSubmit, onCancel }: ExamScheduleFormProps) => {
  const [formData, setFormData] = useState<Partial<ExamSchedule>>({
    date: '',
    start_time: '',
    end_time: '',
    max_marks: 100,
    is_active: true,
    exam: undefined,
    subject: undefined,
    classroom: undefined,
    invigilator: undefined,
  });

  useEffect(() => {
    if (schedule) {
      setFormData(schedule);
    }
  }, [schedule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof ExamSchedule, value: any) => {
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
        <Label htmlFor="date">Exam Date *</Label>
        <Input
          id="date"
          type="date"
          value={formData.date || ''}
          onChange={(e) => handleChange('date', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time *</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time || ''}
            onChange={(e) => handleChange('start_time', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">End Time *</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time || ''}
            onChange={(e) => handleChange('end_time', e.target.value)}
            required
          />
        </div>
      </div>

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
        <Label htmlFor="classroom">Classroom</Label>
        <Select
          value={formData.classroom?.toString()}
          onValueChange={(value) => handleChange('classroom', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select classroom" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Room 101</SelectItem>
            <SelectItem value="2">Room 102</SelectItem>
            <SelectItem value="3">Lab A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="invigilator">Invigilator</Label>
        <Select
          value={formData.invigilator?.toString()}
          onValueChange={(value) => handleChange('invigilator', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select invigilator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Dr. John Smith</SelectItem>
            <SelectItem value="2">Prof. Jane Doe</SelectItem>
            <SelectItem value="3">Mr. Robert Johnson</SelectItem>
          </SelectContent>
        </Select>
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
          {schedule ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};
