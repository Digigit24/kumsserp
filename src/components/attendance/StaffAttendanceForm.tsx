/**
 * Staff Attendance Form Component
 * For marking/editing staff attendance
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMarkStaffAttendance, useUpdateStaffAttendance } from '../../hooks/useAttendance';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import type { StaffAttendance, StaffAttendanceCreateInput } from '../../types/attendance.types';

interface StaffAttendanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendance?: StaffAttendance | null;
  teacherId?: number;
  onSuccess?: () => void;
}

export const StaffAttendanceForm: React.FC<StaffAttendanceFormProps> = ({
  open,
  onOpenChange,
  attendance,
  teacherId,
  onSuccess,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const isEdit = !!attendance;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<StaffAttendanceCreateInput>({
    defaultValues: {
      teacher: teacherId || 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'present',
    },
  });

  const createMutation = useMarkStaffAttendance();
  const updateMutation = useUpdateStaffAttendance();

  const status = watch('status');

  useEffect(() => {
    if (attendance) {
      setValue('teacher', attendance.teacher);
      setValue('date', attendance.date);
      setValue('status', attendance.status);
      setValue('check_in_time', attendance.check_in_time || '');
      setValue('check_out_time', attendance.check_out_time || '');
      setValue('remarks', attendance.remarks || '');
      setDate(new Date(attendance.date));
    }
  }, [attendance, setValue]);

  const onSubmit = async (data: StaffAttendanceCreateInput) => {
    try {
      if (isEdit && attendance) {
        await updateMutation.mutateAsync({
          id: attendance.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess?.();
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Failed to save staff attendance:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Mark'} Staff Attendance</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update' : 'Mark'} attendance for the staff member
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Teacher ID */}
          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher ID *</Label>
            <Input
              id="teacher"
              type="number"
              {...register('teacher', { required: true, valueAsNumber: true })}
              placeholder="Enter teacher ID"
            />
            {errors.teacher && <p className="text-sm text-red-500">Teacher ID is required</p>}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    if (newDate) {
                      setDate(newDate);
                      setValue('date', format(newDate, 'yyyy-MM-dd'));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Input
              id="status"
              {...register('status', { required: true })}
              placeholder="e.g., present, absent, late, on_leave"
            />
            {errors.status && <p className="text-sm text-red-500">Status is required</p>}
          </div>

          {/* Check-in/Check-out Times */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="check_in_time">Check-in Time</Label>
              <Input
                id="check_in_time"
                type="time"
                {...register('check_in_time')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="check_out_time">Check-out Time</Label>
              <Input
                id="check_out_time"
                type="time"
                {...register('check_out_time')}
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              {...register('remarks')}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : isEdit
                ? 'Update'
                : 'Mark Attendance'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
