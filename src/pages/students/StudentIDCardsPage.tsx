/**
 * Student ID Cards Page
 * Manages student ID cards with CRUD operations
 */

import { useState } from 'react';
import { Column, DataTable } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { useStudentIDCards } from '../../hooks/useStudents';
import type { StudentIDCardFilters, StudentIDCardListItem } from '../../types/students.types';
import { StudentIDCardForm } from './components/StudentIDCardForm';

export const StudentIDCardsPage = () => {
  const [filters, setFilters] = useState<StudentIDCardFilters>({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useStudentIDCards(filters);

  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedIDCard, setSelectedIDCard] = useState<StudentIDCardListItem | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const columns: Column<StudentIDCardListItem>[] = [
    {
      key: 'card_number',
      label: 'Card Number',
      sortable: true,
      className: 'font-medium',
    },
    {
      key: 'student_name',
      label: 'Student Name',
      sortable: true,
      className: 'font-semibold',
    },
    {
      key: 'issue_date',
      label: 'Issue Date',
      sortable: true,
      render: (card) => new Date(card.issue_date).toLocaleDateString(),
    },
    {
      key: 'valid_until',
      label: 'Valid Until',
      sortable: true,
      render: (card) => {
        const validDate = new Date(card.valid_until);
        const isExpired = validDate < new Date();
        return (
          <span className={isExpired ? 'text-destructive' : ''}>
            {validDate.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (card) => {
        const validDate = new Date(card.valid_until);
        const isExpired = validDate < new Date();
        
        if (!card.is_active) {
          return <Badge variant="secondary">Inactive</Badge>;
        }
        if (isExpired) {
          return <Badge variant="destructive">Expired</Badge>;
        }
        return <Badge variant="default">Active</Badge>;
      },
    },
  ];

  const handleRowClick = (idCard: StudentIDCardListItem) => {
    setSelectedIDCard(idCard);
    setSidebarMode('edit');
    setIsSidebarOpen(true);
  };

  const handleAdd = () => {
    setSelectedIDCard(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <DataTable
        title="Student ID Cards"
        description="Manage student ID cards and their validity. Click on any row to edit."
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error}
        onRefresh={refetch}
        onAdd={handleAdd}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search ID cards..."
        addButtonLabel="Issue ID Card"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title={
          sidebarMode === 'create'
            ? 'Issue ID Card'
            : sidebarMode === 'edit'
            ? 'Edit ID Card'
            : 'ID Card Details'
        }
        mode={sidebarMode}
      >
        <StudentIDCardForm
          mode={sidebarMode}
          idCardId={selectedIDCard?.id}
          onSuccess={() => {
            setIsSidebarOpen(false);
            refetch();
          }}
          onCancel={() => setIsSidebarOpen(false)}
        />
      </DetailSidebar>
    </div>
  );
};