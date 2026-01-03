// Event Registration Form Component
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import type { EventRegistration, EventRegistrationCreateInput } from '../../../types/communication.types';

interface EventRegistrationFormProps {
  registration?: EventRegistration;
  onSubmit: (data: EventRegistrationCreateInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultEventId?: number;
}

export const EventRegistrationForm = ({
  registration,
  onSubmit,
  onCancel,
  isLoading = false,
  defaultEventId,
}: EventRegistrationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EventRegistrationCreateInput>({
    defaultValues: registration || {
      event: defaultEventId || 0,
      user: '',
      registration_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      is_active: true,
    },
  });

  const status = watch('status');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {registration ? 'Edit Registration' : 'New Registration'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Event ID */}
          {!defaultEventId && (
            <div className="space-y-2">
              <Label htmlFor="event">
                Event ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="event"
                type="number"
                {...register('event', {
                  required: 'Event ID is required',
                  min: { value: 1, message: 'Must be a valid event ID' },
                })}
                placeholder="Enter event ID"
              />
              {errors.event && (
                <p className="text-sm text-red-500">{errors.event.message}</p>
              )}
            </div>
          )}

          {/* User ID */}
          <div className="space-y-2">
            <Label htmlFor="user">
              User ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="user"
              {...register('user', { required: 'User ID is required' })}
              placeholder="Enter user ID (UUID)"
            />
            {errors.user && (
              <p className="text-sm text-red-500">{errors.user.message}</p>
            )}
          </div>

          {/* Registration Date */}
          <div className="space-y-2">
            <Label htmlFor="registration_date">Registration Date</Label>
            <Input
              id="registration_date"
              type="date"
              {...register('registration_date')}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="attended">Attended</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? 'Saving...'
            : registration
            ? 'Update Registration'
            : 'Register'}
        </Button>
      </div>
    </form>
  );
};
