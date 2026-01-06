/**
 * Quotation Selection Dialog - Compare quotations and select the best one
 * Shows comparable cards with: grand total, delivery days, terms, rating, warnings
 * One-click "Select this quotation" to mark as selected
 */

import { useState } from 'react';
import { CheckCircle, DollarSign, Truck, FileText, AlertTriangle, Star, Loader2, Award, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Card, CardContent } from '../../../components/ui/card';
import { useRequirementQuotations, useMarkQuotationSelected } from '../../../hooks/useProcurement';

interface QuotationSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requirementId: number | null;
  onSuccess?: () => void;
}

export const QuotationSelectionDialog = ({
  open,
  onOpenChange,
  requirementId,
  onSuccess,
}: QuotationSelectionDialogProps) => {
  const [selectedQuotationId, setSelectedQuotationId] = useState<number | null>(null);

  const { data: quotations, isLoading } = useRequirementQuotations(requirementId || 0);
  const markSelectedMutation = useMarkQuotationSelected();

  const handleSelectQuotation = async (quotationId: number) => {
    try {
      await markSelectedMutation.mutateAsync({ id: quotationId, data: { is_selected: true } });
      toast.success('Quotation selected! You can now create a Purchase Order.');
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Select quotation error:', error);
      toast.error(error.message || 'Failed to select quotation');
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getWarnings = (quotation: any) => {
    const warnings = [];

    if (quotation.delivery_days > 30) {
      warnings.push('Long delivery time (>30 days)');
    }

    if (!quotation.vendor_verified) {
      warnings.push('Vendor not verified');
    }

    if (quotation.total_amount > quotation.requirement_estimate * 1.2) {
      warnings.push('Price exceeds estimate by >20%');
    }

    return warnings;
  };

  const getLowestPrice = () => {
    if (!quotations || quotations.length === 0) return null;
    return Math.min(...quotations.map((q: any) => q.total_amount || 0));
  };

  const getFastestDelivery = () => {
    if (!quotations || quotations.length === 0) return null;
    return Math.min(...quotations.map((q: any) => q.delivery_days || 999));
  };

  const lowestPrice = getLowestPrice();
  const fastestDelivery = getFastestDelivery();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-4 shrink-0 border-b">
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Compare & Select Quotation
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Review quotations from vendors and select the best one to proceed with Purchase Order creation
          </p>
        </DialogHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-muted-foreground">Loading quotations...</p>
            </div>
          </div>
        ) : quotations && quotations.length > 0 ? (
          <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
            {/* Info Alert */}
            <Alert className="mb-6">
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>Compare quotations carefully.</strong> Review pricing, delivery times, and vendor terms before selecting.
                The selected quotation will be used to create a Purchase Order.
              </AlertDescription>
            </Alert>

            {/* Quotations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quotations.map((quotation: any) => {
                const warnings = getWarnings(quotation);
                const isLowestPrice = quotation.total_amount === lowestPrice;
                const isFastestDelivery = quotation.delivery_days === fastestDelivery;
                const isSelected = quotation.is_selected;

                return (
                  <Card
                    key={quotation.id}
                    className={`relative transition-all ${
                      isSelected
                        ? 'border-green-500 border-2 shadow-lg'
                        : selectedQuotationId === quotation.id
                        ? 'border-primary border-2'
                        : 'hover:shadow-md'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    )}

                    <CardContent className="p-5">
                      {/* Vendor Info */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{quotation.vendor_name}</h3>
                            <p className="text-xs text-muted-foreground">{quotation.quotation_number}</p>
                          </div>
                          {quotation.vendor_verified && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>

                        {/* Rating */}
                        {quotation.vendor_rating && (
                          <div className="flex items-center gap-1">
                            {getRatingStars(quotation.vendor_rating)}
                            <span className="text-xs text-muted-foreground ml-1">
                              ({quotation.vendor_rating}/5)
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Price - Highlighted */}
                      <div className="bg-primary/5 rounded-lg p-4 mb-4 relative">
                        {isLowestPrice && (
                          <div className="absolute -top-2 -right-2">
                            <Badge variant="default" className="text-xs">
                              <Award className="h-3 w-3 mr-1" />
                              Lowest Price
                            </Badge>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mb-1">Grand Total</div>
                        <div className="text-3xl font-bold text-primary">
                          ₹{quotation.total_amount?.toLocaleString() || '0'}
                        </div>
                        {quotation.tax_amount > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            (incl. ₹{quotation.tax_amount?.toLocaleString()} tax)
                          </div>
                        )}
                      </div>

                      {/* Key Details */}
                      <div className="space-y-3 mb-4">
                        {/* Delivery Time */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Delivery</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{quotation.delivery_days} days</span>
                            {isFastestDelivery && (
                              <Badge variant="secondary" className="text-xs">Fastest</Badge>
                            )}
                          </div>
                        </div>

                        {/* Valid Until */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Valid Until</span>
                          </div>
                          <span className="font-medium">
                            {quotation.valid_until ? new Date(quotation.valid_until).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>

                        {/* Payment Terms */}
                        {quotation.payment_terms && (
                          <div className="pt-2 border-t">
                            <div className="text-xs text-muted-foreground mb-1">Payment Terms</div>
                            <div className="text-sm">{quotation.payment_terms}</div>
                          </div>
                        )}

                        {/* Warranty */}
                        {quotation.warranty_period && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Warranty</span>
                            <span className="font-medium">{quotation.warranty_period}</span>
                          </div>
                        )}
                      </div>

                      {/* Warnings */}
                      {warnings.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                            <div className="space-y-1">
                              {warnings.map((warning, idx) => (
                                <p key={idx} className="text-xs text-yellow-800">
                                  {warning}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {quotation.notes && (
                        <div className="mb-4">
                          <div className="text-xs text-muted-foreground mb-1">Notes</div>
                          <div className="text-sm bg-muted/30 rounded p-2">{quotation.notes}</div>
                        </div>
                      )}

                      {/* Action Button */}
                      <Button
                        className="w-full"
                        variant={isSelected ? 'outline' : 'default'}
                        disabled={isSelected || markSelectedMutation.isPending}
                        onClick={() => handleSelectQuotation(quotation.id)}
                      >
                        {markSelectedMutation.isPending && selectedQuotationId === quotation.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Selecting...
                          </>
                        ) : isSelected ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Selected
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Select This Quotation
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-xs text-blue-600 mb-1">Total Quotations</div>
                <div className="text-2xl font-bold text-blue-900">{quotations.length}</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-xs text-green-600 mb-1">Lowest Price</div>
                <div className="text-2xl font-bold text-green-900">₹{lowestPrice?.toLocaleString()}</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-xs text-purple-600 mb-1">Fastest Delivery</div>
                <div className="text-2xl font-bold text-purple-900">{fastestDelivery} days</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">No quotations received yet</p>
              <p className="text-sm text-muted-foreground">
                Quotations from vendors will appear here for comparison
              </p>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="shrink-0 border-t bg-background">
          <div className="p-4 flex items-center justify-between gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <div className="text-sm text-muted-foreground">
              {quotations?.filter((q: any) => q.is_selected).length > 0
                ? 'Quotation selected - you can now create a Purchase Order'
                : 'Select a quotation to proceed'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
