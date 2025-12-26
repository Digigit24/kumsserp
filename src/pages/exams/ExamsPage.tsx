/**
 * Exams Page
 * Manage examinations in the system
 */

import { useState } from 'react';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ExamForm } from './forms';
import { Exam, mockExamsPaginated } from '../../data/examinationMockData';

const ExamsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const columns: Column<Exam>[] = [
    { key: 'name', label: 'Exam Name', sortable: true },
    {
      key: 'start_date',
      label: 'Start Date',
      render: (exam) => new Date(exam.start_date).toLocaleDateString(),
    },
    {
      key: 'end_date',
      label: 'End Date',
      render: (exam) => new Date(exam.end_date).toLocaleDateString(),
    },
    {
      key: 'is_published',
      label: 'Published',
      render: (exam) => (
        <Badge variant={exam.is_published ? 'success' : 'secondary'}>
          {exam.is_published ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (exam) => (
        <Badge variant={exam.is_active ? 'success' : 'destructive'}>
          {exam.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'is_published',
      label: 'Published Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'true', label: 'Published' },
        { value: 'false', label: 'Draft' },
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
    setSelectedExam(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (exam: Exam) => {
    setSelectedExam(exam);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = (data: Partial<Exam>) => {
    console.log('Form submitted:', data);
    setIsSidebarOpen(false);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedExam(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Examinations</h1>
        <p className="text-muted-foreground">Manage examinations and exam schedules</p>
      </div>

      <DataTable
        title="Exam List"
        description="View and manage all examinations"
        columns={columns}
        data={mockExamsPaginated}
        isLoading={false}
        error={null}
        onRefresh={() => {}}
        onAdd={handleAddNew}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search exams..."
        addButtonLabel="Add Exam"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Exam' : selectedExam?.name || 'Exam'}
        mode={sidebarMode}
        width="xl"
      >
        {sidebarMode === 'view' && selectedExam ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Exam Name</h3>
              <p className="mt-1 text-lg">{selectedExam.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                <p className="mt-1">{new Date(selectedExam.start_date).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                <p className="mt-1">{new Date(selectedExam.end_date).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Published</h3>
              <p className="mt-1">
                <Badge variant={selectedExam.is_published ? 'success' : 'secondary'}>
                  {selectedExam.is_published ? 'Published' : 'Draft'}
                </Badge>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedExam.is_active ? 'success' : 'destructive'}>
                  {selectedExam.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            <div className="pt-4">
              <Button onClick={handleEdit}>Edit</Button>
            </div>
          </div>
        ) : (
          <ExamForm
            exam={sidebarMode === 'edit' ? selectedExam : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default ExamsPage;
