/**
 * Fee Master Form Component
 * Create/Edit form for fee masters
 */

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { FeeMaster, FeeMasterCreateInput } from '../../../types/fees.types';

interface FeeMasterFormProps {
  feeMaster: FeeMaster | null;
  onSubmit: (data: Partial<FeeMasterCreateInput>) => void;
  onCancel: () => void;
}

export const FeeMasterForm = ({ feeMaster, onSubmit, onCancel }: FeeMasterFormProps) => {
  const [formData, setFormData] = useState<Partial<FeeMasterCreateInput>>({
    semester: 1,
    amount: '0',
    college: 0,
    program: 0,
    academic_year: 0,
    fee_type: 0,
    is_active: true,
  });

  useEffect(() => {
    if (feeMaster) {
      setFormData({
        semester: feeMaster.semester,
        amount: feeMaster.amount,
        college: feeMaster.college,
        program: feeMaster.program,
        academic_year: feeMaster.academic_year,
        fee_type: feeMaster.fee_type,
        is_active: feeMaster.is_active,
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
  }, [feeMaster]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('kumss_user_id') || undefined;
    const submitData: any = { ...formData };

    if (!feeMaster && userId) {
      submitData.created_by = userId;
      submitData.updated_by = userId;
    } else if (feeMaster && userId) {
      submitData.updated_by = userId;
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="program">Program *</Label>
        <Input
          id="program"
          type="number"
          value={formData.program}
          onChange={(e) => setFormData({ ...formData, program: parseInt(e.target.value) || 0 })}
          placeholder="Program ID"
          required
          min="1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="academic_year">Academic Year *</Label>
        <Input
          id="academic_year"
          type="number"
          value={formData.academic_year}
          onChange={(e) => setFormData({ ...formData, academic_year: parseInt(e.target.value) || 0 })}
          placeholder="Academic Year ID"
          required
          min="1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fee_type">Fee Type *</Label>
        <Input
          id="fee_type"
          type="number"
          value={formData.fee_type}
          onChange={(e) => setFormData({ ...formData, fee_type: parseInt(e.target.value) || 0 })}
          placeholder="Fee Type ID"
          required
          min="1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester">Semester *</Label>
        <Input
          id="semester"
          type="number"
          value={formData.semester}
          onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
          placeholder="Semester number"
          required
          min="1"
          max="10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (₹) *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
          required
          min="0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="college">College ID</Label>
        <Input
          id="college"
          type="number"
          value={formData.college}
          onChange={(e) => setFormData({ ...formData, college: parseInt(e.target.value) || 0 })}
          placeholder="College ID"
          disabled={!!feeMaster}
          min="1"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {feeMaster ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
