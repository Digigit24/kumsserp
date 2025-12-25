/**
 * Student Promotions Page
 * Manages student promotions with CRUD operations
 */

import { useState } from 'react';
import { Column, DataTable } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { useStudentPromotions } from '../../hooks/useStudents';
import type { StudentPromotionFilters, StudentPromotionListItem } from '../../types/students.types';
import { StudentPromotionForm } from './components/StudentPromotionForm';

export const StudentPromotionsPage = () => {
  const [filters, setFilters] = useState<StudentPromotionFilters>({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useStudentPromotions(filters);

  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedPromotion, setSelectedPromotion] = useState<StudentPromotionListItem | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const columns: Column<StudentPromotionListItem>[] = [
    {
      key: 'student_name',
      label: 'Student Name',
      sortable: true,
      className: 'font-semibold',
    },
    {
      key: 'from_class_name',
      label: 'From Class',
      sortable: true,
      render: (promo) => (
        <Badge variant="secondary">{promo.from_class_name}</Badge>
      ),
    },
    {
      key: 'to_class_name',
      label: 'To Class',
      sortable: true,
      render: (promo) => (
        <Badge variant="default">{promo.to_class_name}</Badge>
      ),
    },
    {
      key: 'promotion_date',
      label: 'Promotion Date',
      sortable: true,
      render: (promo) => new Date(promo.promotion_date).toLocaleDateString(),
    },
  ];

  const handleRowClick = (promotion: StudentPromotionListItem) => {
    setSelectedPromotion(promotion);
    setSidebarMode('edit');
    setIsSidebarOpen(true);
  };

  const handleAdd = () => {
    setSelectedPromotion(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <DataTable
        title="Student Promotions"
        description="Manage student promotions from one class to another. Click on any row to edit."
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error}
        onRefresh={refetch}
        onAdd={handleAdd}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search promotions..."
        addButtonLabel="Promote Student"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title={
          sidebarMode === 'create'
            ? 'Promote Student'
            : sidebarMode === 'edit'
              ? 'Edit Promotion'
              : 'Promotion Details'
        }
        mode={sidebarMode}
      >
        <StudentPromotionForm
          mode={sidebarMode}
          promotionId={selectedPromotion?.id}
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