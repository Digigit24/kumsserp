/**
 * Assignment Form Component
 * Reusable form for creating and editing assignments
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Loader2 } from 'lucide-react';
import type { Assignment, AssignmentCreateInput } from '@/types/assignments.types';
import { useSubjects } from '@/hooks/useAcademic';
import { useClasses, useSections } from '@/hooks/useAcademic';

interface AssignmentFormProps {
  assignment?: Assignment | null;
  onSubmit: (data: AssignmentCreateInput | FormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({
  assignment,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<AssignmentCreateInput>({
    title: '',
    description: '',
    subject: 0,
    class_obj: 0,
    section: null,
    due_date: '',
    max_marks: 100,
    attachments: null,
    is_active: true,
    status: 'active',
  });

  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  // Fetch dependencies
  const { data: subjectsData } = useSubjects({ page_size: 100, is_active: true });
  const { data: classesData } = useClasses({ page_size: 100, is_active: true });
  const { data: sectionsData } = useSections({
    page_size: 100,
    class_id: formData.class_obj || undefined,
    is_active: true
  });

  const subjects = subjectsData?.results || [];
  const classes = classesData?.results || [];
  const sections = sectionsData?.results || [];

  // Populate form if editing
  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subject,
        class_obj: assignment.class_obj,
        section: assignment.section || null,
        due_date: assignment.due_date.split('T')[0], // Format date for input
        max_marks: assignment.max_marks,
        is_active: assignment.is_active,
        status: assignment.status || 'active',
      });
    }
  }, [assignment]);

  const handleChange = (field: keyof AssignmentCreateInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();

    // If there's a file attachment, use FormData
    if (attachmentFile) {
      const formDataWithFile = new FormData();
      formDataWithFile.append('title', formData.title);
      formDataWithFile.append('description', formData.description);
      formDataWithFile.append('subject', String(formData.subject));
      formDataWithFile.append('class_obj', String(formData.class_obj));
      if (formData.section) {
        formDataWithFile.append('section', String(formData.section));
      }
      formDataWithFile.append('due_date', formData.due_date);
      formDataWithFile.append('max_marks', String(formData.max_marks));
      formDataWithFile.append('is_active', String(formData.is_active));
      formDataWithFile.append('status', isDraft ? 'draft' : 'active');
      formDataWithFile.append('attachments', attachmentFile);

      onSubmit(formDataWithFile);
    } else {
      // No file, use JSON
      onSubmit({
        ...formData,
        status: isDraft ? 'draft' : 'active',
      });
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter assignment title"
          required
        />
      </div>

      {/* Subject and Class */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Select
            value={String(formData.subject || '')}
            onValueChange={(value) => handleChange('subject', Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={String(subject.id)}>
                  {subject.name} ({subject.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="class_obj">Class *</Label>
          <Select
            value={String(formData.class_obj || '')}
            onValueChange={(value) => {
              handleChange('class_obj', Number(value));
              handleChange('section', null); // Reset section when class changes
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={String(cls.id)}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Section */}
      <div className="space-y-2">
        <Label htmlFor="section">Section (Optional)</Label>
        <Select
          value={String(formData.section || '')}
          onValueChange={(value) => handleChange('section', value ? Number(value) : null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select section (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No specific section</SelectItem>
            {sections.map((section) => (
              <SelectItem key={section.id} value={String(section.id)}>
                {section.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description & Instructions *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter assignment description and instructions for students"
          rows={6}
          required
        />
      </div>

      {/* Due Date and Max Marks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date *</Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date}
            onChange={(e) => handleChange('due_date', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_marks">Maximum Marks *</Label>
          <Input
            id="max_marks"
            type="number"
            value={formData.max_marks}
            onChange={(e) => handleChange('max_marks', Number(e.target.value))}
            placeholder="100"
            min="1"
            required
          />
        </div>
      </div>

      {/* Attachments */}
      <div className="space-y-2">
        <Label htmlFor="attachments">Attachments (Optional)</Label>
        <div className="border-2 border-dashed border-input rounded-lg p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <FileText className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              {attachmentFile
                ? `Selected: ${attachmentFile.name}`
                : 'Upload assignment files, documents, or resources'}
            </p>
            <Input
              id="attachments"
              type="file"
              onChange={handleFileChange}
              className="max-w-xs"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Accepted formats: PDF, DOC, DOCX, TXT, PNG, JPG (Max 10MB)
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={(e) => handleSubmit(e, true)}
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save as Draft'
          )}
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            assignment ? 'Update Assignment' : 'Create Assignment'
          )}
        </Button>
      </div>
    </form>
  );
};
