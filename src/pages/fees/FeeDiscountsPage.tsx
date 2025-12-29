/**
 * Fee Discounts Page
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useFeeDiscounts } from '../../hooks/useFees';
import { FeeDiscountForm } from './forms';

const FeeDiscountsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedDiscount, setSelectedDiscount] = useState<any | null>(null);

  // Fetch fee discounts using real API
  const { data, isLoading, error, refetch } = useFeeDiscounts(filters);

  const columns: Column<any>[] = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'name', label: 'Discount Name', sortable: true },
    {
      key: 'discount_type',
      label: 'Type',
      render: (discount) => (
        <Badge variant="secondary">
          {discount.discount_type === 'percentage' ? 'Percentage' : 'Fixed'}
        </Badge>
      ),
    },
    {
      key: 'discount_value',
      label: 'Value',
      render: (discount) => (
        <span className="font-semibold">
          {discount.discount_type === 'percentage' ? `${discount.discount_value}%` : `₹${discount.discount_value}`}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (discount) => (
        <Badge variant={discount.is_active ? 'success' : 'destructive'}>
          {discount.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'discount_type',
      label: 'Type',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'percentage', label: 'Percentage' },
        { value: 'fixed', label: 'Fixed' },
      ],
    },
    {
      name: 'is_active',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' },
      ],
    },
  ];

  const handleAddNew = () => {
    setSelectedDiscount(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (discount: FeeDiscount) => {
    setSelectedDiscount(discount);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = (data: Partial<FeeDiscount>) => {
    console.log('Form submitted:', data);
    setIsSidebarOpen(false);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedDiscount(null);
  };

  return (
    <div className="">
      <DataTable
        title="Fee Discounts"
        description="View and manage fee discounts"
        columns={columns}
        data={data}
        isLoading={isLoading}
        error={error?.message}
        onRefresh={refetch}
        onAdd={handleAddNew}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search discounts..."
        addButtonLabel="Add Discount"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Fee Discount' : selectedDiscount?.name || 'Fee Discount'}
        mode={sidebarMode}
      >
        {sidebarMode === 'view' && selectedDiscount ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Code</h3>
                <p className="mt-1 text-lg">{selectedDiscount.code}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                <p className="mt-1">
                  <Badge variant="secondary">
                    {selectedDiscount.discount_type === 'percentage' ? 'Percentage' : 'Fixed'}
                  </Badge>
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="mt-1 text-lg font-semibold">{selectedDiscount.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Discount Value</h3>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {selectedDiscount.discount_type === 'percentage'
                  ? `${selectedDiscount.discount_value}%`
                  : `₹${selectedDiscount.discount_value.toLocaleString()}`}
              </p>
            </div>
            {selectedDiscount.max_discount_amount && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Max Discount Amount</h3>
                <p className="mt-1">₹{selectedDiscount.max_discount_amount.toLocaleString()}</p>
              </div>
            )}
            {selectedDiscount.eligibility_criteria && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Eligibility Criteria</h3>
                <p className="mt-1">{selectedDiscount.eligibility_criteria}</p>
              </div>
            )}
            {selectedDiscount.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1">{selectedDiscount.description}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedDiscount.is_active ? 'success' : 'destructive'}>
                  {selectedDiscount.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            <div className="pt-4">
              <Button onClick={handleEdit}>Edit</Button>
            </div>
          </div>
        ) : (
          <FeeDiscountForm
            feeDiscount={sidebarMode === 'edit' ? selectedDiscount : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default FeeDiscountsPage;
