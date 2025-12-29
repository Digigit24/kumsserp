/**
 * Book Form Component
 * Create/Edit form for library books
 */

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Book, BookCreateInput } from '../../../types/library.types';
import { useBookCategories } from '../../../hooks/useLibrary';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

interface BookFormProps {
  book: Book | null;
  onSubmit: (data: Partial<Book>) => void;
  onCancel: () => void;
}

export const BookForm = ({ book, onSubmit, onCancel }: BookFormProps) => {
  // Fetch book categories
  const { data: categoriesData, isLoading: categoriesLoading } = useBookCategories({ page_size: 100 });
  const categories = categoriesData?.results || [];

  const [formData, setFormData] = useState<Partial<BookCreateInput>>({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    edition: '',
    publication_year: undefined,
    language: 'English',
    pages: undefined,
    quantity: 1,
    available_quantity: 1,
    price: '0',
    location: '',
    barcode: '',
    description: '',
    cover_image: '',
    college: 1, // Default college ID
    category: undefined, // Will be set from dropdown
    is_active: true,
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn || '',
        publisher: book.publisher || '',
        edition: book.edition || '',
        publication_year: book.publication_year || undefined,
        language: book.language,
        pages: book.pages || undefined,
        quantity: book.quantity,
        available_quantity: book.available_quantity,
        price: book.price,
        location: book.location || '',
        barcode: book.barcode || '',
        description: book.description || '',
        cover_image: book.cover_image || '',
        college: book.college,
        category: book.category,
        is_active: book.is_active,
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get current user ID from localStorage (you might have this in auth context)
    const userId = localStorage.getItem('kumss_user_id') || undefined;

    // Prepare data for submission
    const submitData: any = { ...formData };

    // Add audit fields for create
    if (!book && userId) {
      submitData.created_by = userId;
      submitData.updated_by = userId;
    } else if (book && userId) {
      submitData.updated_by = userId;
    }

    // Convert empty strings to null where appropriate
    if (submitData.isbn === '') submitData.isbn = null;
    if (submitData.publisher === '') submitData.publisher = null;
    if (submitData.edition === '') submitData.edition = null;
    if (submitData.location === '') submitData.location = null;
    if (submitData.barcode === '') submitData.barcode = null;
    if (submitData.description === '') submitData.description = null;
    if (submitData.cover_image === '') submitData.cover_image = null;

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <h3 className="text-lg font-semibold">Basic Information</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter book title"
            required
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author" className="text-sm font-medium">Author *</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Enter author name"
            required
            className="h-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="isbn" className="text-sm font-medium">ISBN</Label>
            <Input
              id="isbn"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              placeholder="ISBN number"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="barcode" className="text-sm font-medium">Barcode</Label>
            <Input
              id="barcode"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              placeholder="Barcode number"
              className="h-10"
            />
          </div>
        </div>
      </div>

      {/* Publication Details Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <h3 className="text-lg font-semibold">Publication Details</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="publisher" className="text-sm font-medium">Publisher</Label>
            <Input
              id="publisher"
              value={formData.publisher}
              onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
              placeholder="Publisher name"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edition" className="text-sm font-medium">Edition</Label>
            <Input
              id="edition"
              value={formData.edition}
              onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
              placeholder="e.g., 1st, 2nd"
              className="h-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="publication_year" className="text-sm font-medium">Publication Year</Label>
            <Input
              id="publication_year"
              type="number"
              value={formData.publication_year || ''}
              onChange={(e) => setFormData({ ...formData, publication_year: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="YYYY"
              min="1800"
              max={new Date().getFullYear()}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm font-medium">Language *</Label>
            <Input
              id="language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              placeholder="e.g., English, Hindi"
              required
              className="h-10"
            />
          </div>
        </div>
      </div>

      {/* Categorization Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <h3 className="text-lg font-semibold">Categorization</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
            {categoriesLoading ? (
              <div className="flex items-center justify-center h-10 border rounded-md bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : categories.length === 0 ? (
              <Alert variant="destructive" className="p-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  No categories available. Please create a category first.
                </AlertDescription>
              </Alert>
            ) : (
              <Select
                value={formData.category?.toString()}
                onValueChange={(value) => setFormData({ ...formData, category: parseInt(value) })}
                required
              >
                <SelectTrigger id="category" className="h-10">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="pages" className="text-sm font-medium">Pages</Label>
            <Input
              id="pages"
              type="number"
              value={formData.pages || ''}
              onChange={(e) => setFormData({ ...formData, pages: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="Number of pages"
              min="1"
              className="h-10"
            />
          </div>
        </div>
      </div>

      {/* Inventory Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <h3 className="text-lg font-semibold">Inventory & Pricing</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-medium">Total Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              placeholder="Total copies"
              required
              min="1"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="available_quantity" className="text-sm font-medium">Available *</Label>
            <Input
              id="available_quantity"
              type="number"
              value={formData.available_quantity}
              onChange={(e) => setFormData({ ...formData, available_quantity: parseInt(e.target.value) })}
              placeholder="Available"
              required
              min="0"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">Price (₹) *</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Price"
              required
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">Location (Shelf)</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., A-12, Shelf-3"
            className="h-10"
          />
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <h3 className="text-lg font-semibold">Additional Information</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter book description or summary"
            rows={4}
            className="resize-none"
          />
        </div>
      </div>

      {/* Status Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <h3 className="text-lg font-semibold">Status</h3>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
              Active Status
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              {formData.is_active ? 'Book is active and available' : 'Book is inactive'}
            </p>
          </div>
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-2 sticky bottom-0 bg-background pb-4">
        <Button
          type="submit"
          className="flex-1 h-11 font-medium shadow-sm hover:shadow-md transition-shadow"
          disabled={categoriesLoading || (categories.length === 0 && !formData.category)}
        >
          {book ? 'Update Book' : 'Add Book'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-11 font-medium"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
