/**
 * Marks Registers Page
 * View consolidated marks registers
 */

import { useState } from 'react';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { MarksRegisterForm } from './forms';
import { MarksRegister, mockMarksRegistersPaginated } from '../../data/examinationMockData';

const MarksRegistersPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedRegister, setSelectedRegister] = useState<MarksRegister | null>(null);

  const columns: Column<MarksRegister>[] = [
    { key: 'class_name', label: 'Class', sortable: true },
    { key: 'subject_name', label: 'Subject', sortable: true },
    {
      key: 'total_students',
      label: 'Total Students',
      render: (register) => <Badge variant="outline">{register.total_students}</Badge>,
      sortable: true,
    },
    {
      key: 'students_appeared',
      label: 'Appeared',
      render: (register) => <Badge variant="secondary">{register.students_appeared}</Badge>,
      sortable: true,
    },
    {
      key: 'students_passed',
      label: 'Passed',
      render: (register) => <Badge variant="success">{register.students_passed}</Badge>,
      sortable: true,
    },
    {
      key: 'pass_percentage',
      label: 'Pass %',
      render: (register) => (
        <Badge variant={register.pass_percentage >= 75 ? 'success' : 'warning'}>
          {register.pass_percentage.toFixed(1)}%
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'is_verified',
      label: 'Verified',
      render: (register) => (
        <Badge variant={register.is_verified ? 'success' : 'outline'}>
          {register.is_verified ? 'Yes' : 'No'}
        </Badge>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'is_verified',
      label: 'Verification Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'true', label: 'Verified' },
        { value: 'false', label: 'Unverified' },
      ],
    },
  ];

  const handleAddNew = () => {
    setSelectedRegister(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (register: MarksRegister) => {
    setSelectedRegister(register);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = (data: Partial<MarksRegister>) => {
    console.log('Form submitted:', data);
    setIsSidebarOpen(false);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedRegister(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marks Registers</h1>
        <p className="text-muted-foreground">View consolidated marks registers for exams</p>
      </div>

      <DataTable
        title="Marks Registers"
        description="View and manage exam marks registers"
        columns={columns}
        data={mockMarksRegistersPaginated}
        isLoading={false}
        error={null}
        onRefresh={() => {}}
        onAdd={handleAddNew}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search registers..."
        addButtonLabel="Create Register"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Marks Register' : `${selectedRegister?.class_name || 'Marks'} Register`}
        mode={sidebarMode}
        width="xl"
      >
        {sidebarMode === 'view' && selectedRegister ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Class</h3>
                <p className="mt-1 text-lg">{selectedRegister.class_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                <p className="mt-1 text-lg">{selectedRegister.subject_name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Students</h3>
                <p className="mt-1 text-2xl font-bold">{selectedRegister.total_students}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Students Appeared</h3>
                <p className="mt-1 text-2xl font-bold">{selectedRegister.students_appeared}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Students Passed</h3>
                <p className="mt-1 text-2xl font-bold text-green-600">{selectedRegister.students_passed}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Pass Percentage</h3>
                <p className="mt-1 text-2xl font-bold text-green-600">{selectedRegister.pass_percentage.toFixed(1)}%</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Highest Marks</h3>
                <p className="mt-1 text-lg font-semibold">{selectedRegister.highest_marks}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Lowest Marks</h3>
                <p className="mt-1 text-lg font-semibold">{selectedRegister.lowest_marks}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Average Marks</h3>
                <p className="mt-1 text-lg font-semibold">{selectedRegister.average_marks.toFixed(2)}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Verified</h3>
              <p className="mt-1">
                <Badge variant={selectedRegister.is_verified ? 'success' : 'outline'}>
                  {selectedRegister.is_verified ? 'Verified' : 'Unverified'}
                </Badge>
              </p>
            </div>
            {selectedRegister.verified_by && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Verified By</h3>
                <p className="mt-1">{selectedRegister.verified_by}</p>
              </div>
            )}
            {selectedRegister.remarks && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Remarks</h3>
                <p className="mt-1">{selectedRegister.remarks}</p>
              </div>
            )}
            <div className="pt-4">
              <Button onClick={handleEdit}>Edit</Button>
            </div>
          </div>
        ) : (
          <MarksRegisterForm
            marksRegister={sidebarMode === 'edit' ? selectedRegister : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default MarksRegistersPage;
