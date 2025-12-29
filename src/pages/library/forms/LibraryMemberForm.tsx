/**
 * Library Member Form Component
 * Create/Edit form for library members
 */

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { LibraryMember, LibraryMemberCreateInput } from '../../../types/library.types';

interface LibraryMemberFormProps {
  member: LibraryMember | null;
  onSubmit: (data: Partial<LibraryMember>) => void;
  onCancel: () => void;
}

export const LibraryMemberForm = ({ member, onSubmit, onCancel }: LibraryMemberFormProps) => {
  const [formData, setFormData] = useState<Partial<LibraryMemberCreateInput>>({
    member_id: '',
    user: '',
    member_type: 'student',
    max_books_allowed: 3,
    max_days_allowed: 14,
    joined_date: new Date().toISOString().split('T')[0],
    expiry_date: null,
    college: 1,
    is_active: true,
  });

  useEffect(() => {
    if (member) {
      setFormData({
        member_id: member.member_id,
        user: member.user,
        member_type: member.member_type,
        max_books_allowed: member.max_books_allowed,
        max_days_allowed: member.max_days_allowed,
        joined_date: member.joined_date,
        expiry_date: member.expiry_date,
        college: member.college,
        is_active: member.is_active,
      });
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem('kumss_user_id') || undefined;
    const submitData: any = { ...formData };

    if (!member && userId) {
      submitData.created_by = userId;
      submitData.updated_by = userId;
    } else if (member && userId) {
      submitData.updated_by = userId;
    }

    if (submitData.expiry_date === '') submitData.expiry_date = null;

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="member_id">Member ID *</Label>
        <Input
          id="member_id"
          value={formData.member_id}
          onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
          placeholder="LM-001"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="user">User ID *</Label>
        <Input
          id="user"
          value={formData.user}
          onChange={(e) => setFormData({ ...formData, user: e.target.value })}
          placeholder="User UUID"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="member_type">Member Type *</Label>
        <Select
          value={formData.member_type}
          onValueChange={(value: 'student' | 'teacher' | 'staff') => setFormData({ ...formData, member_type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select member type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="max_books_allowed">Max Books Allowed *</Label>
          <Input
            id="max_books_allowed"
            type="number"
            value={formData.max_books_allowed}
            onChange={(e) => setFormData({ ...formData, max_books_allowed: parseInt(e.target.value) })}
            required
            min="1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_days_allowed">Max Days Allowed *</Label>
          <Input
            id="max_days_allowed"
            type="number"
            value={formData.max_days_allowed}
            onChange={(e) => setFormData({ ...formData, max_days_allowed: parseInt(e.target.value) })}
            required
            min="1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="joined_date">Joined Date *</Label>
          <Input
            id="joined_date"
            type="date"
            value={formData.joined_date}
            onChange={(e) => setFormData({ ...formData, joined_date: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiry_date">Expiry Date</Label>
          <Input
            id="expiry_date"
            type="date"
            value={formData.expiry_date || ''}
            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value || null })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="is_active">Active</Label>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {member ? 'Update Member' : 'Add Member'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
