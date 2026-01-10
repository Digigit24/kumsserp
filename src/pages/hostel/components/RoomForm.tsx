import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Checkbox } from '../../../components/ui/checkbox';
import { SearchableSelect } from '../../../components/ui/searchable-select';
import { useHostels, useRoomTypes } from '../../../hooks/useHostel';
import { useState } from 'react';

interface RoomFormProps {
  item: any | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const RoomForm = ({ item, onSubmit, onCancel }: RoomFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
    defaultValues: item || {
      room_number: '',
      floor: '',
      capacity: '',
      occupied_beds: 0,
      hostel: '',
      room_type: '',
      is_active: true,
    },
  });

  const isActive = watch('is_active');
  const hostel = watch('hostel');
  const roomType = watch('room_type');

  // Fetch hostels for dropdown
  const { data: hostelsData } = useHostels({ page_size: 1000 });

  // Fetch room types for dropdown (filter by selected hostel)
  const { data: roomTypesData } = useRoomTypes(hostel ? { hostel, page_size: 1000 } : { page_size: 1000 });

  const hostelOptions = hostelsData?.results?.map((h: any) => ({
    value: h.id,
    label: h.name,
    subtitle: h.hostel_type,
  })) || [];

  const roomTypeOptions = roomTypesData?.results?.map((rt: any) => ({
    value: rt.id,
    label: rt.name,
    subtitle: `₹${rt.monthly_fee}/month | Capacity: ${rt.capacity}`,
  })) || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="room_number">Room Number *</Label>
        <Input id="room_number" {...register('room_number', { required: 'Room number is required' })} placeholder="e.g., 101, A-101" />
        {errors.room_number && <p className="text-sm text-destructive">{errors.room_number.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label>Hostel *</Label>
        <SearchableSelect
          options={hostelOptions}
          value={hostel}
          onChange={(value) => {
            setValue('hostel', value);
            setValue('room_type', '');
          }}
          placeholder="Select hostel..."
          searchPlaceholder="Search hostels..."
        />
        {errors.hostel && <p className="text-sm text-destructive">{errors.hostel.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label>Room Type *</Label>
        <SearchableSelect
          options={roomTypeOptions}
          value={roomType}
          onChange={(value) => setValue('room_type', value)}
          placeholder={hostel ? "Select room type..." : "Select hostel first"}
          searchPlaceholder="Search room types..."
          disabled={!hostel}
        />
        {errors.room_type && <p className="text-sm text-destructive">{errors.room_type.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="floor">Floor *</Label>
        <Input id="floor" {...register('floor', { required: 'Floor is required' })} placeholder="e.g., Ground, 1st, 2nd" />
        {errors.floor && <p className="text-sm text-destructive">{errors.floor.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="capacity">Capacity *</Label>
        <Input id="capacity" type="number" {...register('capacity', { required: 'Capacity is required' })} placeholder="e.g., 4" />
        {errors.capacity && <p className="text-sm text-destructive">{errors.capacity.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="occupied_beds">Occupied Beds</Label>
        <Input id="occupied_beds" type="number" {...register('occupied_beds')} placeholder="e.g., 2" />
        <p className="text-xs text-muted-foreground">Leave as 0 for new rooms</p>
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
