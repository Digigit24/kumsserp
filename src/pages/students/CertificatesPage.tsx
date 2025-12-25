/**
 * Certificates Page
 * Manages student certificates with CRUD operations
 */

import { useState } from 'react';
import { Column, DataTable } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { useCertificates } from '../../hooks/useStudents';
import type { CertificateFilters, CertificateListItem } from '../../types/students.types';
import { CertificateForm } from './components/CertificateForm';

export const CertificatesPage = () => {
  const [filters, setFilters] = useState<CertificateFilters>({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useCertificates(filters);

  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateListItem | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const columns: Column<CertificateListItem>[] = [
    {
      key: 'certificate_number',
      label: 'Certificate No.',
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
      key: 'certificate_type',
      label: 'Type',
      sortable: true,
      render: (cert) => (
        <Badge variant="outline" className="capitalize">
          {cert.certificate_type.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'issue_date',
      label: 'Issue Date',
      sortable: true,
      render: (cert) => new Date(cert.issue_date).toLocaleDateString(),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (cert) => (
        <Badge variant={cert.is_active ? 'default' : 'secondary'}>
          {cert.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const handleRowClick = (certificate: CertificateListItem) => {
    setSelectedCertificate(certificate);
    setSidebarMode('edit');
    setIsSidebarOpen(true);
  };

  const handleAdd = () => {
    setSelectedCertificate(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <DataTable
        title="Student Certificates"
        description="Manage student certificates (Bonafide, TC, Marksheet, Degree). Click on any row to edit."
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error}
        onRefresh={refetch}
        onAdd={handleAdd}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search certificates..."
        addButtonLabel="Issue Certificate"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title={
          sidebarMode === 'create'
            ? 'Issue Certificate'
            : sidebarMode === 'edit'
              ? 'Edit Certificate'
              : 'Certificate Details'
        }
        mode={sidebarMode}
      >
        <CertificateForm
          mode={sidebarMode}
          certificateId={selectedCertificate?.id}
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