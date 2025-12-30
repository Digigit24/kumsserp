/**
 * Book Returns Page
 */

import { useState, useMemo } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useBookReturns, useCreateBookReturn, useUpdateBookReturn, useDeleteBookReturn, useBookIssues, useBooks, useLibraryMembers } from '../../hooks/useLibrary';
import { useUsers } from '../../hooks/useAccounts';
import { BookReturn } from '../../types/library.types';
import { BookReturnForm } from './forms/BookReturnForm';
import { toast } from 'sonner';

const BookReturnsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedReturn, setSelectedReturn] = useState<BookReturn | null>(null);

  const { data, isLoading, error, refetch } = useBookReturns(filters);
  const { data: issuesData } = useBookIssues({ page_size: 1000 });
  const { data: booksData } = useBooks({ page_size: 1000 });
  const { data: membersData } = useLibraryMembers({ page_size: 1000 });
  const { data: usersData } = useUsers({ page_size: 1000 });
  const createReturn = useCreateBookReturn();
  const updateReturn = useUpdateBookReturn();
  const deleteReturn = useDeleteBookReturn();

  // Enrich returns data with book and member names
  const enrichedData = useMemo(() => {
    if (!data?.results) {
      return data;
    }

    // Create lookup maps for available data
    const issuesMap = issuesData?.results ? new Map(issuesData.results.map(i => [i.id, i])) : new Map();
    const booksMap = booksData?.results ? new Map(booksData.results.map(b => [b.id, b])) : new Map();
    const membersMap = membersData?.results ? new Map(membersData.results.map(m => [m.id, m])) : new Map();
    const usersMap = usersData?.results ? new Map(usersData.results.map(u => [u.id, u])) : new Map();

    const enrichedResults = data.results.map(returnRecord => {
      const issueId = typeof returnRecord.book_issue === 'number' ? returnRecord.book_issue : returnRecord.book_issue?.id;
      const issue = issuesMap.get(issueId);

      // Get book and member from the issue
      const bookId = issue ? (typeof issue.book === 'number' ? issue.book : issue.book.id) : null;
      const memberId = issue ? (typeof issue.member === 'number' ? issue.member : issue.member.id) : null;

      const book = bookId ? booksMap.get(bookId) : null;
      const member = memberId ? membersMap.get(memberId) : null;

      // Get member name
      let memberName = memberId ? `Member #${memberId}` : 'Unknown';
      if (member && usersMap.size > 0) {
        const userId = typeof member.user === 'number' ? member.user : member.user?.id;
        const user = usersMap.get(userId);
        memberName = user?.full_name || user?.username || member.member_id || memberName;
      } else if (member) {
        memberName = member.member_id || memberName;
      }

      return {
        ...returnRecord,
        book_title: book?.title || (bookId ? `Book #${bookId}` : 'Unknown'),
        book_author: book?.author,
        member_name: memberName,
        member_id_display: member?.member_id,
      };
    });

    return { ...data, results: enrichedResults };
  }, [data, issuesData, booksData, membersData, usersData]);

  const columns: Column<BookReturn>[] = [
    { key: 'book_title', label: 'Book', sortable: false },
    { key: 'member_name', label: 'Member', sortable: false },
    { key: 'return_date', label: 'Return Date', sortable: true },
    {
      key: 'condition',
      label: 'Condition',
      render: (ret) => {
        const variant = ret.condition === 'good' ? 'success' : ret.condition === 'fair' ? 'default' : 'destructive';
        return <Badge variant={variant}>{ret.condition}</Badge>;
      },
    },
    { key: 'fine_amount', label: 'Fine', render: (ret) => `₹${ret.fine_amount}` },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'condition',
      label: 'Condition',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' },
        { value: 'damaged', label: 'Damaged' },
        { value: 'lost', label: 'Lost' },
      ],
    },
  ];

  const handleAddNew = () => {
    setSelectedReturn(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (ret: BookReturn) => {
    setSelectedReturn(ret);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (data: Partial<BookReturn>) => {
    try {
      if (sidebarMode === 'create') {
        await createReturn.mutateAsync(data);
        toast.success('Book return recorded successfully');
      } else if (sidebarMode === 'edit' && selectedReturn) {
        await updateReturn.mutateAsync({ id: selectedReturn.id, data });
        toast.success('Book return updated successfully');
      }
      setIsSidebarOpen(false);
      setSelectedReturn(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred');
      console.error('Form submission error:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedReturn) return;

    if (confirm('Are you sure you want to delete this return record?')) {
      try {
        await deleteReturn.mutateAsync(selectedReturn.id);
        toast.success('Book return deleted successfully');
        setIsSidebarOpen(false);
        setSelectedReturn(null);
        refetch();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete return');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedReturn(null);
  };

  return (
    <div className="">
      <DataTable
        title="Book Returns List"
        description="View and manage all book returns"
        columns={columns}
        data={enrichedData}
        isLoading={isLoading}
        error={error?.message}
        onRefresh={refetch}
        onAdd={handleAddNew}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search returns..."
        addButtonLabel="Record Return"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Record Book Return' : 'Return Details'}
        mode={sidebarMode}
      >
        {sidebarMode === 'view' && selectedReturn ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Book</h3>
              <p className="mt-1 text-lg font-semibold">{selectedReturn.book_title || `Issue ID: ${selectedReturn.book_issue}`}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Member</h3>
              <p className="mt-1">{selectedReturn.member_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Return Date</h3>
              <p className="mt-1">{selectedReturn.return_date}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Condition</h3>
              <p className="mt-1">
                <Badge variant={selectedReturn.condition === 'good' ? 'success' : selectedReturn.condition === 'fair' ? 'default' : 'destructive'}>
                  {selectedReturn.condition}
                </Badge>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Fine Amount</h3>
              <p className="mt-1 text-lg font-semibold">₹{selectedReturn.fine_amount}</p>
            </div>
            {selectedReturn.remarks && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Remarks</h3>
                <p className="mt-1">{selectedReturn.remarks}</p>
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEdit} className="flex-1">Edit</Button>
              <Button onClick={handleDelete} variant="destructive" className="flex-1">Delete</Button>
            </div>
          </div>
        ) : (
          <BookReturnForm
            bookReturn={sidebarMode === 'edit' ? selectedReturn : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default BookReturnsPage;
