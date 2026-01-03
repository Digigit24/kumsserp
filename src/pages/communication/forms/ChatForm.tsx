// Chat Form Component
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import type { Chat, ChatCreateInput } from '../../../types/communication.types';

interface ChatFormProps {
  chat?: Chat;
  onSubmit: (data: ChatCreateInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultReceiver?: string;
}

export const ChatForm = ({
  chat,
  onSubmit,
  onCancel,
  isLoading = false,
  defaultReceiver,
}: ChatFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChatCreateInput>({
    defaultValues: chat || {
      message: '',
      sender: '',
      receiver: defaultReceiver || '',
      attachment: null,
      is_read: false,
      is_active: true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{chat ? 'Edit Message' : 'New Message'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Receiver */}
          {!defaultReceiver && (
            <div className="space-y-2">
              <Label htmlFor="receiver">
                To (User ID) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="receiver"
                {...register('receiver', { required: 'Receiver is required' })}
                placeholder="Enter receiver user ID"
              />
              {errors.receiver && (
                <p className="text-sm text-red-500">{errors.receiver.message}</p>
              )}
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              {...register('message', { required: 'Message is required' })}
              placeholder="Type your message here..."
              rows={6}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          {/* Attachment */}
          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment URL</Label>
            <Input
              id="attachment"
              {...register('attachment')}
              placeholder="https://example.com/file.pdf"
            />
            <p className="text-sm text-gray-500">
              Optional: Enter a URL to an attachment
            </p>
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
          {isLoading ? 'Sending...' : chat ? 'Update Message' : 'Send Message'}
        </Button>
      </div>
    </form>
  );
};
