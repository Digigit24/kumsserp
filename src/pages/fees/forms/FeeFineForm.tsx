/**
 * Fee Fine Form Component
 * Create/Edit form for fee fines
 */

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';

interface FeeFineFormProps {
  feeFine: any | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const FeeFineForm = ({ feeFine, onSubmit, onCancel }: FeeFineFormProps) => {
  const [formData, setFormData] = useState<any>({
    name: '',
    fine_type: 'late_payment',
    calculation_type: 'fixed',
    amount: '0',
    description: '',
    grace_period_days: 0,
    max_fine_amount: null,
    is_active: true,
  });

  useEffect(() => {
    if (feeFine) {
      setFormData(feeFine);
    }
  }, [feeFine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || formData.name.trim() === '') {
      alert('Please enter a fine name');
      return;
    }

    const collegeId = localStorage.getItem('kumss_college_id');
    const userId = localStorage.getItem('kumss_user_id') || undefined;
    const submitData: any = { ...formData };

    // Auto-populate college ID
    if (collegeId) {
      submitData.college = parseInt(collegeId);
    }

    // Auto-populate user IDs
    if (!feeFine && userId) {
      submitData.created_by = userId;
      submitData.updated_by = userId;
    } else if (feeFine && userId) {
      submitData.updated_by = userId;
    }

    console.log('Submitting fee fine:', submitData);
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Fine Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Late Payment Fine"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fine_type">Fine Type *</Label>
        <select
          id="fine_type"
          className="w-full p-2 border rounded"
          value={formData.fine_type}
          onChange={(e) => setFormData({ ...formData, fine_type: e.target.value as 'late_payment' | 'damage' | 'library' | 'other' })}
          required
        >
          <option value="late_payment">Late Payment</option>
          <option value="damage">Damage</option>
          <option value="library">Library</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="calculation_type">Calculation Type *</Label>
        <select
          id="calculation_type"
          className="w-full p-2 border rounded"
          value={formData.calculation_type}
          onChange={(e) => setFormData({ ...formData, calculation_type: e.target.value as 'percentage' | 'fixed' | 'per_day' })}
          required
        >
          <option value="fixed">Fixed Amount</option>
          <option value="percentage">Percentage</option>
          <option value="per_day">Per Day</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">
          {formData.calculation_type === 'percentage' ? 'Fine Percentage *' : 'Fine Amount *'}
        </Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder={formData.calculation_type === 'percentage' ? 'e.g., 5' : 'e.g., 100'}
          min="0"
          max={formData.calculation_type === 'percentage' ? '100' : undefined}
          step={formData.calculation_type === 'percentage' ? '0.01' : '0.01'}
          required
        />
        {formData.calculation_type === 'per_day' && (
          <p className="text-xs text-muted-foreground">Amount charged per day after grace period</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="grace_period_days">Grace Period (Days)</Label>
        <Input
          id="grace_period_days"
          type="number"
          value={formData.grace_period_days}
          onChange={(e) => setFormData({ ...formData, grace_period_days: parseInt(e.target.value) })}
          placeholder="e.g., 7"
          min="0"
        />
        <p className="text-xs text-muted-foreground">Number of days before fine starts applying</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="max_fine_amount">Max Fine Amount</Label>
        <Input
          id="max_fine_amount"
          type="number"
          value={formData.max_fine_amount || ''}
          onChange={(e) => setFormData({ ...formData, max_fine_amount: e.target.value ? parseFloat(e.target.value) : null })}
          placeholder="e.g., 5000"
          min="0"
        />
        <p className="text-xs text-muted-foreground">Maximum fine amount (leave empty for no limit)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description of the fine"
          rows={3}
        />
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
          {feeFine ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
