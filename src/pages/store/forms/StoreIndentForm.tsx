/**
 * Store Indent Form - Create/Edit store indents
 */

import { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { CollegeDropdown } from '../../../components/common/CollegeDropdown';
import { CentralStoreDropdown } from '../../../components/common/CentralStoreDropdown';
import { CentralStoreItemDropdown } from '../../../components/common/CentralStoreItemDropdown';
import { UserSearchableDropdown } from '../../../components/common/UserSearchableDropdown';
import { Alert, AlertDescription } from '../../../components/ui/alert';

interface StoreIndentFormProps {
  indent?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const StoreIndentForm = ({ indent, onSubmit, onCancel }: StoreIndentFormProps) => {
  const { register, handleSubmit, formState: { errors }, control, watch, setValue } = useForm({
    defaultValues: indent || {
      indent_number: '',
      required_by_date: '',
      priority: 'low',
      justification: '',
      status: 'draft',
      approved_date: '',
      rejection_reason: '',
      attachments: '',
      remarks: '',
      college: '',
      requesting_store_manager: '',
      central_store: '',
      approval_request: '',
      approved_by: '',
      is_active: true,
      items: [
        {
          requested_quantity: 0,
          approved_quantity: 0,
          issued_quantity: 0,
          pending_quantity: 0,
          unit: '',
          justification: '',
          remarks: '',
          central_store_item: '',
          is_active: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const centralStoreId = watch('central_store');

  // Clear item selections when central store changes
  useEffect(() => {
    if (centralStoreId && !indent) {
      // Only clear items for new forms, not when editing
      fields.forEach((_, index) => {
        setValue(`items.${index}.central_store_item`, '');
      });
    }
  }, [centralStoreId, indent]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Warning when no central store selected */}
      {!centralStoreId && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a Central Store first before adding items.
          </AlertDescription>
        </Alert>
      )}
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="indent_number" required>Indent Number</Label>
              <Input
                id="indent_number"
                {...register('indent_number', { required: 'Indent number is required' })}
              />
              {errors.indent_number && <p className="text-sm text-red-500">{errors.indent_number.message}</p>}
            </div>

            <div>
              <Label htmlFor="required_by_date" required>Required By Date</Label>
              <Input
                id="required_by_date"
                type="date"
                {...register('required_by_date', { required: 'Required by date is required' })}
              />
              {errors.required_by_date && <p className="text-sm text-red-500">{errors.required_by_date.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority" required>Priority</Label>
              <Select
                defaultValue={watch('priority')}
                onValueChange={(value) => setValue('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue={watch('status')}
                onValueChange={(value) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending_college_approval">Pending College Approval</SelectItem>
                  <SelectItem value="pending_super_admin">Pending Super Admin</SelectItem>
                  <SelectItem value="super_admin_approved">Super Admin Approved</SelectItem>
                  <SelectItem value="rejected_by_college">Rejected by College</SelectItem>
                  <SelectItem value="rejected_by_super_admin">Rejected by Super Admin</SelectItem>
                  <SelectItem value="partially_fulfilled">Partially Fulfilled</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="justification" required>Justification</Label>
            <Textarea
              id="justification"
              {...register('justification', { required: 'Justification is required' })}
              rows={3}
            />
            {errors.justification && <p className="text-sm text-red-500">{errors.justification.message}</p>}
          </div>

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              {...register('remarks')}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Related Entities */}
      <Card>
        <CardHeader>
          <CardTitle>Related Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Controller
                name="college"
                control={control}
                rules={{ required: 'College is required' }}
                render={({ field }) => (
                  <CollegeDropdown
                    value={field.value}
                    onChange={field.onChange}
                    required
                    error={errors.college?.message}
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="central_store"
                control={control}
                rules={{ required: 'Central store is required' }}
                render={({ field }) => (
                  <CentralStoreDropdown
                    value={field.value}
                    onChange={field.onChange}
                    required
                    error={errors.central_store?.message}
                  />
                )}
              />
            </div>
          </div>

          <div>
            <Controller
              name="requesting_store_manager"
              control={control}
              render={({ field }) => (
                <UserSearchableDropdown
                  value={field.value}
                  onChange={field.onChange}
                  userType="store_manager"
                  college={watch('college')}
                  label="Requesting Store Manager"
                  required={false}
                  error={errors.requesting_store_manager?.message}
                />
              )}
            />
          </div>

          <div>
            <Label htmlFor="attachments">Attachments (URL)</Label>
            <Input
              id="attachments"
              {...register('attachments')}
              placeholder="Attachment URL"
            />
          </div>
        </CardContent>
      </Card>

      {/* Indent Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Indent Items</CardTitle>
          <Button
            type="button"
            size="sm"
            onClick={() =>
              append({
                requested_quantity: 0,
                approved_quantity: 0,
                issued_quantity: 0,
                pending_quantity: 0,
                unit: '',
                justification: '',
                remarks: '',
                central_store_item: '',
                is_active: true,
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Item {index + 1}</CardTitle>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Controller
                    name={`items.${index}.central_store_item`}
                    control={control}
                    rules={{ required: 'Item is required' }}
                    render={({ field }) => (
                      <CentralStoreItemDropdown
                        value={field.value}
                        onChange={field.onChange}
                        centralStoreId={watch('central_store')}
                        required
                        error={errors.items?.[index]?.central_store_item?.message}
                        label="Central Store Item"
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor={`items.${index}.requested_quantity`} required>Requested Qty</Label>
                    <Input
                      id={`items.${index}.requested_quantity`}
                      type="number"
                      {...register(`items.${index}.requested_quantity`, {
                        required: 'Required',
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`items.${index}.approved_quantity`}>Approved Qty</Label>
                    <Input
                      id={`items.${index}.approved_quantity`}
                      type="number"
                      {...register(`items.${index}.approved_quantity`, { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`items.${index}.issued_quantity`}>Issued Qty</Label>
                    <Input
                      id={`items.${index}.issued_quantity`}
                      type="number"
                      {...register(`items.${index}.issued_quantity`, { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`items.${index}.pending_quantity`}>Pending Qty</Label>
                    <Input
                      id={`items.${index}.pending_quantity`}
                      type="number"
                      {...register(`items.${index}.pending_quantity`, { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`items.${index}.unit`} required>Unit</Label>
                  <Input
                    id={`items.${index}.unit`}
                    {...register(`items.${index}.unit`, { required: 'Unit is required' })}
                    placeholder="e.g., kg, pcs, ltr"
                  />
                </div>

                <div>
                  <Label htmlFor={`items.${index}.justification`}>Justification</Label>
                  <Textarea
                    id={`items.${index}.justification`}
                    {...register(`items.${index}.justification`)}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor={`items.${index}.remarks`}>Remarks</Label>
                  <Textarea
                    id={`items.${index}.remarks`}
                    {...register(`items.${index}.remarks`)}
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`items.${index}.is_active`}
                    {...register(`items.${index}.is_active`)}
                  />
                  <Label htmlFor={`items.${index}.is_active`}>Active</Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Active Status */}
      <div className="flex items-center space-x-2">
        <Switch id="is_active" {...register('is_active')} />
        <Label htmlFor="is_active">Active</Label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {indent ? 'Update' : 'Create'} Indent
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
