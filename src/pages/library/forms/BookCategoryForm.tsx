/**
 * Book Category Form Component
 * Used for creating and editing book categories
 */

import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { bookCategoriesApi } from '../../../services/library.service';
import type { BookCategory, BookCategoryCreateInput, BookCategoryUpdateInput } from '../../../types/library.types';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { getCurrentUser } from '../../../services/auth.service';

interface BookCategoryFormProps {
  mode: 'create' | 'edit';
  category?: BookCategory;
  onSuccess: () => void;
  onCancel: () => void;
}

export const BookCategoryForm = ({ mode, category, onSuccess, onCancel }: BookCategoryFormProps) => {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BookCategoryCreateInput>({
    name: '',
    code: '',
    description: '',
    is_active: true,
    college: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data for edit mode
  useEffect(() => {
    if (mode === 'edit' && category) {
      setFormData({
        name: category.name,
        code: category.code,
        description: category.description || '',
        is_active: category.is_active,
        college: category.college,
      });
    } else if (mode === 'create') {
      // Get college ID from current user
      const user = getCurrentUser();
      const collegeId = user?.college || 0;
      setFormData(prev => ({ ...prev, college: collegeId }));
    }
  }, [mode, category]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Category code is required';
    }

    if (!formData.college || formData.college === 0) {
      newErrors.college = 'College is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof BookCategoryCreateInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'create') {
        await bookCategoriesApi.create(formData);
      } else if (category) {
        const updateData: BookCategoryUpdateInput = {
          name: formData.name,
          code: formData.code,
          description: formData.description,
          is_active: formData.is_active,
        };
        await bookCategoriesApi.update(category.id, updateData);
      }

      onSuccess();
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || 'Failed to save category');

      // Handle field-specific errors from backend
      if (err.errors) {
        const backendErrors: Record<string, string> = {};
        Object.entries(err.errors).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            backendErrors[key] = value[0];
          } else {
            backendErrors[key] = String(value);
          }
        });
        setErrors(backendErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Category Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Category Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Fiction, Non-Fiction, Reference, Science"
            disabled={isSubmitting}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </div>

        {/* Category Code */}
        <div>
          <label htmlFor="code" className="block text-sm font-medium mb-2">
            Category Code <span className="text-destructive">*</span>
          </label>
          <Input
            id="code"
            type="text"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
            placeholder="e.g., FICT, NFICT, REF, SCI"
            disabled={isSubmitting}
            className={errors.code ? 'border-destructive' : ''}
            maxLength={20}
          />
          {errors.code && (
            <p className="text-sm text-destructive mt-1">{errors.code}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter category description..."
            disabled={isSubmitting}
            rows={4}
            className={errors.description ? 'border-destructive' : ''}
          />
          {errors.description && (
            <p className="text-sm text-destructive mt-1">{errors.description}</p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3">
          <input
            id="is_active"
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => handleChange('is_active', e.target.checked)}
            disabled={isSubmitting}
            className="w-4 h-4 rounded border-gray-300"
          />
          <label htmlFor="is_active" className="text-sm font-medium">
            Active
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[100px]"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Saving...
            </>
          ) : (
            mode === 'create' ? 'Create Category' : 'Update Category'
          )}
        </Button>
      </div>
    </form>
  );
};
