/**
 * Fee Masters Page
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { FeeMaster, mockFeeMastersPaginated } from '../../data/feesMockData';
import { FeeMasterForm } from './forms';

const FeeMastersPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedFeeMaster, setSelectedFeeMaster] = useState<FeeMaster | null>(null);

  const columns: Column<FeeMaster>[] = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'name', label: 'Fee Name', sortable: true },
    { key: 'fee_type', label: 'Type', sortable: true },
    {
      key: 'is_mandatory',
      label: 'Mandatory',
      render: (fee) => <Badge variant={fee.is_mandatory ? 'default' : 'outline'}>{fee.is_mandatory ? 'Yes' : 'No'}</Badge>,
    },
    {
      key: 'is_refundable',
      label: 'Refundable',
      render: (fee) => <Badge variant={fee.is_refundable ? 'success' : 'secondary'}>{fee.is_refundable ? 'Yes' : 'No'}</Badge>,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (fee) => <Badge variant={fee.is_active ? 'success' : 'destructive'}>{fee.is_active ? 'Active' : 'Inactive'}</Badge>,
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'is_mandatory',
      label: 'Mandatory',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'true', label: 'Mandatory' },
        { value: 'false', label: 'Optional' },
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
    setSelectedFeeMaster(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (feeMaster: FeeMaster) => {
    setSelectedFeeMaster(feeMaster);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = (data: Partial<FeeMaster>) => {
    console.log('Form submitted:', data);
    setIsSidebarOpen(false);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedFeeMaster(null);
  };

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold">Fee Masters</h1>
        <p className="text-muted-foreground">Manage fee types and categories</p>
      </div>

      <DataTable
        title="Fee Masters List"
        description="View and manage all fee masters"
        columns={columns}
        data={mockFeeMastersPaginated}
        isLoading={false}
        error={null}
        onRefresh={() => {}}
        onAdd={handleAddNew}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search fees..."
        addButtonLabel="Add Fee Master"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Fee Master' : selectedFeeMaster?.name || 'Fee Master'}
        mode={sidebarMode}
      >
        {sidebarMode === 'view' && selectedFeeMaster ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Code</h3>
                <p className="mt-1 text-lg">{selectedFeeMaster.code}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Fee Type</h3>
                <p className="mt-1 text-lg">{selectedFeeMaster.fee_type}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="mt-1 text-lg font-semibold">{selectedFeeMaster.name}</p>
            </div>
            {selectedFeeMaster.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1">{selectedFeeMaster.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Mandatory</h3>
                <p className="mt-1">
                  <Badge variant={selectedFeeMaster.is_mandatory ? 'default' : 'outline'}>
                    {selectedFeeMaster.is_mandatory ? 'Yes' : 'No'}
                  </Badge>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Refundable</h3>
                <p className="mt-1">
                  <Badge variant={selectedFeeMaster.is_refundable ? 'success' : 'secondary'}>
                    {selectedFeeMaster.is_refundable ? 'Yes' : 'No'}
                  </Badge>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Display Order</h3>
                <p className="mt-1">{selectedFeeMaster.display_order}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <p className="mt-1">
                  <Badge variant={selectedFeeMaster.is_active ? 'success' : 'destructive'}>
                    {selectedFeeMaster.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </p>
              </div>
            </div>
            <div className="pt-4">
              <Button onClick={handleEdit}>Edit</Button>
            </div>
          </div>
        ) : (
          <FeeMasterForm
            feeMaster={sidebarMode === 'edit' ? selectedFeeMaster : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default FeeMastersPage;
