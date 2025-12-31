/**
 * Fee Type Form Component
 * Create/Edit form for fee types
 */

import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { SearchableSelect, SearchableSelectOption } from '../../../components/ui/searchable-select';
import { FeeType, FeeTypeCreateInput } from '../../../types/fees.types';
import { useFeeGroups } from '../../../hooks/useFees';

interface FeeTypeFormProps {
  feeType: FeeType | null;
  onSubmit: (data: Partial<FeeTypeCreateInput>) => void;
  onCancel: () => void;
}

export const FeeTypeForm = ({ feeType, onSubmit, onCancel }: FeeTypeFormProps) => {
  const [formData, setFormData] = useState<Partial<FeeTypeCreateInput>>({
    name: '',
    code: '',
    description: '',
    college: 0,
    fee_group: 0,
    is_active: true,
  });

  // Fetch fee groups for dropdown
  const { data: feeGroupsData } = useFeeGroups({ page_size: 1000 });

  // Create options for fee groups dropdown
  const feeGroupOptions: SearchableSelectOption[] = useMemo(() => {
    if (!feeGroupsData?.results) return [];
    return feeGroupsData.results.map((group) => ({
      value: group.id,
      label: group.name,
      subtitle: group.description || '',
    }));
  }, [feeGroupsData]);

  useEffect(() => {
    if (feeType) {
      setFormData({
        name: feeType.name,
        code: feeType.code,
        description: feeType.description || '',
        college: feeType.college,
        fee_group: feeType.fee_group,
        is_active: feeType.is_active,
      });
    } else {
      // Auto-populate college from user data
      const storedUser = localStorage.getItem('kumss_user');
      let collegeId = 1;

      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user?.college) {
          collegeId = user.college;
        } else if (user?.user_roles && user.user_roles.length > 0) {
          const primaryRole = user.user_roles.find((r: any) => r.is_primary) || user.user_roles[0];
          collegeId = primaryRole.college_id || 1;
        }
      }

      setFormData(prev => ({ ...prev, college: collegeId }));
    }
  }, [feeType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('kumss_user_id') || undefined;
    const submitData: any = { ...formData };

    if (!feeType && userId) {
      submitData.created_by = userId;
      submitData.updated_by = userId;
    } else if (feeType && userId) {
      submitData.updated_by = userId;
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter fee type name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fee_group">Fee Group *</Label>
        <SearchableSelect
          options={feeGroupOptions}
          value={formData.fee_group}
          onChange={(value) => setFormData({ ...formData, fee_group: Number(value) })}
          placeholder="Select fee group"
          searchPlaceholder="Search fee groups..."
          emptyText="No fee groups available"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Code *</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          placeholder="Enter fee type code"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter description (optional)"
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {feeType ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
