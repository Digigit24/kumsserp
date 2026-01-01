import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Checkbox } from '../../../components/ui/checkbox';
import { useLeaveTypes } from '../../../hooks/useHR';

interface LeaveBalanceFormProps {
  item: any | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const LeaveBalanceForm = ({ item, onSubmit, onCancel }: LeaveBalanceFormProps) => {
  const { data: leaveTypes } = useLeaveTypes({ is_active: true });
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
    defaultValues: item || {
      leave_type: '',
      academic_year: '',
      total_days: '',
      used_days: 0,
      balance_days: '',
      is_active: true
    },
  });

  const isActive = watch('is_active');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="leave_type">Leave Type *</Label>
        <select
          id="leave_type"
          {...register('leave_type', { required: 'Leave type is required' })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select leave type</option>
          {leaveTypes?.results?.map((type: any) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
        {errors.leave_type && <p className="text-sm text-destructive">{errors.leave_type.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="academic_year">Academic Year (ID) *</Label>
        <Input id="academic_year" type="number" {...register('academic_year', { required: 'Academic year is required' })} placeholder="e.g., 1" />
        {errors.academic_year && <p className="text-sm text-destructive">{errors.academic_year.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="total_days">Total Days *</Label>
        <Input id="total_days" type="number" {...register('total_days', { required: 'Total days is required' })} placeholder="e.g., 12" />
        {errors.total_days && <p className="text-sm text-destructive">{errors.total_days.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="used_days">Used Days</Label>
        <Input id="used_days" type="number" {...register('used_days')} placeholder="e.g., 5" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="balance_days">Balance Days</Label>
        <Input id="balance_days" type="number" {...register('balance_days')} placeholder="e.g., 7" />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="is_active" checked={isActive} onCheckedChange={(checked) => setValue('is_active', checked)} />
        <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">{isSubmitting ? 'Saving...' : item ? 'Update' : 'Create'}</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
      </div>
    </form>
  );
};
