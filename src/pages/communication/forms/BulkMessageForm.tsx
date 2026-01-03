// Bulk Message Form Component
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import type { BulkMessage, BulkMessageCreateInput } from '../../../types/communication.types';

interface BulkMessageFormProps {
  bulkMessage?: BulkMessage;
  onSubmit: (data: BulkMessageCreateInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const BulkMessageForm = ({
  bulkMessage,
  onSubmit,
  onCancel,
  isLoading = false,
}: BulkMessageFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BulkMessageCreateInput>({
    defaultValues: bulkMessage || {
      title: '',
      message_type: 'notification',
      recipient_type: 'all',
      status: 'draft',
      is_active: true,
      total_recipients: 0,
      sent_count: 0,
      failed_count: 0,
    },
  });

  const messageType = watch('message_type');
  const recipientType = watch('recipient_type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Message Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
              placeholder="Enter message title"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Message Type */}
          <div className="space-y-2">
            <Label htmlFor="message_type">
              Message Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={messageType}
              onValueChange={(value) => setValue('message_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select message type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="push">Push Notification</SelectItem>
                <SelectItem value="notification">In-App Notification</SelectItem>
                <SelectItem value="all">All Channels</SelectItem>
              </SelectContent>
            </Select>
            {errors.message_type && (
              <p className="text-sm text-red-500">{errors.message_type.message}</p>
            )}
          </div>

          {/* Recipient Type */}
          <div className="space-y-2">
            <Label htmlFor="recipient_type">
              Recipient Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={recipientType}
              onValueChange={(value) => setValue('recipient_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipient type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="guardian">Parents/Guardians</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="custom">Custom Selection</SelectItem>
              </SelectContent>
            </Select>
            {errors.recipient_type && (
              <p className="text-sm text-red-500">{errors.recipient_type.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              defaultValue="draft"
              onValueChange={(value) => setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sending">Sending</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scheduled At */}
          <div className="space-y-2">
            <Label htmlFor="scheduled_at">Schedule Date & Time</Label>
            <Input
              id="scheduled_at"
              type="datetime-local"
              {...register('scheduled_at')}
            />
            <p className="text-sm text-gray-500">
              Leave empty to send immediately
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics (Read-only for existing messages) */}
      {bulkMessage && (
        <Card>
          <CardHeader>
            <CardTitle>Message Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Total Recipients</Label>
                <Input
                  type="number"
                  value={bulkMessage.total_recipients}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>Sent</Label>
                <Input
                  type="number"
                  value={bulkMessage.sent_count}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>Failed</Label>
                <Input
                  type="number"
                  value={bulkMessage.failed_count}
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
          {isLoading ? 'Saving...' : bulkMessage ? 'Update Message' : 'Create Message'}
        </Button>
      </div>
    </form>
  );
};
