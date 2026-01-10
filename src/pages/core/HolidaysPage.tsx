/**
 * Holidays Page - Calendar-first management (create/update/delete)
 */

import { useMemo, useState } from 'react';
import { Trash2, CalendarClock, Gift, Flag, GraduationCap, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../components/ui/badge';
import { HolidayForm } from './components/HolidayForm';
import { holidayApi } from '../../services/core.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDeleteHoliday } from '../../hooks/useCore';
import { CollegeField } from '../../components/common/CollegeField';
import { useAuth } from '../../hooks/useAuth';
import { getCurrentUserCollege } from '@/utils/auth.utils';
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from '@/components/ui/calendar';
import { Card } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const HolidaysPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formOpen, setFormOpen] = useState(false);
  const [prefillDate, setPrefillDate] = useState<Date | null>(null);
  const [collegeFilter, setCollegeFilter] = useState<number | null>(getCurrentUserCollege(user as any));

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['holidays', collegeFilter],
    queryFn: () => holidayApi.list({ page_size: 500, college: collegeFilter || undefined }),
  });

  const { data: selected } = useQuery({
    queryKey: ['holiday', selectedId],
    queryFn: () => (selectedId ? holidayApi.get(selectedId) : null),
    enabled: !!selectedId,
  });

  const deleteMutation = useDeleteHoliday();
  const holidays = data?.results || [];

  const stats = useMemo(() => {
    const byType: Record<string, number> = {};
    holidays.forEach((h: any) => {
      byType[h.holiday_type] = (byType[h.holiday_type] || 0) + 1;
    });
    return byType;
  }, [holidays]);

  const holidayStatuses: Record<string, { id: string; name: string; color: string; icon: any }> = {
    national: { id: 'national', name: 'National', color: '#ef4444', icon: Flag },
    festival: { id: 'festival', name: 'Festival', color: '#f59e0b', icon: Gift },
    college: { id: 'college', name: 'College', color: '#3b82f6', icon: GraduationCap },
    exam: { id: 'exam', name: 'Exam', color: '#22c55e', icon: CalendarClock },
  };

  const calendarFeatures =
    holidays.map((h: any) => ({
      id: String(h.id),
      name: h.name,
      startAt: new Date(h.date),
      endAt: new Date(h.date),
      status: holidayStatuses[h.holiday_type] || { id: 'other', name: 'Holiday', color: '#6b7280' },
    })) || [];

  const handleSubmit = async (formData: any) => {
    if (formMode === 'create') {
      await holidayApi.create(formData);
    } else if (selected) {
      await holidayApi.update(selected.id, formData);
    }
    queryClient.invalidateQueries({ queryKey: ['holidays'] });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutate(id);
      toast.success('Holiday deleted successfully');
      refetch();
      setFormOpen(false);
      setSelectedId(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete holiday');
    }
  };

  const openCreate = (date?: Date) => {
    setSelectedId(null);
    setFormMode('create');
    setPrefillDate(date || null);
    setFormOpen(true);
  };

  const openEdit = (holidayId: number) => {
    setSelectedId(holidayId);
    setFormMode('edit');
    setFormOpen(true);
  };

  const toInputDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Holiday Calendar</h2>
            <p className="text-sm text-muted-foreground">Click a date to create, or a holiday to edit</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats).map(([type, count]) => {
              const status = holidayStatuses[type] || { icon: CalendarClock, color: '#6b7280' };
              const Icon = status.icon;
              return (
                <Badge
                  key={type}
                  className="flex items-center gap-1"
                  style={{ backgroundColor: status.color + '20', color: status.color }}
                >
                  <Icon className="h-4 w-4" />
                  {type} {count}
                </Badge>
              );
            })}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <CollegeField
              value={collegeFilter}
              onChange={(val) => setCollegeFilter(val ? Number(val) : null)}
              placeholder="Filter by college"
              className="min-w-[200px]"
            />
            <Button onClick={() => openCreate()} size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Add Holiday
            </Button>
          </div>
        </div>

        <div className="mt-4 border rounded-lg overflow-hidden">
          <CalendarProvider>
            <CalendarDate className="border-b">
              <CalendarDatePicker>
                <CalendarMonthPicker />
                <CalendarYearPicker start={2020} end={2035} />
              </CalendarDatePicker>
              <CalendarDatePagination />
            </CalendarDate>
            <CalendarHeader className="border-b" />
            <CalendarBody
              features={calendarFeatures}
              onDayClick={(date) => openCreate(date)}
              onFeatureClick={(feature) => openEdit(Number(feature.id))}
            >
              {({ feature }) => (
                <CalendarItem
                  key={feature.id}
                  feature={feature}
                  className="text-sm font-semibold hover:underline cursor-pointer px-2 py-1 rounded-md"
                  style={{ backgroundColor: feature.status.color + '30', color: feature.status.color }}
                />
              )}
            </CalendarBody>
          </CalendarProvider>
        </div>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{formMode === 'create' ? 'Add Holiday' : 'Edit Holiday'}</DialogTitle>
          </DialogHeader>
          <HolidayForm
            mode={formMode}
            holiday={formMode === 'edit' ? selected : undefined}
            initialValues={prefillDate ? { date: toInputDate(prefillDate) } : undefined}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['holidays'] });
              setFormOpen(false);
              setSelectedId(null);
            }}
            onCancel={() => {
              setFormOpen(false);
              setSelectedId(null);
            }}
            onSubmit={handleSubmit}
          />
          {formMode === 'edit' && selected && (
            <div className="flex justify-end pt-2">
              <Button
                variant="destructive"
                onClick={() => handleDelete(selected.id)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HolidaysPage;
