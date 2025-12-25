/**
 * Student Documents Page
 * Displays all student documents from API
 */

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { useStudentDocuments } from '../../hooks/useStudents';
import type { StudentDocumentFilters } from '../../types/students.types';

export const StudentDocumentsPage = () => {
  const [filters, setFilters] = useState<StudentDocumentFilters>({
    page: 1,
    page_size: 20,
  });

  const { data, isLoading, error, refetch } = useStudentDocuments(filters);

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Student Documents
        </h1>
        <p className="text-muted-foreground">
          List of all student documents (Certificates, ID Proofs, etc.)
        </p>
      </div>

      {/* Actions */}
      <div className="mb-4 flex gap-4">
        <Button onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-lg">Loading student documents…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 mb-4">
          <p className="text-destructive font-medium">
            Error: {String(error)}
          </p>
        </div>
      )}

      {/* Data */}
      {!isLoading && !error && data && (
        <div className="rounded-lg border border-border bg-card">
          <div className="p-4 border-b border-border bg-muted/40">
            <h2 className="text-lg font-semibold text-foreground">
              Full API Response (JSON)
            </h2>
          </div>

          <pre className="p-4 overflow-auto max-h-[600px] text-xs text-foreground">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
