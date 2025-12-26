/**
 * Fee Collection Form Component
 * Create/Edit form for fee collections
 */

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { FeeCollection } from '../../../data/feesMockData';

interface FeeCollectionFormProps {
  feeCollection: FeeCollection | null;
  onSubmit: (data: Partial<FeeCollection>) => void;
  onCancel: () => void;
}

export const FeeCollectionForm = ({ feeCollection, onSubmit, onCancel }: FeeCollectionFormProps) => {
  const [formData, setFormData] = useState<Partial<FeeCollection>>({
    receipt_number: '',
    student: 0,
    academic_session: 0,
    payment_date: new Date().toISOString().split('T')[0],
    total_amount: 0,
    discount_amount: 0,
    fine_amount: 0,
    net_amount: 0,
    amount_paid: 0,
    payment_mode: 'cash',
    transaction_id: '',
    remarks: '',
  });

  useEffect(() => {
    if (feeCollection) {
      setFormData(feeCollection);
    }
  }, [feeCollection]);

  // Auto-calculate net amount
  useEffect(() => {
    const total = formData.total_amount || 0;
    const discount = formData.discount_amount || 0;
    const fine = formData.fine_amount || 0;
    const net = total - discount + fine;
    setFormData(prev => ({ ...prev, net_amount: net }));
  }, [formData.total_amount, formData.discount_amount, formData.fine_amount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="receipt_number">Receipt Number *</Label>
        <Input
          id="receipt_number"
          value={formData.receipt_number}
          onChange={(e) => setFormData({ ...formData, receipt_number: e.target.value })}
          placeholder="e.g., FEE-2025-0001"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="student">Student *</Label>
          <select
            id="student"
            className="w-full p-2 border rounded"
            value={formData.student}
            onChange={(e) => setFormData({ ...formData, student: parseInt(e.target.value) })}
            required
          >
            <option value="">Select Student</option>
            <option value="1">John Smith (2024001)</option>
            <option value="2">Emma Johnson (2024002)</option>
            <option value="3">Michael Brown (2024003)</option>
          </select>
        </div>

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
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_date">Payment Date *</Label>
        <Input
          id="payment_date"
          type="date"
          value={formData.payment_date}
          onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="discount_amount">Discount</Label>
          <Input
            id="discount_amount"
            type="number"
            value={formData.discount_amount}
            onChange={(e) => setFormData({ ...formData, discount_amount: parseFloat(e.target.value) })}
            placeholder="e.g., 5000"
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fine_amount">Fine</Label>
          <Input
            id="fine_amount"
            type="number"
            value={formData.fine_amount}
            onChange={(e) => setFormData({ ...formData, fine_amount: parseFloat(e.target.value) })}
            placeholder="e.g., 500"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="space-y-2 p-3 bg-muted rounded">
        <Label>Net Amount</Label>
        <p className="text-2xl font-bold">₹{formData.net_amount.toFixed(2)}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount_paid">Amount Paid *</Label>
        <Input
          id="amount_paid"
          type="number"
          value={formData.amount_paid}
          onChange={(e) => setFormData({ ...formData, amount_paid: parseFloat(e.target.value) })}
          placeholder="e.g., 40000"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_mode">Payment Mode *</Label>
        <select
          id="payment_mode"
          className="w-full p-2 border rounded"
          value={formData.payment_mode}
          onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value as any })}
          required
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="net_banking">Net Banking</option>
          <option value="cheque">Cheque</option>
          <option value="demand_draft">Demand Draft</option>
        </select>
      </div>

      {formData.payment_mode !== 'cash' && (
        <div className="space-y-2">
          <Label htmlFor="transaction_id">Transaction ID</Label>
          <Input
            id="transaction_id"
            value={formData.transaction_id || ''}
            onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
            placeholder="Enter transaction/cheque number"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          value={formData.remarks || ''}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          placeholder="Any additional notes"
          rows={2}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {feeCollection ? 'Update' : 'Collect Fee'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
