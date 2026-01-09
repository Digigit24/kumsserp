/**
 * Universal DetailSidebar Component
 * Slide-out sidebar for displaying details, create, and edit forms
 */

import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface DetailSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  mode: 'view' | 'create' | 'edit';
  children: ReactNode;
  footer?: ReactNode;
  data?: unknown;
  onEdit?: () => void;
  onDelete?: () => void;
  width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
}

const widthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  'full': 'max-w-full',
};

export function DetailSidebar({
  isOpen,
  onClose,
  title,
  subtitle,
  mode,
  children,
  footer,
  width = 'xl',
}: DetailSidebarProps) {
  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getModeLabel = () => {
    switch (mode) {
      case 'create':
        return 'Create New';
      case 'edit':
        return 'Edit';
      case 'view':
        return 'View Details';
      default:
        return '';
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed right-0 top-0 bottom-0 z-50 bg-background border-l shadow-2xl transition-transform',
          'w-full',
          widthClasses[width],
          'transform translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-6 py-4 border-b-2 bg-card dark:bg-card shadow-sm">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-card-foreground dark:text-card-foreground truncate">{title}</h2>
              {(subtitle || getModeLabel()) && (
                <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-0.5">
                  {subtitle || getModeLabel()}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full flex-shrink-0 hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t bg-muted/30">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
