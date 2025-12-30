/**
 * Book Return Form Component
 */

import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { SearchableSelect, SearchableSelectOption } from '../../../components/ui/searchable-select';
import { useBookIssues, useBooks, useLibraryMembers } from '../../../hooks/useLibrary';
import { useUsers } from '../../../hooks/useAccounts';
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

  // Fetch all book issues
  const { data: issuesData } = useBookIssues({ page_size: 1000 });
  const { data: booksData } = useBooks({ page_size: 1000 });
  const { data: membersData } = useLibraryMembers({ page_size: 1000 });
  const { data: usersData } = useUsers({ page_size: 1000 });

  // Create enriched book issues options
  const bookIssueOptions: SearchableSelectOption[] = useMemo(() => {
    if (!issuesData?.results) {
      return [];
    }

    // Create lookup maps for available data
    const booksMap = booksData?.results ? new Map(booksData.results.map(b => [b.id, b])) : new Map();
    const membersMap = membersData?.results ? new Map(membersData.results.map(m => [m.id, m])) : new Map();
    const usersMap = usersData?.results ? new Map(usersData.results.map(u => [u.id, u])) : new Map();

    return issuesData.results.map((issue) => {
      const bookId = typeof issue.book === 'number' ? issue.book : issue.book.id;
      const memberId = typeof issue.member === 'number' ? issue.member : issue.member.id;

      const book = booksMap.get(bookId);
      const member = membersMap.get(memberId);

      // Get member name
      let memberName = `Member #${memberId}`;
      if (member && usersMap.size > 0) {
        const userId = typeof member.user === 'number' ? member.user : member.user?.id;
        const user = usersMap.get(userId);
        memberName = user?.full_name || user?.username || member.member_id || memberName;
      } else if (member) {
        memberName = member.member_id || memberName;
      }

      const bookTitle = book?.title || `Book #${bookId}`;
      const issueDate = new Date(issue.issue_date).toLocaleDateString();

      return {
        value: issue.id,
        label: `${bookTitle} - ${memberName}`,
        subtitle: `Issued: ${issueDate} • Due: ${new Date(issue.due_date).toLocaleDateString()}`,
      };
    });
  }, [issuesData, booksData, membersData, usersData]);

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
        <Label htmlFor="book_issue">Book Issue *</Label>
        <SearchableSelect
          options={bookIssueOptions}
          value={formData.book_issue}
          onChange={(value) => setFormData({ ...formData, book_issue: Number(value) })}
          placeholder="Select book issue to return"
          searchPlaceholder="Search by book title or member name..."
          emptyText="No issued books available for return"
          disabled={!!bookReturn}
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
