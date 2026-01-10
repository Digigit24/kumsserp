import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Checkbox } from '../../../components/ui/checkbox';

interface BedFormProps {
  item: any | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const BedForm = ({ item, onSubmit, onCancel }: BedFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
    defaultValues: item || {
      bed_number: '',
      room: '',
      status: 'available',
      is_active: true,
    },
  });

  const isActive = watch('is_active');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="bed_number">Bed Number *</Label>
        <Input id="bed_number" {...register('bed_number', { required: 'Bed number is required' })} placeholder="e.g., B-101" />
        {errors.bed_number && <p className="text-sm text-destructive">{errors.bed_number.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="room">Room ID *</Label>
        <Input id="room" type="number" {...register('room', { required: 'Room ID is required' })} placeholder="Enter room ID" />
        {errors.room && <p className="text-sm text-destructive">{errors.room.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Input id="status" {...register('status', { required: 'Status is required' })} placeholder="e.g., available, occupied, maintenance" />
        {errors.status && <p className="text-sm text-destructive">{errors.status.message as string}</p>}
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
