import { useState } from 'react';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface FeeMaster { id: number; name: string; code: string; fee_type: string; is_mandatory: boolean; is_active: boolean; }

const FeeMastersPage = () => {
  const [filters] = useState({ page: 1, page_size: 20 });
  const mockData = { count: 0, results: [] as FeeMaster[] };

  const columns: Column<FeeMaster>[] = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'name', label: 'Fee Name', sortable: true },
    { key: 'fee_type', label: 'Type', sortable: true },
    { key: 'is_mandatory', label: 'Mandatory', render: (fee) => <Badge variant={fee.is_mandatory ? 'default' : 'outline'}>{fee.is_mandatory ? 'Yes' : 'No'}</Badge> },
    { key: 'is_active', label: 'Status', render: (fee) => <Badge variant={fee.is_active ? 'success' : 'destructive'}>{fee.is_active ? 'Active' : 'Inactive'}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Fee Masters</h1>
      <Card><CardHeader><CardTitle>Fee Masters List</CardTitle></CardHeader>
        <CardContent><DataTable columns={columns} data={mockData.results} totalCount={mockData.count} currentPage={filters.page} pageSize={filters.page_size} searchPlaceholder="Search fees..." addNewLabel="Add Fee Master" /></CardContent>
      </Card>
    </div>
  );
};

export default FeeMastersPage;
