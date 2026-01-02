/**
 * Procurement Requirement Form
 */

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Switch } from '../../../../components/ui/switch';
import { Textarea } from '../../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { CentralStoreDropdown } from '../../../../components/common/CentralStoreDropdown';

interface RequirementFormProps {
  requirement?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const RequirementForm = ({ requirement, onSubmit, onCancel }: RequirementFormProps) => {
  const { register, handleSubmit, formState: { errors }, control, watch, setValue } = useForm({
    defaultValues: requirement || {
      requirement_number: '',
      title: '',
      description: '',
      required_by_date: '',
      urgency: 'low',
      status: 'draft',
      estimated_budget: '',
      justification: '',
      metadata: '',
      central_store: '',
      approval_request: '',
      is_active: true,
      items: [
        {
          item_description: '',
          quantity: 0,
          unit: '',
          estimated_unit_price: '',
          estimated_total: '',
          specifications: '',
          remarks: '',
          category: '',
          is_active: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="requirement_number" required>Requirement Number</Label>
              <Input
                id="requirement_number"
                {...register('requirement_number', { required: 'Requirement number is required' })}
              />
              {errors.requirement_number && <p className="text-sm text-red-500">{errors.requirement_number.message}</p>}
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

          <div>
            <Label htmlFor="title" required>Title</Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="description" required>Description</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              rows={3}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="urgency" required>Urgency</Label>
              <Select
                defaultValue={watch('urgency')}
                onValueChange={(value) => setValue('urgency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
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
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="quotation_received">Quotation Received</SelectItem>
                  <SelectItem value="po_created">PO Created</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimated_budget">Estimated Budget</Label>
              <Input
                id="estimated_budget"
                type="number"
                step="0.01"
                {...register('estimated_budget')}
                placeholder="0.00"
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
            <Label htmlFor="justification">Justification</Label>
            <Textarea
              id="justification"
              {...register('justification')}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Requirement Items</CardTitle>
          <Button
            type="button"
            size="sm"
            onClick={() =>
              append({
                item_description: '',
                quantity: 0,
                unit: '',
                estimated_unit_price: '',
                estimated_total: '',
                specifications: '',
                remarks: '',
                category: '',
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
                  <Label htmlFor={`items.${index}.item_description`} required>Item Description</Label>
                  <Input
                    id={`items.${index}.item_description`}
                    {...register(`items.${index}.item_description`, { required: 'Item description is required' })}
                  />
                  {errors.items?.[index]?.item_description && (
                    <p className="text-sm text-red-500">{errors.items[index].item_description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`items.${index}.quantity`} required>Quantity</Label>
                    <Input
                      id={`items.${index}.quantity`}
                      type="number"
                      {...register(`items.${index}.quantity`, {
                        required: 'Required',
                        valueAsNumber: true,
                      })}
                    />
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
                    <Label htmlFor={`items.${index}.category`}>Category ID</Label>
                    <Input
                      id={`items.${index}.category`}
                      type="number"
                      {...register(`items.${index}.category`, { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`items.${index}.estimated_unit_price`}>Est. Unit Price</Label>
                    <Input
                      id={`items.${index}.estimated_unit_price`}
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.estimated_unit_price`)}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`items.${index}.estimated_total`}>Est. Total</Label>
                    <Input
                      id={`items.${index}.estimated_total`}
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.estimated_total`)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`items.${index}.specifications`}>Specifications</Label>
                  <Textarea
                    id={`items.${index}.specifications`}
                    {...register(`items.${index}.specifications`)}
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
          {requirement ? 'Update' : 'Create'} Requirement
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
