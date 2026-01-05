/**
 * Create Requirement Dialog - Inline requirement creation
 * Simple form to create new procurement requirement with items
 */

import { useState } from 'react';
import { Plus, X, Package, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { useCreateRequirement } from '../../../hooks/useProcurement';

interface CreateRequirementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface RequirementItem {
  item_name: string;
  quantity: number;
  unit: string;
  estimated_price: number;
  specifications: string;
}

export const CreateRequirementDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateRequirementDialogProps) => {
  const [formData, setFormData] = useState({
    requirement_number: `REQ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    required_by_date: '',
    priority: 'normal',
    purpose: '',
    department: '',
  });
  const [items, setItems] = useState<RequirementItem[]>([
    { item_name: '', quantity: 0, unit: '', estimated_price: 0, specifications: '' },
  ]);

  const createMutation = useCreateRequirement();

  const handleAddItem = () => {
    setItems([...items, { item_name: '', quantity: 0, unit: '', estimated_price: 0, specifications: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof RequirementItem, value: any) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.required_by_date) {
      toast.error('Please select required by date');
      return;
    }

    if (items.length === 0 || items.every(item => !item.item_name)) {
      toast.error('Please add at least one item');
      return;
    }

    try {
      const reqData = {
        ...formData,
        status: 'draft',
        items: items
          .filter(item => item.item_name.trim())
          .map(item => ({
            item_name: item.item_name,
            quantity: item.quantity,
            unit: item.unit,
            estimated_price: item.estimated_price,
            specifications: item.specifications,
          })),
      };

      await createMutation.mutateAsync(reqData);
      toast.success('Requirement created successfully!');
      onSuccess?.();
      onOpenChange(false);

      // Reset form
      setFormData({
        requirement_number: `REQ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        required_by_date: '',
        priority: 'normal',
        purpose: '',
        department: '',
      });
      setItems([{ item_name: '', quantity: 0, unit: '', estimated_price: 0, specifications: '' }]);
    } catch (error: any) {
      console.error('Create requirement error:', error);
      toast.error(error.message || 'Failed to create requirement');
    }
  };

  const totalEstimate = items.reduce((sum, item) => sum + (item.quantity * item.estimated_price), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-4 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Create Procurement Requirement
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label required>Requirement Number</Label>
              <Input
                value={formData.requirement_number}
                onChange={(e) => setFormData({ ...formData, requirement_number: e.target.value })}
                placeholder="REQ-2026-0001"
              />
            </div>
            <div>
              <Label required>Required By Date</Label>
              <Input
                type="date"
                value={formData.required_by_date}
                onChange={(e) => setFormData({ ...formData, required_by_date: e.target.value })}
              />
            </div>
            <div>
              <Label required>Priority</Label>
              <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Department</Label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Department name"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label>Purpose / Justification</Label>
            <Textarea
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="Explain the purpose of this requirement..."
              rows={3}
            />
          </div>

          {/* Items Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-semibold">Requirement Items</Label>
              <Button size="sm" variant="outline" onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  {items.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}

                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4">
                      <Label className="text-xs">Item Name *</Label>
                      <Input
                        value={item.item_name}
                        onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                        placeholder="Item name"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Quantity *</Label>
                      <Input
                        type="number"
                        value={item.quantity || ''}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Unit *</Label>
                      <Input
                        value={item.unit}
                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                        placeholder="pcs, kg, etc"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Est. Price</Label>
                      <Input
                        type="number"
                        value={item.estimated_price || ''}
                        onChange={(e) => handleItemChange(index, 'estimated_price', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Subtotal</Label>
                      <div className="h-10 flex items-center font-semibold">
                        ₹{(item.quantity * item.estimated_price).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <Label className="text-xs">Specifications</Label>
                    <Textarea
                      value={item.specifications}
                      onChange={(e) => handleItemChange(index, 'specifications', e.target.value)}
                      placeholder="Technical specifications, brand preferences, etc."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t flex justify-end">
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Estimated Total</p>
                <p className="text-2xl font-bold">₹{totalEstimate.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="shrink-0 border-t bg-background">
          <div className="p-4 flex items-center justify-between gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Package className="h-4 w-4 mr-2" />
              Create Requirement
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
