/**
 * Fee Master Form Component
 * Create/Edit form for fee masters
 */

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { FeeMaster } from '../../../data/feesMockData';

interface FeeMasterFormProps {
  feeMaster: FeeMaster | null;
  onSubmit: (data: Partial<FeeMaster>) => void;
  onCancel: () => void;
}

export const FeeMasterForm = ({ feeMaster, onSubmit, onCancel }: FeeMasterFormProps) => {
  const [formData, setFormData] = useState<Partial<FeeMaster>>({
    fee_type: '',
    name: '',
    code: '',
    description: '',
    is_mandatory: true,
    is_refundable: false,
    display_order: 1,
    is_active: true,
  });

  useEffect(() => {
    if (feeMaster) {
      setFormData(feeMaster);
    }
  }, [feeMaster]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fee_type">Fee Type *</Label>
        <Input
          id="fee_type"
          value={formData.fee_type}
          onChange={(e) => setFormData({ ...formData, fee_type: e.target.value })}
          placeholder="e.g., Tuition, Library, Lab"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Semester Fee"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Code *</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          placeholder="e.g., SEM-FEE"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description of the fee master"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="display_order">Display Order</Label>
        <Input
          id="display_order"
          type="number"
          value={formData.display_order}
          onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
          min="1"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="is_mandatory">Mandatory</Label>
        <Switch
          id="is_mandatory"
          checked={formData.is_mandatory}
          onCheckedChange={(checked) => setFormData({ ...formData, is_mandatory: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="is_refundable">Refundable</Label>
        <Switch
          id="is_refundable"
          checked={formData.is_refundable}
          onCheckedChange={(checked) => setFormData({ ...formData, is_refundable: checked })}
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
          {feeMaster ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
