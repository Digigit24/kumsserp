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
import { Book, BookCreateInput } from '../../../types/library.types';

interface BookFormProps {
  book: Book | null;
  onSubmit: (data: Partial<Book>) => void;
  onCancel: () => void;
}

export const BookForm = ({ book, onSubmit, onCancel }: BookFormProps) => {
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
    category: 1, // Default category ID
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Book title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author *</Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          placeholder="Author name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input
            id="isbn"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            placeholder="ISBN number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="barcode">Barcode</Label>
          <Input
            id="barcode"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            placeholder="Barcode"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="publisher">Publisher</Label>
          <Input
            id="publisher"
            value={formData.publisher}
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
            placeholder="Publisher name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edition">Edition</Label>
          <Input
            id="edition"
            value={formData.edition}
            onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
            placeholder="e.g., 1st, 2nd"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="publication_year">Publication Year</Label>
          <Input
            id="publication_year"
            type="number"
            value={formData.publication_year || ''}
            onChange={(e) => setFormData({ ...formData, publication_year: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="YYYY"
            min="1800"
            max={new Date().getFullYear()}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language *</Label>
          <Input
            id="language"
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            placeholder="e.g., English, Hindi"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pages">Pages</Label>
          <Input
            id="pages"
            type="number"
            value={formData.pages || ''}
            onChange={(e) => setFormData({ ...formData, pages: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="Number of pages"
            min="1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category ID *</Label>
          <Input
            id="category"
            type="number"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: parseInt(e.target.value) })}
            placeholder="Category ID"
            required
            min="1"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Total Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            placeholder="Total copies"
            required
            min="1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="available_quantity">Available *</Label>
          <Input
            id="available_quantity"
            type="number"
            value={formData.available_quantity}
            onChange={(e) => setFormData({ ...formData, available_quantity: parseInt(e.target.value) })}
            placeholder="Available"
            required
            min="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Price"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location (Shelf)</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g., A-12, Shelf-3"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Book description"
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="is_active">Active</Label>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {book ? 'Update Book' : 'Add Book'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
