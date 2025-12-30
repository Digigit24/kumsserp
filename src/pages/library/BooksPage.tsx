/**
 * Books Page - Library Module
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from '../../hooks/useLibrary';
import { Book } from '../../types/library.types';
import { BookForm } from './forms/BookForm';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

const BooksPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Check if user is student (students can only view, not add/edit/delete)
  const isStudent = user?.userType === 'student';

  // Fetch books using real API
  const { data, isLoading, error, refetch } = useBooks(filters);

  // Mutations
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  const columns: Column<Book>[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'author', label: 'Author', sortable: true },
    { key: 'isbn', label: 'ISBN', sortable: false },
    { key: 'category_name', label: 'Category', sortable: false },
    { key: 'publisher', label: 'Publisher', sortable: false },
    {
      key: 'quantity',
      label: 'Qty',
      render: (book) => (
        <span className="font-medium">
          {book.available_quantity}/{book.quantity}
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (book) => <span className="font-medium">₹{book.price}</span>,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (book) => (
        <Badge variant={book.is_active ? 'success' : 'destructive'}>
          {book.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

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
  ];

  const handleAddNew = () => {
    setSelectedBook(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (book: Book) => {
    setSelectedBook(book);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (data: Partial<Book>) => {
    try {
      if (sidebarMode === 'create') {
        await createBook.mutateAsync(data);
        toast.success('Book created successfully');
      } else if (sidebarMode === 'edit' && selectedBook) {
        await updateBook.mutateAsync({ id: selectedBook.id, data });
        toast.success('Book updated successfully');
      }
      setIsSidebarOpen(false);
      setSelectedBook(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred');
      console.error('Form submission error:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedBook) return;

    if (confirm(`Are you sure you want to delete "${selectedBook.title}"?`)) {
      try {
        await deleteBook.mutateAsync(selectedBook.id);
        toast.success('Book deleted successfully');
        setIsSidebarOpen(false);
        setSelectedBook(null);
        refetch();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete book');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="">
      <DataTable
        title="Books List"
        description="View and manage all books in the library"
        columns={columns}
        data={data}
        isLoading={isLoading}
        error={error?.message}
        onRefresh={refetch}
        onAdd={isStudent ? undefined : handleAddNew}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search books by title, author, ISBN..."
        addButtonLabel="Add Book"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Add New Book' : selectedBook?.title || 'Book Details'}
        mode={sidebarMode}
      >
        {sidebarMode === 'view' && selectedBook ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
              <p className="mt-1 text-lg font-semibold">{selectedBook.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Author</h3>
                <p className="mt-1">{selectedBook.author}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">ISBN</h3>
                <p className="mt-1">{selectedBook.isbn || 'N/A'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Publisher</h3>
                <p className="mt-1">{selectedBook.publisher || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Edition</h3>
                <p className="mt-1">{selectedBook.edition || 'N/A'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Publication Year</h3>
                <p className="mt-1">{selectedBook.publication_year || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Language</h3>
                <p className="mt-1">{selectedBook.language}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                <p className="mt-1">{selectedBook.category_name || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Pages</h3>
                <p className="mt-1">{selectedBook.pages || 'N/A'}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Quantity</h3>
                <p className="mt-1 text-lg font-semibold">{selectedBook.quantity}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Available</h3>
                <p className="mt-1 text-lg font-semibold text-green-600">{selectedBook.available_quantity}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                <p className="mt-1 text-lg font-semibold">₹{selectedBook.price}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p className="mt-1">{selectedBook.location || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Barcode</h3>
                <p className="mt-1">{selectedBook.barcode || 'N/A'}</p>
              </div>
            </div>
            {selectedBook.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1">{selectedBook.description}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedBook.is_active ? 'success' : 'destructive'}>
                  {selectedBook.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            {!isStudent && (
              <div className="flex gap-2 pt-4">
                <Button onClick={handleEdit} className="flex-1">Edit</Button>
                <Button onClick={handleDelete} variant="destructive" className="flex-1">Delete</Button>
              </div>
            )}
          </div>
        ) : (
          <BookForm
            book={sidebarMode === 'edit' ? selectedBook : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default BooksPage;
