/**
 * Exam Types Page
 * Manage different types of examinations
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useExamTypes } from '../../hooks/useExamination';
import { ExamTypeForm } from './forms';

const ExamTypesPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedExamType, setSelectedExamType] = useState<any | null>(null);

  // Fetch exam types using real API
  const { data, isLoading, error, refetch } = useExamTypes(filters);

  const columns: Column<any>[] = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'name', label: 'Exam Type', sortable: true },
    {
      key: 'description',
      label: 'Description',
      render: (type) => (
        <span className="text-sm text-muted-foreground">
          {type.description || '-'}
        </span>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (type) => (
        <Badge variant={type.is_active ? 'success' : 'destructive'}>
          {type.is_active ? 'Active' : 'Inactive'}
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
    setSelectedExamType(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (examType: ExamType) => {
    setSelectedExamType(examType);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = (data: Partial<ExamType>) => {
    console.log('Form submitted:', data);
    // In real implementation, this would call the API
    setIsSidebarOpen(false);
    // Refresh data
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedExamType(null);
  };

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold">Exam Types</h1>
        <p className="text-muted-foreground">Manage different types of examinations</p>
      </div>

      <DataTable
        title="Exam Types List"
        description="Configure exam types and their weightages"
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
        searchPlaceholder="Search exam types..."
        addButtonLabel="Add Exam Type"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Exam Type' : selectedExamType?.name || 'Exam Type'}
        mode={sidebarMode}
        width="lg"
      >
        {sidebarMode === 'view' && selectedExamType ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Code</h3>
              <p className="mt-1 text-lg">{selectedExamType.code}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="mt-1 text-lg">{selectedExamType.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1">{selectedExamType.description || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedExamType.is_active ? 'success' : 'destructive'}>
                  {selectedExamType.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            <div className="pt-4">
              <Button onClick={handleEdit}>Edit</Button>
            </div>
          </div>
        ) : (
          <ExamTypeForm
            examType={sidebarMode === 'edit' ? selectedExamType : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default ExamTypesPage;
