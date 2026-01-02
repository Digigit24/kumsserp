/**
 * Procurement Quotation Form
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
import { VendorDropdown } from '../../../../components/common/VendorDropdown';

interface QuotationFormProps {
  quotation?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const QuotationForm = ({ quotation, onSubmit, onCancel }: QuotationFormProps) => {
  const { register, handleSubmit, formState: { errors }, control, watch, setValue } = useForm({
    defaultValues: quotation || {
      quotation_number: '',
      quotation_date: '',
      supplier: '',
      requirement: '',
      status: 'received',
      is_selected: false,
      valid_until: '',
      payment_terms: '',
      delivery_terms: '',
      remarks: '',
      terms_conditions: '',
      metadata: '',
      is_active: true,
      items: [
        {
          item_description: '',
          quantity: 0,
          unit: '',
          unit_price: '',
          discount_percent: '',
          discount_amount: '',
          tax_percent: '',
          tax_amount: '',
          total: '',
          specifications: '',
          remarks: '',
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
              <Label htmlFor="quotation_number" required>Quotation Number</Label>
              <Input
                id="quotation_number"
                {...register('quotation_number', { required: 'Quotation number is required' })}
              />
              {errors.quotation_number && <p className="text-sm text-red-500">{errors.quotation_number.message}</p>}
            </div>

            <div>
              <Label htmlFor="quotation_date" required>Quotation Date</Label>
              <Input
                id="quotation_date"
                type="date"
                {...register('quotation_date', { required: 'Quotation date is required' })}
              />
              {errors.quotation_date && <p className="text-sm text-red-500">{errors.quotation_date.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Controller
                name="supplier"
                control={control}
                rules={{ required: 'Supplier is required' }}
                render={({ field }) => (
                  <VendorDropdown
                    value={field.value}
                    onChange={field.onChange}
                    required
                    error={errors.supplier?.message}
                  />
                )}
              />
            </div>

            <div>
              <Label htmlFor="requirement">Requirement ID</Label>
              <Input
                id="requirement"
                type="number"
                {...register('requirement', { valueAsNumber: true })}
                placeholder="Related requirement"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valid_until">Valid Until</Label>
              <Input
                id="valid_until"
                type="date"
                {...register('valid_until')}
              />
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
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="selected">Selected</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="payment_terms">Payment Terms</Label>
            <Textarea
              id="payment_terms"
              {...register('payment_terms')}
              rows={2}
              placeholder="e.g., Net 30 days, 50% advance"
            />
          </div>

          <div>
            <Label htmlFor="delivery_terms">Delivery Terms</Label>
            <Textarea
              id="delivery_terms"
              {...register('delivery_terms')}
              rows={2}
              placeholder="e.g., FOB, CIF, delivery within 15 days"
            />
          </div>

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              {...register('remarks')}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="terms_conditions">Terms & Conditions</Label>
            <Textarea
              id="terms_conditions"
              {...register('terms_conditions')}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_selected"
              {...register('is_selected')}
            />
            <Label htmlFor="is_selected">Mark as Selected</Label>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quotation Items</CardTitle>
          <Button
            type="button"
            size="sm"
            onClick={() =>
              append({
                item_description: '',
                quantity: 0,
                unit: '',
                unit_price: '',
                discount_percent: '',
                discount_amount: '',
                tax_percent: '',
                tax_amount: '',
                total: '',
                specifications: '',
                remarks: '',
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
                    <Label htmlFor={`items.${index}.unit_price`} required>Unit Price</Label>
                    <Input
                      id={`items.${index}.unit_price`}
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.unit_price`, { required: 'Required' })}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor={`items.${index}.discount_percent`}>Discount %</Label>
                    <Input
                      id={`items.${index}.discount_percent`}
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.discount_percent`)}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`items.${index}.discount_amount`}>Discount Amt</Label>
                    <Input
                      id={`items.${index}.discount_amount`}
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.discount_amount`)}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`items.${index}.tax_percent`}>Tax %</Label>
                    <Input
                      id={`items.${index}.tax_percent`}
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.tax_percent`)}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`items.${index}.tax_amount`}>Tax Amount</Label>
                    <Input
                      id={`items.${index}.tax_amount`}
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.tax_amount`)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`items.${index}.total`}>Total Amount</Label>
                  <Input
                    id={`items.${index}.total`}
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.total`)}
                    placeholder="0.00"
                  />
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
          {quotation ? 'Update' : 'Create'} Quotation
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
