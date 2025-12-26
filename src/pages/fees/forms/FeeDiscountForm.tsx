/**
 * Fee Discount Form Component
 * Create/Edit form for fee discounts
 */

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { FeeDiscount } from '../../../data/feesMockData';

interface FeeDiscountFormProps {
  feeDiscount: FeeDiscount | null;
  onSubmit: (data: Partial<FeeDiscount>) => void;
  onCancel: () => void;
}

export const FeeDiscountForm = ({ feeDiscount, onSubmit, onCancel }: FeeDiscountFormProps) => {
  const [formData, setFormData] = useState<Partial<FeeDiscount>>({
    name: '',
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    description: '',
    max_discount_amount: null,
    eligibility_criteria: '',
    is_active: true,
  });

  useEffect(() => {
    if (feeDiscount) {
      setFormData(feeDiscount);
    }
  }, [feeDiscount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Discount Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Merit Scholarship"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Code *</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          placeholder="e.g., MERIT-25"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="discount_type">Discount Type *</Label>
        <select
          id="discount_type"
          className="w-full p-2 border rounded"
          value={formData.discount_type}
          onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
          required
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="discount_value">
          {formData.discount_type === 'percentage' ? 'Discount Percentage *' : 'Discount Amount *'}
        </Label>
        <Input
          id="discount_value"
          type="number"
          value={formData.discount_value}
          onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
          placeholder={formData.discount_type === 'percentage' ? 'e.g., 25' : 'e.g., 5000'}
          min="0"
          max={formData.discount_type === 'percentage' ? 100 : undefined}
          step={formData.discount_type === 'percentage' ? '0.01' : '1'}
          required
        />
      </div>

      {formData.discount_type === 'percentage' && (
        <div className="space-y-2">
          <Label htmlFor="max_discount_amount">Max Discount Amount</Label>
          <Input
            id="max_discount_amount"
            type="number"
            value={formData.max_discount_amount || ''}
            onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value ? parseFloat(e.target.value) : null })}
            placeholder="e.g., 20000"
            min="0"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="eligibility_criteria">Eligibility Criteria</Label>
        <Textarea
          id="eligibility_criteria"
          value={formData.eligibility_criteria || ''}
          onChange={(e) => setFormData({ ...formData, eligibility_criteria: e.target.value })}
          placeholder="e.g., CGPA >= 8.5"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description of the discount"
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
          {feeDiscount ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
