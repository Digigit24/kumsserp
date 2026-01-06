// Notice Form Component
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Checkbox } from '../../../components/ui/checkbox';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import type { Notice, NoticeCreateInput } from '../../../types/communication.types';

interface NoticeFormProps {
  notice?: Notice;
  onSubmit: (data: NoticeCreateInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const NoticeForm = ({
  notice,
  onSubmit,
  onCancel,
  isLoading = false,
}: NoticeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<NoticeCreateInput>({
    defaultValues: notice || {
      title: '',
      content: '',
      publish_date: '',
      expiry_date: '',
      attachment: null,
      is_urgent: false,
      is_published: false,
      is_active: true,
    },
  });

  const isUrgent = watch('is_urgent');
  const isPublished = watch('is_published');
  const isActive = watch('is_active');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {notice ? 'Edit Notice' : 'New Notice'}
          </CardTitle>
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
              placeholder="Enter notice title"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">
              Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              {...register('content', { required: 'Content is required' })}
              placeholder="Enter notice content"
              rows={8}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          {/* Publish Date */}
          <div className="space-y-2">
            <Label htmlFor="publish_date">
              Publish Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="publish_date"
              type="date"
              {...register('publish_date', { required: 'Publish date is required' })}
            />
            {errors.publish_date && (
              <p className="text-sm text-red-500">{errors.publish_date.message}</p>
            )}
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="expiry_date">
              Expiry Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="expiry_date"
              type="date"
              {...register('expiry_date', { required: 'Expiry date is required' })}
            />
            {errors.expiry_date && (
              <p className="text-sm text-red-500">{errors.expiry_date.message}</p>
            )}
          </div>

          {/* Attachment URL */}
          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment URL (Optional)</Label>
            <Input
              id="attachment"
              {...register('attachment')}
              placeholder="Enter attachment URL if any"
            />
          </div>

          {/* Visibility Settings */}
          <div className="space-y-3 border-t pt-4">
            <Label className="text-base font-semibold">Visibility Settings</Label>
            <p className="text-sm text-muted-foreground">Choose who can see this notice</p>

            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <input
                  type="radio"
                  id="visibility-all"
                  name="visibility"
                  value="all"
                  defaultChecked
                  className="w-4 h-4"
                />
                <label htmlFor="visibility-all" className="flex-1 cursor-pointer">
                  <div className="font-medium">Everyone</div>
                  <div className="text-sm text-muted-foreground">All users can see this notice</div>
                </label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <input
                  type="radio"
                  id="visibility-students"
                  name="visibility"
                  value="students"
                  className="w-4 h-4"
                />
                <label htmlFor="visibility-students" className="flex-1 cursor-pointer">
                  <div className="font-medium">Students Only</div>
                  <div className="text-sm text-muted-foreground">Only students can see this notice</div>
                </label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <input
                  type="radio"
                  id="visibility-teachers"
                  name="visibility"
                  value="teachers"
                  className="w-4 h-4"
                />
                <label htmlFor="visibility-teachers" className="flex-1 cursor-pointer">
                  <div className="font-medium">Teachers Only</div>
                  <div className="text-sm text-muted-foreground">Only teachers can see this notice</div>
                </label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <input
                  type="radio"
                  id="visibility-staff"
                  name="visibility"
                  value="staff"
                  className="w-4 h-4"
                />
                <label htmlFor="visibility-staff" className="flex-1 cursor-pointer">
                  <div className="font-medium">Staff Only</div>
                  <div className="text-sm text-muted-foreground">Only staff members can see this notice</div>
                </label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <input
                  type="radio"
                  id="visibility-specific"
                  name="visibility"
                  value="specific"
                  className="w-4 h-4"
                />
                <label htmlFor="visibility-specific" className="flex-1 cursor-pointer">
                  <div className="font-medium">Specific Classes/Sections</div>
                  <div className="text-sm text-muted-foreground">Select specific classes or sections</div>
                </label>
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_urgent"
                checked={isUrgent}
                onCheckedChange={(checked) => setValue('is_urgent', checked as boolean)}
              />
              <Label htmlFor="is_urgent" className="cursor-pointer">
                Mark as Urgent
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_published"
                checked={isPublished}
                onCheckedChange={(checked) => setValue('is_published', checked as boolean)}
              />
              <Label htmlFor="is_published" className="cursor-pointer">
                Publish Immediately
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={isActive}
                onCheckedChange={(checked) => setValue('is_active', checked as boolean)}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active
              </Label>
            </div>
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
            : notice
              ? 'Update Notice'
              : 'Create Notice'}
        </Button>
      </div>
    </form>
  );
};
