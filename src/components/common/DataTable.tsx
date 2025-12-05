/**
 * Universal DataTable Component
 * Modern, sleek table with search, filters, sorting, and pagination
 */

import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown, Plus, RefreshCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PaginatedResponse } from '@/types/core.types';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface FilterConfig {
  name: string;
  label: string;
  type: 'select' | 'text' | 'checkbox';
  options?: { value: string; label: string }[];
}

interface DataTableProps<T> {
  title: string;
  description?: string;
  data: PaginatedResponse<T> | null;
  columns: Column<T>[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onAdd?: () => void;
  onRowClick?: (item: T) => void;
  filters?: Record<string, any>;
  onFiltersChange?: (filters: Record<string, any>) => void;
  filterConfig?: FilterConfig[];
  searchPlaceholder?: string;
  addButtonLabel?: string;
}

export function DataTable<T extends Record<string, any>>({
  title,
  description,
  data,
  columns,
  isLoading,
  error,
  onRefresh,
  onAdd,
  onRowClick,
  filters = {},
  onFiltersChange,
  filterConfig = [],
  searchPlaceholder = 'Search...',
  addButtonLabel = 'Add New',
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        [name]: value === '' ? undefined : value,
        page: 1, // Reset to first page when filtering
      });
    }
  };

  const handleSearchChange = (value: string) => {
    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        search: value === '' ? undefined : value,
        page: 1,
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (onFiltersChange) {
      onFiltersChange({ ...filters, page: newPage });
    }
  };

  const handlePageSizeChange = (pageSize: number) => {
    if (onFiltersChange) {
      onFiltersChange({ ...filters, page_size: pageSize, page: 1 });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          {onAdd && (
            <Button onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              {addButtonLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {filterConfig.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && filterConfig.length > 0 && (
        <div className="bg-muted/50 p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filterConfig.map((filter) => (
              <div key={filter.name} className="space-y-2">
                <label className="text-sm font-medium">{filter.label}</label>
                {filter.type === 'select' && filter.options ? (
                  <select
                    value={filters[filter.name] || ''}
                    onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">All</option>
                    {filter.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : filter.type === 'checkbox' ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters[filter.name] || false}
                      onChange={(e) => handleFilterChange(filter.name, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>
                ) : (
                  <Input
                    value={filters[filter.name] || ''}
                    onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                    placeholder={`Filter by ${filter.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg bg-card">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-8 text-center">
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && data && data.results.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <p className="text-lg">No data found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Data Table */}
        {!isLoading && !error && data && data.results.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={column.className}
                    >
                      {column.sortable ? (
                        <button
                          onClick={() => handleSort(column.key)}
                          className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                          {column.label}
                          {sortColumn === column.key && (
                            <>
                              {sortDirection === 'asc' ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </>
                          )}
                        </button>
                      ) : (
                        column.label
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.results.map((item, index) => (
                  <TableRow
                    key={item.id || index}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={onRowClick ? 'cursor-pointer' : ''}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.key} className={column.className}>
                        {column.render
                          ? column.render(item)
                          : item[column.key]?.toString() || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <select
                  value={filters.page_size || 20}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {filters.page || 1} of {Math.ceil(data.count / (filters.page_size || 20))}
                  {' '}({data.count} total)
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange((filters.page || 1) - 1)}
                    disabled={!data.previous}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange((filters.page || 1) + 1)}
                    disabled={!data.next}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
