import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Checkbox } from '../../../components/ui/checkbox';

interface AllocationFormProps {
  item: any | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const AllocationForm = ({ item, onSubmit, onCancel }: AllocationFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
    defaultValues: item || {
      student: '',
      hostel: '',
      room: '',
      bed: '',
      from_date: '',
      to_date: '',
      remarks: '',
      is_current: true,
      is_active: true,
    },
  });

  const isCurrent = watch('is_current');
  const isActive = watch('is_active');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="student">Student ID *</Label>
        <Input id="student" type="number" {...register('student', { required: 'Student ID is required' })} placeholder="Enter student ID" />
        {errors.student && <p className="text-sm text-destructive">{errors.student.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="hostel">Hostel ID *</Label>
        <Input id="hostel" type="number" {...register('hostel', { required: 'Hostel ID is required' })} placeholder="Enter hostel ID" />
        {errors.hostel && <p className="text-sm text-destructive">{errors.hostel.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="room">Room ID *</Label>
        <Input id="room" type="number" {...register('room', { required: 'Room ID is required' })} placeholder="Enter room ID" />
        {errors.room && <p className="text-sm text-destructive">{errors.room.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bed">Bed ID *</Label>
        <Input id="bed" type="number" {...register('bed', { required: 'Bed ID is required' })} placeholder="Enter bed ID" />
        {errors.bed && <p className="text-sm text-destructive">{errors.bed.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="from_date">From Date *</Label>
        <Input id="from_date" type="date" {...register('from_date', { required: 'From date is required' })} />
        {errors.from_date && <p className="text-sm text-destructive">{errors.from_date.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="to_date">To Date *</Label>
        <Input id="to_date" type="date" {...register('to_date', { required: 'To date is required' })} />
        {errors.to_date && <p className="text-sm text-destructive">{errors.to_date.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea id="remarks" {...register('remarks')} placeholder="Enter any remarks" rows={3} />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="is_current" checked={isCurrent} onCheckedChange={(checked) => setValue('is_current', checked)} />
        <Label htmlFor="is_current" className="cursor-pointer">Current Allocation</Label>
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
