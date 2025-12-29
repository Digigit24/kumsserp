/**
 * Progress Cards Page
 * Generate and manage student progress cards
 */

import { useState } from 'react';
import { Column, DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { FileText } from 'lucide-react';
import { useProgressCards } from '../../hooks/useExamination';

const ProgressCardsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });

  // Fetch progress cards using real API
  const { data, isLoading, error, refetch } = useProgressCards(filters);

  const columns: Column<any>[] = [
    { key: 'student_name', label: 'Student', sortable: true },
    { key: 'class_name', label: 'Class', sortable: true },
    { key: 'exam_name', label: 'Exam', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (card) => (
        <Badge variant={card.status === 'generated' ? 'success' : 'outline'}>
          {card.status || 'Pending'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold">Progress Cards</h1>
        <p className="text-muted-foreground">Generate student progress cards</p>
      </div>

      <DataTable
        title="Progress Cards"
        description="View and generate student progress cards"
        columns={columns}
        data={data}
        isLoading={isLoading}
        error={error?.message}
        onRefresh={refetch}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search progress cards..."
      />
    </div>
  );
};

export default ProgressCardsPage;
