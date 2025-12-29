/**
 * Book Issue Form Component
 */

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { BookIssue, BookIssueCreateInput } from '../../../types/library.types';

interface BookIssueFormProps {
  issue: BookIssue | null;
  onSubmit: (data: Partial<BookIssue>) => void;
  onCancel: () => void;
}

export const BookIssueForm = ({ issue, onSubmit, onCancel }: BookIssueFormProps) => {
  const [formData, setFormData] = useState<Partial<BookIssueCreateInput>>({
    book: 0,
    member: 0,
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'issued',
    remarks: '',
    is_active: true,
  });

  useEffect(() => {
    if (issue) {
      setFormData({
        book: issue.book,
        member: issue.member,
        issue_date: issue.issue_date,
        due_date: issue.due_date,
        return_date: issue.return_date || undefined,
        status: issue.status,
        remarks: issue.remarks || '',
        is_active: issue.is_active,
      });
    }
  }, [issue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('kumss_user_id') || undefined;
    const submitData: any = { ...formData };

    if (!issue && userId) {
      submitData.created_by = userId;
      submitData.updated_by = userId;
      submitData.issued_by = userId;
    } else if (issue && userId) {
      submitData.updated_by = userId;
    }

    if (submitData.remarks === '') submitData.remarks = null;
    if (submitData.return_date === '') submitData.return_date = null;

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="book">Book ID *</Label>
        <Input
          id="book"
          type="number"
          value={formData.book}
          onChange={(e) => setFormData({ ...formData, book: parseInt(e.target.value) })}
          placeholder="Book ID"
          required
          min="1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="member">Member ID *</Label>
        <Input
          id="member"
          type="number"
          value={formData.member}
          onChange={(e) => setFormData({ ...formData, member: parseInt(e.target.value) })}
          placeholder="Member ID"
          required
          min="1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="issue_date">Issue Date *</Label>
          <Input
            id="issue_date"
            type="date"
            value={formData.issue_date}
            onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date *</Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="return_date">Return Date</Label>
        <Input
          id="return_date"
          type="date"
          value={formData.return_date || ''}
          onChange={(e) => setFormData({ ...formData, return_date: e.target.value || undefined })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={formData.status}
          onValueChange={(value: 'issued' | 'returned' | 'overdue' | 'lost') => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="issued">Issued</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          placeholder="Any additional remarks"
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {issue ? 'Update Issue' : 'Issue Book'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
