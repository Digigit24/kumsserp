/**
 * Colleges Page
 * Manage colleges/institutions in the system
 */

import { useState } from 'react';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { CollegeForm } from './components/CollegeForm';
import { collegeApi } from '../../services/core.service';
import type { CollegeListItem, CollegeFilters, College } from '../../types/core.types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const CollegesPage = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<CollegeFilters>({ page: 1, page_size: 20 });
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(null);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch colleges list
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['colleges', filters],
    queryFn: () => collegeApi.list(filters),
  });

  // Fetch selected college details
  const { data: selectedCollege } = useQuery({
    queryKey: ['college', selectedCollegeId],
    queryFn: () => selectedCollegeId ? collegeApi.get(selectedCollegeId) : null,
    enabled: !!selectedCollegeId,
  });

  // Define table columns
  const columns: Column<CollegeListItem>[] = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      render: (college) => (
        <code className="px-2 py-1 bg-muted rounded text-sm font-medium">
          {college.code}
        </code>
      ),
    },
    {
      key: 'name',
      label: 'College Name',
      sortable: true,
      render: (college) => (
        <div>
          <p className="font-medium">{college.name}</p>
          <p className="text-sm text-muted-foreground">{college.short_name}</p>
        </div>
      ),
    },
    {
      key: 'city',
      label: 'Location',
      render: (college) => (
        <span className="text-sm">{college.city}, {college.state}</span>
      ),
    },
    {
      key: 'is_main',
      label: 'Type',
      render: (college) => (
        college.is_main ? (
          <Badge variant="default">Main University</Badge>
        ) : (
          <Badge variant="outline">College</Badge>
        )
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (college) => (
        <Badge variant={college.is_active ? 'success' : 'destructive'}>
          {college.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  // Define filter configuration
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
    {
      name: 'is_main',
      label: 'Type',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'true', label: 'Main University' },
        { value: 'false', label: 'College' },
      ],
    },
  ];

  const handleRowClick = (college: CollegeListItem) => {
    setSelectedCollegeId(college.id);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleAdd = () => {
    setSelectedCollegeId(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedCollegeId(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['colleges'] });
    if (selectedCollegeId) {
      queryClient.invalidateQueries({ queryKey: ['college', selectedCollegeId] });
    }
    handleCloseSidebar();
  };

  const handleSubmit = async (formData: any) => {
    if (sidebarMode === 'create') {
      await collegeApi.create(formData);
    } else if (selectedCollege) {
      await collegeApi.update(selectedCollege.id, formData);
    }
  };

  return (
    <div className="p-6">
      <DataTable
        title="Colleges"
        description="Manage colleges and institutions in the system"
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error as string}
        onRefresh={refetch}
        onAdd={handleAdd}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search by college name, code, or city..."
        addButtonLabel="Add College"
      />

      {/* Detail/Create/Edit Sidebar */}
      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={
          sidebarMode === 'create'
            ? 'Add New College'
            : sidebarMode === 'edit'
            ? 'Edit College'
            : selectedCollege?.name || 'College Details'
        }
        mode={sidebarMode}
        width="xl"
      >
        {sidebarMode === 'create' && (
          <CollegeForm
            mode="create"
            onSuccess={handleFormSuccess}
            onCancel={handleCloseSidebar}
            onSubmit={handleSubmit}
          />
        )}

        {sidebarMode === 'edit' && selectedCollege && (
          <CollegeForm
            mode="edit"
            college={selectedCollege}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseSidebar}
            onSubmit={handleSubmit}
          />
        )}

        {sidebarMode === 'view' && selectedCollege && (
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Edit College
              </button>
            </div>

            {/* College Details */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Code</label>
                    <p className="font-medium">
                      <code className="px-2 py-1 bg-background rounded text-sm">{selectedCollege.code}</code>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Short Name</label>
                    <p className="font-medium">{selectedCollege.short_name}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-muted-foreground">Full Name</label>
                    <p className="font-medium text-lg">{selectedCollege.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="font-medium">{selectedCollege.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Phone</label>
                    <p className="font-medium">{selectedCollege.phone}</p>
                  </div>
                  {selectedCollege.website && (
                    <div className="col-span-2">
                      <label className="text-sm text-muted-foreground">Website</label>
                      <p className="font-medium">
                        <a href={selectedCollege.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {selectedCollege.website}
                        </a>
                      </p>
                    </div>
                  )}
                  {selectedCollege.established_date && (
                    <div>
                      <label className="text-sm text-muted-foreground">Established</label>
                      <p className="font-medium">{new Date(selectedCollege.established_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedCollege.affiliation_number && (
                    <div>
                      <label className="text-sm text-muted-foreground">Affiliation Number</label>
                      <p className="font-medium">{selectedCollege.affiliation_number}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Address</h3>
                <div className="space-y-2 text-sm">
                  <p>{selectedCollege.address_line1}</p>
                  {selectedCollege.address_line2 && <p>{selectedCollege.address_line2}</p>}
                  <p>{selectedCollege.city}, {selectedCollege.state} - {selectedCollege.pincode}</p>
                  <p>{selectedCollege.country}</p>
                </div>
              </div>

              {/* Branding */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Branding</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Primary Color</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-8 h-8 rounded border" style={{ backgroundColor: selectedCollege.primary_color }}></div>
                      <code className="text-sm">{selectedCollege.primary_color}</code>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Secondary Color</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-8 h-8 rounded border" style={{ backgroundColor: selectedCollege.secondary_color }}></div>
                      <code className="text-sm">{selectedCollege.secondary_color}</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Status & Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    {selectedCollege.is_main ? (
                      <Badge variant="default">Main University</Badge>
                    ) : (
                      <Badge variant="outline">College</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={selectedCollege.is_active ? 'success' : 'destructive'}>
                      {selectedCollege.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Display Order</span>
                    <span className="font-medium">{selectedCollege.display_order}</span>
                  </div>
                </div>
              </div>

              {/* Audit Information */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Audit Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <label className="text-xs text-muted-foreground">Created At</label>
                    <p>{new Date(selectedCollege.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Updated At</label>
                    <p>{new Date(selectedCollege.updated_at).toLocaleString()}</p>
                  </div>
                  {selectedCollege.created_by && (
                    <div>
                      <label className="text-xs text-muted-foreground">Created By</label>
                      <p>{selectedCollege.created_by.username}</p>
                    </div>
                  )}
                  {selectedCollege.updated_by && (
                    <div>
                      <label className="text-xs text-muted-foreground">Updated By</label>
                      <p>{selectedCollege.updated_by.username}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Raw Data */}
              <details className="bg-muted/30 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold mb-2 text-sm">
                  Raw API Data
                </summary>
                <pre className="text-xs overflow-auto max-h-64 bg-background p-2 rounded mt-2">
                  {JSON.stringify(selectedCollege, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </DetailSidebar>
    </div>
  );
};

export default CollegesPage;
