/**
 * Book Issues Page
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useBookIssues, useCreateBookIssue, useUpdateBookIssue, useDeleteBookIssue } from '../../hooks/useLibrary';
import { BookIssue } from '../../types/library.types';
import { BookIssueForm } from './forms/BookIssueForm';
import { toast } from 'sonner';

const BookIssuesPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedIssue, setSelectedIssue] = useState<BookIssue | null>(null);

  const { data, isLoading, error, refetch } = useBookIssues(filters);
  const createIssue = useCreateBookIssue();
  const updateIssue = useUpdateBookIssue();
  const deleteIssue = useDeleteBookIssue();

  const columns: Column<BookIssue>[] = [
    { key: 'book_title', label: 'Book', sortable: false },
    { key: 'member_name', label: 'Member', sortable: false },
    { key: 'issue_date', label: 'Issue Date', sortable: true },
    { key: 'due_date', label: 'Due Date', sortable: true },
    { key: 'return_date', label: 'Return Date', render: (issue) => issue.return_date || 'Not returned' },
    {
      key: 'status',
      label: 'Status',
      render: (issue) => {
        const variant = issue.status === 'issued' ? 'default' : issue.status === 'returned' ? 'success' : issue.status === 'overdue' ? 'destructive' : 'secondary';
        return <Badge variant={variant}>{issue.status}</Badge>;
      },
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'issued', label: 'Issued' },
        { value: 'returned', label: 'Returned' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'lost', label: 'Lost' },
      ],
    },
  ];

  const handleAddNew = () => {
    setSelectedIssue(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (issue: BookIssue) => {
    setSelectedIssue(issue);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (data: Partial<BookIssue>) => {
    try {
      if (sidebarMode === 'create') {
        await createIssue.mutateAsync(data);
        toast.success('Book issued successfully');
      } else if (sidebarMode === 'edit' && selectedIssue) {
        await updateIssue.mutateAsync({ id: selectedIssue.id, data });
        toast.success('Book issue updated successfully');
      }
      setIsSidebarOpen(false);
      setSelectedIssue(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred');
      console.error('Form submission error:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedIssue) return;

    if (confirm('Are you sure you want to delete this book issue record?')) {
      try {
        await deleteIssue.mutateAsync(selectedIssue.id);
        toast.success('Book issue deleted successfully');
        setIsSidebarOpen(false);
        setSelectedIssue(null);
        refetch();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete book issue');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedIssue(null);
  };

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold">Book Issues</h1>
        <p className="text-muted-foreground">Track book issuances and returns</p>
      </div>

      <DataTable
        title="Book Issues List"
        description="View and manage all book issuances"
        columns={columns}
        data={data}
        isLoading={isLoading}
        error={error?.message}
        onRefresh={refetch}
        onAdd={handleAddNew}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search book issues..."
        addButtonLabel="Issue Book"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Issue New Book' : 'Book Issue Details'}
        mode={sidebarMode}
      >
        {sidebarMode === 'view' && selectedIssue ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Book</h3>
              <p className="mt-1 text-lg font-semibold">{selectedIssue.book_title || `Book ID: ${selectedIssue.book}`}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Member</h3>
              <p className="mt-1">{selectedIssue.member_name || `Member ID: ${selectedIssue.member}`}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Issue Date</h3>
                <p className="mt-1">{selectedIssue.issue_date}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                <p className="mt-1">{selectedIssue.due_date}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Return Date</h3>
              <p className="mt-1">{selectedIssue.return_date || 'Not returned yet'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedIssue.status === 'issued' ? 'default' : selectedIssue.status === 'returned' ? 'success' : 'destructive'}>
                  {selectedIssue.status}
                </Badge>
              </p>
            </div>
            {selectedIssue.issued_by_name && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Issued By</h3>
                <p className="mt-1">{selectedIssue.issued_by_name}</p>
              </div>
            )}
            {selectedIssue.remarks && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Remarks</h3>
                <p className="mt-1">{selectedIssue.remarks}</p>
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEdit} className="flex-1">Edit</Button>
              <Button onClick={handleDelete} variant="destructive" className="flex-1">Delete</Button>
            </div>
          </div>
        ) : (
          <BookIssueForm
            issue={sidebarMode === 'edit' ? selectedIssue : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default BookIssuesPage;
