/**
 * Sale Form Component
 */

import { useState, useEffect } from 'react';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { SearchableSelect } from '../../../components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { studentApi } from '../../../services/students.service';
import { DollarSign, CreditCard, Wallet, Smartphone } from 'lucide-react';

interface SaleFormProps {
  sale?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const SaleForm = ({ sale, onSubmit, onCancel }: SaleFormProps) => {
  const [formData, setFormData] = useState<any>({
    student: 0,
    teacher: 0,
    sale_date: new Date().toISOString().split('T')[0],
    total_amount: '0',
    payment_method: 'cash',
    payment_status: 'pending',
    remarks: '',
    is_active: true,
  });

  // Fetch students for dropdown
  const { data: studentsData } = useQuery({
    queryKey: ['students-for-select'],
    queryFn: () => studentApi.list(),
  });

  useEffect(() => {
    if (sale) {
      setFormData({
        student: sale.student || 0,
        teacher: sale.teacher || 0,
        sale_date: sale.sale_date || new Date().toISOString().split('T')[0],
        total_amount: String(sale.total_amount || '0'),
        payment_method: sale.payment_method || 'cash',
        payment_status: sale.payment_status || 'pending',
        remarks: sale.remarks || '',
        is_active: sale.is_active ?? true,
      });
    }
  }, [sale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clean data: remove zero values for optional student/teacher
    const submitData = { ...formData };
    if (submitData.student === 0) {
      delete submitData.student;
    }
    if (submitData.teacher === 0) {
      delete submitData.teacher;
    }

    onSubmit(submitData);
  };

  const studentsOptions = studentsData?.results?.map((student: any) => ({
    value: student.id,
    label: student.full_name
      ? `${student.full_name} (${student.admission_number || student.id})`
      : `${student.first_name || ''} ${student.last_name || ''} (${student.admission_number || student.id})`.trim(),
  })) || [];

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'upi':
        return <Smartphone className="h-4 w-4" />;
      case 'wallet':
        return <Wallet className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">Sale Information</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sale_date">Sale Date *</Label>
            <Input
              id="sale_date"
              type="date"
              value={formData.sale_date}
              onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="total_amount">Total Amount (₹) *</Label>
            <Input
              id="total_amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.total_amount}
              onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
              required
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="student">Customer (Student)</Label>
          <SearchableSelect
            options={studentsOptions}
            value={formData.student}
            onChange={(value) => setFormData({ ...formData, student: value })}
            placeholder="Select student (optional)"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Optional: Link this sale to a student
          </p>
        </div>

        <div>
          <Label htmlFor="teacher">Staff/Teacher ID</Label>
          <Input
            id="teacher"
            type="number"
            placeholder="Enter staff ID (optional)"
            value={formData.teacher || ''}
            onChange={(e) => setFormData({ ...formData, teacher: parseInt(e.target.value) || 0 })}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Optional: Link this sale to a staff member
          </p>
        </div>
      </div>

      {/* Payment Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg">Payment Details</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="payment_method">Payment Method *</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
            >
              <SelectTrigger className="mt-1">
                <div className="flex items-center gap-2">
                  {getPaymentMethodIcon(formData.payment_method)}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Cash
                  </div>
                </SelectItem>
                <SelectItem value="card">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Card
                  </div>
                </SelectItem>
                <SelectItem value="upi">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    UPI
                  </div>
                </SelectItem>
                <SelectItem value="wallet">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Wallet
                  </div>
                </SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="payment_status">Payment Status *</Label>
            <Select
              value={formData.payment_status}
              onValueChange={(value) => setFormData({ ...formData, payment_status: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">
                  <span className="text-yellow-600">● Pending</span>
                </SelectItem>
                <SelectItem value="completed">
                  <span className="text-green-600">● Completed</span>
                </SelectItem>
                <SelectItem value="failed">
                  <span className="text-red-600">● Failed</span>
                </SelectItem>
                <SelectItem value="refunded">
                  <span className="text-blue-600">● Refunded</span>
                </SelectItem>
                <SelectItem value="cancelled">
                  <span className="text-gray-600">● Cancelled</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="remarks">Remarks / Notes</Label>
          <Textarea
            id="remarks"
            placeholder="Add any notes about this sale..."
            rows={3}
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            className="mt-1"
          />
        </div>

        <div className="flex items-center space-x-2 p-3 bg-accent/50 rounded-lg">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active" className="cursor-pointer font-medium">
            Active Sale Record
          </Label>
        </div>
      </div>

      {/* Summary Card */}
      <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">Total Amount:</span>
          <span className="text-2xl font-bold text-primary">
            ₹{parseFloat(formData.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">Payment:</span>
          <span className="text-sm font-medium capitalize">{formData.payment_method}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-muted-foreground">Status:</span>
          <span className="text-sm font-medium capitalize">{formData.payment_status}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="min-w-[120px]">
          {sale ? 'Update Sale' : 'Create Sale'}
        </Button>
      </div>
    </form>
  );
};

export default SaleForm;
