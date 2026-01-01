import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Checkbox } from '../../../components/ui/checkbox';

interface SalaryStructureFormProps {
  item: any | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const SalaryStructureForm = ({ item, onSubmit, onCancel }: SalaryStructureFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm({
    defaultValues: item || {
      effective_from: '',
      effective_to: '',
      basic_salary: '',
      hra: '',
      da: '',
      other_allowances: '',
      gross_salary: '',
      is_current: false,
      is_active: true
    },
  });

  const isCurrent = watch('is_current');
  const isActive = watch('is_active');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="effective_from">Effective From *</Label>
        <Input id="effective_from" type="date" {...register('effective_from', { required: 'Effective from is required' })} />
        {errors.effective_from && <p className="text-sm text-destructive">{errors.effective_from.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="effective_to">Effective To</Label>
        <Input id="effective_to" type="date" {...register('effective_to')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="basic_salary">Basic Salary *</Label>
        <Input id="basic_salary" type="number" step="0.01" {...register('basic_salary', { required: 'Basic salary is required' })} placeholder="e.g., 50000" />
        {errors.basic_salary && <p className="text-sm text-destructive">{errors.basic_salary.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="hra">HRA *</Label>
        <Input id="hra" type="number" step="0.01" {...register('hra', { required: 'HRA is required' })} placeholder="e.g., 10000" />
        {errors.hra && <p className="text-sm text-destructive">{errors.hra.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="da">DA *</Label>
        <Input id="da" type="number" step="0.01" {...register('da', { required: 'DA is required' })} placeholder="e.g., 5000" />
        {errors.da && <p className="text-sm text-destructive">{errors.da.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="other_allowances">Other Allowances *</Label>
        <Input id="other_allowances" type="number" step="0.01" {...register('other_allowances', { required: 'Other allowances is required' })} placeholder="e.g., 3000" />
        {errors.other_allowances && <p className="text-sm text-destructive">{errors.other_allowances.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="gross_salary">Gross Salary *</Label>
        <Input id="gross_salary" type="number" step="0.01" {...register('gross_salary', { required: 'Gross salary is required' })} placeholder="e.g., 68000" />
        {errors.gross_salary && <p className="text-sm text-destructive">{errors.gross_salary.message as string}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="is_current" checked={isCurrent} onCheckedChange={(checked) => setValue('is_current', checked)} />
        <Label htmlFor="is_current" className="cursor-pointer">Current</Label>
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
