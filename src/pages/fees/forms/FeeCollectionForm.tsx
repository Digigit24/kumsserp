/**
 * Fee Collection Form Component
 * Create/Edit form for fee collections
 */

import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { SearchableSelect, SearchableSelectOption } from '../../../components/ui/searchable-select';
import { FeeCollection, FeeCollectionCreateInput } from '../../../types/fees.types';
import { useStudents } from '../../../hooks/useStudents';

interface FeeCollectionFormProps {
  feeCollection: FeeCollection | null;
  onSubmit: (data: Partial<FeeCollectionCreateInput>) => void;
  onCancel: () => void;
}

export const FeeCollectionForm = ({ feeCollection, onSubmit, onCancel }: FeeCollectionFormProps) => {
  const [formData, setFormData] = useState<Partial<FeeCollectionCreateInput>>({
    student: 0,
    amount: '0',
    payment_method: 'cash',
    payment_date: new Date().toISOString().split('T')[0],
    status: 'completed',
    transaction_id: '',
    remarks: '',
    is_active: true,
  });

  // Fetch students for dropdown
  const { data: studentsData } = useStudents({ page_size: 1000 });

  // Create options for students dropdown
  const studentOptions: SearchableSelectOption[] = useMemo(() => {
    if (!studentsData?.results) return [];
    return studentsData.results.map((student) => ({
      value: student.id,
      label: student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || `Student ${student.id}`,
      subtitle: student.roll_number || student.email || '',
    }));
  }, [studentsData]);

  useEffect(() => {
    if (feeCollection) {
      setFormData({
        student: feeCollection.student,
        amount: feeCollection.amount,
        payment_method: feeCollection.payment_method,
        payment_date: feeCollection.payment_date,
        status: feeCollection.status,
        transaction_id: feeCollection.transaction_id || '',
        remarks: feeCollection.remarks || '',
        is_active: feeCollection.is_active,
      });
    }
  }, [feeCollection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const collegeId = localStorage.getItem('kumss_college_id');
    const userId = localStorage.getItem('kumss_user_id') || undefined;
    const submitData: any = { ...formData };

    // Auto-populate college ID
    if (collegeId) {
      submitData.college = parseInt(collegeId);
    }

    // Set collected_by to the current user
    submitData.collected_by = userId;

    if (!feeCollection && userId) {
      submitData.created_by = userId;
      submitData.updated_by = userId;
    } else if (feeCollection && userId) {
      submitData.updated_by = userId;
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="student">Student *</Label>
        <SearchableSelect
          options={studentOptions}
          value={formData.student}
          onChange={(value) => setFormData({ ...formData, student: Number(value) })}
          placeholder="Select student"
          searchPlaceholder="Search students..."
          emptyText="No students available"
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
        <Label htmlFor="payment_date">Payment Date *</Label>
        <Input
          id="payment_date"
          type="date"
          value={formData.payment_date}
          onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_method">Payment Method *</Label>
        <select
          id="payment_method"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.payment_method}
          onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
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

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <select
          id="status"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          required
        >
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {formData.payment_method !== 'cash' && (
        <div className="space-y-2">
          <Label htmlFor="transaction_id">Transaction ID</Label>
          <Input
            id="transaction_id"
            value={formData.transaction_id}
            onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
            placeholder="Enter transaction/reference number"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          placeholder="Any additional notes"
          rows={3}
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
