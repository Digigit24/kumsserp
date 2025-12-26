/**
 * Fee Masters Page
 */

import { useState } from 'react';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';

interface FeeMaster {
  id: number;
  name: string;
  code: string;
  fee_type: string;
  is_mandatory: boolean;
  is_active: boolean;
}

const FeeMastersPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const mockData = { count: 0, next: null, previous: null, results: [] as FeeMaster[] };

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
      key: 'is_active',
      label: 'Status',
      render: (fee) => <Badge variant={fee.is_active ? 'success' : 'destructive'}>{fee.is_active ? 'Active' : 'Inactive'}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fee Masters</h1>
        <p className="text-muted-foreground">Manage fee types and categories</p>
      </div>

      <DataTable
        title="Fee Masters List"
        columns={columns}
        data={mockData}
        isLoading={false}
        error={null}
        onRefresh={() => {}}
        onAdd={() => {}}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search fees..."
        addButtonLabel="Add Fee Master"
      />
    </div>
  );
};

export default FeeMastersPage;
