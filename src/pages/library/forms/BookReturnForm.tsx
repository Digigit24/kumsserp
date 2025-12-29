/**
 * Book Return Form Component
 */

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { BookReturn, BookReturnCreateInput } from '../../../types/library.types';

interface BookReturnFormProps {
  bookReturn: BookReturn | null;
  onSubmit: (data: Partial<BookReturn>) => void;
  onCancel: () => void;
}

export const BookReturnForm = ({ bookReturn, onSubmit, onCancel }: BookReturnFormProps) => {
  const [formData, setFormData] = useState<Partial<BookReturnCreateInput>>({
    book_issue: 0,
    return_date: new Date().toISOString().split('T')[0],
    condition: 'good',
    fine_amount: '0',
    remarks: '',
    is_active: true,
  });

  useEffect(() => {
    if (bookReturn) {
      setFormData({
        book_issue: bookReturn.book_issue,
        return_date: bookReturn.return_date,
        condition: bookReturn.condition,
        fine_amount: bookReturn.fine_amount,
        remarks: bookReturn.remarks || '',
        is_active: bookReturn.is_active,
      });
    }
  }, [bookReturn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('kumss_user_id') || undefined;
    const submitData: any = { ...formData };

    if (!bookReturn && userId) {
      submitData.created_by = userId;
      submitData.updated_by = userId;
    } else if (bookReturn && userId) {
      submitData.updated_by = userId;
    }

    if (submitData.remarks === '') submitData.remarks = null;

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="book_issue">Book Issue ID *</Label>
        <Input
          id="book_issue"
          type="number"
          value={formData.book_issue}
          onChange={(e) => setFormData({ ...formData, book_issue: parseInt(e.target.value) })}
          placeholder="Book issue ID"
          required
          min="1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="return_date">Return Date *</Label>
        <Input
          id="return_date"
          type="date"
          value={formData.return_date}
          onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="condition">Book Condition *</Label>
        <Select
          value={formData.condition}
          onValueChange={(value: 'good' | 'fair' | 'damaged' | 'lost') => setFormData({ ...formData, condition: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="damaged">Damaged</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fine_amount">Fine Amount (₹)</Label>
        <Input
          id="fine_amount"
          value={formData.fine_amount}
          onChange={(e) => setFormData({ ...formData, fine_amount: e.target.value })}
          placeholder="0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          placeholder="Any additional remarks about the return"
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {bookReturn ? 'Update Return' : 'Record Return'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
