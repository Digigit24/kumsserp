/**
 * Fee Structure Form Component
 * Create/Edit form for fee structures
 */

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { FeeStructure } from '../../../data/feesMockData';

interface FeeStructureFormProps {
  feeStructure: FeeStructure | null;
  onSubmit: (data: Partial<FeeStructure>) => void;
  onCancel: () => void;
}

export const FeeStructureForm = ({ feeStructure, onSubmit, onCancel }: FeeStructureFormProps) => {
  const [formData, setFormData] = useState<Partial<FeeStructure>>({
    name: '',
    academic_session: 0,
    program: 0,
    class_obj: null,
    semester: null,
    total_amount: 0,
    effective_from: '',
    effective_to: '',
    is_active: true,
  });

  useEffect(() => {
    if (feeStructure) {
      setFormData(feeStructure);
    }
  }, [feeStructure]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Structure Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., B.Tech Semester 1 Fee Structure"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="academic_session">Academic Session *</Label>
          <select
            id="academic_session"
            className="w-full p-2 border rounded"
            value={formData.academic_session}
            onChange={(e) => setFormData({ ...formData, academic_session: parseInt(e.target.value) })}
            required
          >
            <option value="">Select Session</option>
            <option value="1">2024-2025</option>
            <option value="2">2025-2026</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="program">Program *</Label>
          <select
            id="program"
            className="w-full p-2 border rounded"
            value={formData.program}
            onChange={(e) => setFormData({ ...formData, program: parseInt(e.target.value) })}
            required
          >
            <option value="">Select Program</option>
            <option value="1">B.Tech Computer Science</option>
            <option value="2">MBA</option>
            <option value="3">BBA</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="class_obj">Class</Label>
          <select
            id="class_obj"
            className="w-full p-2 border rounded"
            value={formData.class_obj || ''}
            onChange={(e) => setFormData({ ...formData, class_obj: e.target.value ? parseInt(e.target.value) : null })}
          >
            <option value="">Select Class</option>
            <option value="1">First Year</option>
            <option value="2">Second Year</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="semester">Semester</Label>
          <Input
            id="semester"
            type="number"
            value={formData.semester || ''}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="1, 2, 3..."
            min="1"
            max="8"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="total_amount">Total Amount *</Label>
        <Input
          id="total_amount"
          type="number"
          value={formData.total_amount}
          onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) })}
          placeholder="e.g., 75000"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="effective_from">Effective From *</Label>
          <Input
            id="effective_from"
            type="date"
            value={formData.effective_from}
            onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="effective_to">Effective To</Label>
          <Input
            id="effective_to"
            type="date"
            value={formData.effective_to || ''}
            onChange={(e) => setFormData({ ...formData, effective_to: e.target.value })}
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
          {feeStructure ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
