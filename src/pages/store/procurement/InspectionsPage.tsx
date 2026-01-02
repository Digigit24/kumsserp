import { useState } from 'react';
import { Column, DataTable } from '../../../components/common/DataTable';
import { Badge } from '../../../components/ui/badge';
import { useInspections } from '../../../hooks/useProcurement';

export const InspectionsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });

  const { data, isLoading } = useInspections(filters);

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      passed: 'outline',
      failed: 'destructive',
      partial: 'default',
      pending: 'secondary',
    };
    return variants[status] || 'default';
  };

  const getRecommendationVariant = (recommendation: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      accept: 'outline',
      reject: 'destructive',
      conditional: 'default',
    };
    return variants[recommendation] || 'default';
  };

  const columns: Column<any>[] = [
    {
      key: 'grn_number',
      label: 'GRN Number',
      render: (row) => <span className="font-semibold">{row.grn_number || `GRN #${row.grn}`}</span>,
      sortable: true,
    },
    {
      key: 'inspection_date',
      label: 'Inspection Date',
      render: (row) => new Date(row.inspection_date).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'inspector_name',
      label: 'Inspector',
      render: (row) => row.inspector_name || `Inspector #${row.inspector}`,
    },
    {
      key: 'overall_status',
      label: 'Status',
      render: (row) => (
        <Badge variant={getStatusVariant(row.overall_status)} className="capitalize">
          {row.overall_status}
        </Badge>
      ),
    },
    {
      key: 'quality_rating',
      label: 'Quality Rating',
      render: (row) => (
        <div className="flex items-center gap-1">
          <span>{row.quality_rating || 0}</span>
          <span className="text-yellow-500">★</span>
        </div>
      ),
    },
    {
      key: 'packaging_condition',
      label: 'Packaging',
      render: (row) => (
        <Badge variant="secondary" className="capitalize">
          {row.packaging_condition || 'Not rated'}
        </Badge>
      ),
    },
    {
      key: 'recommendation',
      label: 'Recommendation',
      render: (row) => (
        <Badge variant={getRecommendationVariant(row.recommendation)} className="capitalize">
          {row.recommendation}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quality Inspections</h1>
          <p className="text-muted-foreground">Track quality inspections for goods received</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        onPageChange={(page) => setFilters({ ...filters, page })}
      />
    </div>
  );
};
