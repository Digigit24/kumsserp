import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Checkbox } from '../../../components/ui/checkbox';

interface LeaveTypeFormProps {
  item: any | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const LeaveTypeForm = ({ item, onSubmit, onCancel }: LeaveTypeFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
    defaultValues: item || { name: '', code: '', max_days_per_year: '', description: '', is_paid: true, is_active: true },
  });

  const isPaid = watch('is_paid');
  const isActive = watch('is_active');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" {...register('name', { required: 'Name is required' })} placeholder="e.g., Casual Leave" />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Code *</Label>
        <Input id="code" {...register('code', { required: 'Code is required' })} placeholder="e.g., CL" />
        {errors.code && <p className="text-sm text-destructive">{errors.code.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="max_days_per_year">Max Days Per Year *</Label>
        <Input id="max_days_per_year" type="number" {...register('max_days_per_year', { required: 'Max days is required' })} placeholder="e.g., 12" />
        {errors.max_days_per_year && <p className="text-sm text-destructive">{errors.max_days_per_year.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} placeholder="Enter description" rows={3} />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="is_paid" checked={isPaid} onCheckedChange={(checked) => setValue('is_paid', checked)} />
        <Label htmlFor="is_paid" className="cursor-pointer">Paid Leave</Label>
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
