/**
 * Fee Structures Page
 */

import { useState } from 'react';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { FeeStructureForm } from './forms';
import { FeeStructure, mockFeeStructuresPaginated } from '../../data/feesMockData';

const FeeStructuresPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);

  const columns: Column<FeeStructure>[] = [
    { key: 'name', label: 'Structure Name', sortable: true },
    { key: 'session_name', label: 'Session', sortable: true },
    { key: 'program_name', label: 'Program', sortable: true },
    { key: 'class_name', label: 'Class' },
    {
      key: 'total_amount',
      label: 'Total Amount',
      render: (structure) => <span className="font-semibold">₹{structure.total_amount.toLocaleString()}</span>,
      sortable: true,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (structure) => (
        <Badge variant={structure.is_active ? 'success' : 'destructive'}>
          {structure.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
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
    setSelectedStructure(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (structure: FeeStructure) => {
    setSelectedStructure(structure);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = (data: Partial<FeeStructure>) => {
    console.log('Form submitted:', data);
    setIsSidebarOpen(false);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedStructure(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fee Structures</h1>
        <p className="text-muted-foreground">Manage fee structures for different programs and classes</p>
      </div>

      <DataTable
        title="Fee Structures"
        description="View and manage fee structures"
        columns={columns}
        data={mockFeeStructuresPaginated}
        isLoading={false}
        error={null}
        onRefresh={() => {}}
        onAdd={handleAddNew}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search structures..."
        addButtonLabel="Add Structure"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Fee Structure' : selectedStructure?.name || 'Fee Structure'}
        mode={sidebarMode}
        width="lg"
      >
        {sidebarMode === 'view' && selectedStructure ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Structure Name</h3>
              <p className="mt-1 text-lg font-semibold">{selectedStructure.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Academic Session</h3>
                <p className="mt-1">{selectedStructure.session_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Program</h3>
                <p className="mt-1">{selectedStructure.program_name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Class</h3>
                <p className="mt-1">{selectedStructure.class_name || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Semester</h3>
                <p className="mt-1">{selectedStructure.semester || 'N/A'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Amount</h3>
              <p className="mt-1 text-2xl font-bold text-green-600">₹{selectedStructure.total_amount.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Effective From</h3>
                <p className="mt-1">{selectedStructure.effective_from}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Effective To</h3>
                <p className="mt-1">{selectedStructure.effective_to || 'N/A'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedStructure.is_active ? 'success' : 'destructive'}>
                  {selectedStructure.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            <div className="pt-4">
              <Button onClick={handleEdit}>Edit</Button>
            </div>
          </div>
        ) : (
          <FeeStructureForm
            feeStructure={sidebarMode === 'edit' ? selectedStructure : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default FeeStructuresPage;
