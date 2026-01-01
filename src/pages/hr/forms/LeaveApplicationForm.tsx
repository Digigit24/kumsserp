import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { useLeaveTypes, useTeachers } from '../../../hooks/useHR';

interface LeaveApplicationFormProps {
  item: any | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const LeaveApplicationForm = ({ item, onSubmit, onCancel }: LeaveApplicationFormProps) => {
  const { data: leaveTypes } = useLeaveTypes({ is_active: true });
  const { data: teachers } = useTeachers({ is_active: true });

  // Debug: Log teachers data when it loads
  console.log('Teachers data loaded:', teachers);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: item || {
      leave_type: '',
      from_date: '',
      to_date: '',
      total_days: '',
      reason: '',
      teacher: '',
      attachment: '',
      status: 'pending'
    },
  });

  const handleFormSubmit = (data: any) => {
    // Debug: Log raw form data
    console.log('Raw form data:', data);
    console.log('Teacher value before processing:', data.teacher, typeof data.teacher);

    // Clean up the data before submission
    const cleanedData: any = {
      ...data,
      leave_type: parseInt(data.leave_type),
      total_days: parseInt(data.total_days),
    };

    // Convert teacher to integer (required field)
    if (cleanedData.teacher) {
      console.log('Converting teacher to int:', cleanedData.teacher);
      cleanedData.teacher = parseInt(cleanedData.teacher);
      console.log('Teacher after parseInt:', cleanedData.teacher);
    } else {
      console.log('Teacher is empty/falsy:', cleanedData.teacher);
    }

    // Remove attachment if it's empty
    if (!cleanedData.attachment || cleanedData.attachment.trim() === '') {
      delete cleanedData.attachment;
    }

    // Debug: Log final cleaned data
    console.log('Final cleaned data to submit:', cleanedData);

    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
        <Label htmlFor="total_days">Total Days *</Label>
        <Input id="total_days" type="number" {...register('total_days', { required: 'Total days is required' })} placeholder="e.g., 5" />
        {errors.total_days && <p className="text-sm text-destructive">{errors.total_days.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason *</Label>
        <Textarea id="reason" {...register('reason', { required: 'Reason is required' })} placeholder="Enter reason for leave" rows={3} />
        {errors.reason && <p className="text-sm text-destructive">{errors.reason.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="teacher">Teacher *</Label>
        <select
          id="teacher"
          {...register('teacher', { required: 'Teacher is required' })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select teacher</option>
          {teachers?.results?.map((teacher: any) => {
            const teacherValue = teacher.teacher_id || teacher.id;
            console.log('Rendering teacher option:', {
              id: teacher.id,
              teacher_id: teacher.teacher_id,
              full_name: teacher.full_name,
              selectedValue: teacherValue
            });
            return (
              <option key={teacher.id} value={teacherValue}>
                {teacher.full_name} {teacher.email ? `(${teacher.email})` : ''}
              </option>
            );
          })}
        </select>
        {errors.teacher && <p className="text-sm text-destructive">{errors.teacher.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachment">Attachment (URL)</Label>
        <Input id="attachment" {...register('attachment')} placeholder="Enter attachment URL if any" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          {...register('status')}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">{isSubmitting ? 'Saving...' : item ? 'Update' : 'Create'}</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
      </div>
    </form>
  );
};
