/**
 * Bulk Attendance Form Component
 * For marking attendance for multiple students at once
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBulkMarkStudentAttendance } from '../../hooks/useAttendance';
import { useStudents } from '../../hooks/useStudents';
import { useAcademicClasses, useSections } from '../../hooks/useAcademic';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import type { BulkAttendanceCreateInput } from '../../types/attendance.types';

interface BulkAttendanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface StudentSelection {
  student: number;
  status: 'present' | 'absent' | 'late' | 'excused' | 'half_day';
  remarks: string;
}

export const BulkAttendanceForm: React.FC<BulkAttendanceFormProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [defaultStatus, setDefaultStatus] = useState<'present' | 'absent' | 'late' | 'excused' | 'half_day'>('present');
  const [selectedStudents, setSelectedStudents] = useState<Map<number, StudentSelection>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch classes, sections, and students
  const { data: classesData } = useAcademicClasses({ page_size: 100 });
  const { data: sectionsData } = useSections({
    page_size: 100,
    class_obj: selectedClass ? Number(selectedClass) : undefined
  });
  const { data: studentsData } = useStudents({
    page_size: 1000,
    current_class: selectedClass ? Number(selectedClass) : undefined
  });

  const bulkMutation = useBulkMarkStudentAttendance();

  // Filter students based on search query
  const filteredStudents = studentsData?.results?.filter(student =>
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.admission_number.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleStudentToggle = (studentId: number, checked: boolean) => {
    const newSelections = new Map(selectedStudents);
    if (checked) {
      newSelections.set(studentId, {
        student: studentId,
        status: defaultStatus,
        remarks: '',
      });
    } else {
      newSelections.delete(studentId);
    }
    setSelectedStudents(newSelections);
  };

  const handleSelectAll = () => {
    const newSelections = new Map<number, StudentSelection>();
    filteredStudents.forEach(student => {
      newSelections.set(student.id, {
        student: student.id,
        status: defaultStatus,
        remarks: '',
      });
    });
    setSelectedStudents(newSelections);
  };

  const handleDeselectAll = () => {
    setSelectedStudents(new Map());
  };

  const handleStatusChange = (studentId: number, status: 'present' | 'absent' | 'late' | 'excused' | 'half_day') => {
    const newSelections = new Map(selectedStudents);
    const existing = newSelections.get(studentId);
    if (existing) {
      newSelections.set(studentId, { ...existing, status });
      setSelectedStudents(newSelections);
    }
  };

  const onSubmit = async () => {
    if (!selectedClass || !selectedSection || selectedStudents.size === 0) {
      return;
    }

    try {
      const data: BulkAttendanceCreateInput = {
        class_obj: Number(selectedClass),
        section: Number(selectedSection),
        date: format(date, 'yyyy-MM-dd'),
        attendance_records: Array.from(selectedStudents.values()),
      };

      await bulkMutation.mutateAsync(data);
      onSuccess?.();
      onOpenChange(false);
      // Reset form
      setSelectedClass('');
      setSelectedSection('');
      setSelectedStudents(new Map());
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to mark bulk attendance:', error);
    }
  };

  useEffect(() => {
    if (!open) {
      // Reset when dialog closes
      setSelectedClass('');
      setSelectedSection('');
      setSelectedStudents(new Map());
      setSearchQuery('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Mark Student Attendance</DialogTitle>
          <DialogDescription>
            Select class and section, then mark attendance for multiple students
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date */}
          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    if (newDate) setDate(newDate);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Class and Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Class *</Label>
              <Select
                value={selectedClass}
                onValueChange={(value) => {
                  setSelectedClass(value);
                  setSelectedSection('');
                  setSelectedStudents(new Map());
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classesData?.results?.map((classItem) => (
                    <SelectItem key={classItem.id} value={String(classItem.id)}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Section *</Label>
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
                disabled={!selectedClass}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedClass ? "Select section" : "Select class first"} />
                </SelectTrigger>
                <SelectContent>
                  {sectionsData?.results?.map((section) => (
                    <SelectItem key={section.id} value={String(section.id)}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Default Status */}
          <div className="space-y-2">
            <Label>Default Status</Label>
            <Select value={defaultStatus} onValueChange={(value: any) => setDefaultStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="excused">Excused</SelectItem>
                <SelectItem value="half_day">Half Day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Student Selection */}
          {selectedClass && selectedSection && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Select Students ({selectedStudents.size} selected)</Label>
                <div className="space-x-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={handleDeselectAll}>
                    Deselect All
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Student List */}
              <div className="border rounded-md max-h-[300px] overflow-y-auto">
                {filteredStudents.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No students found
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 hover:bg-accent"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={selectedStudents.has(student.id)}
                            onCheckedChange={(checked) =>
                              handleStudentToggle(student.id, checked as boolean)
                            }
                          />
                          <div>
                            <div className="font-medium">{student.full_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {student.admission_number}
                            </div>
                          </div>
                        </div>
                        {selectedStudents.has(student.id) && (
                          <Select
                            value={selectedStudents.get(student.id)?.status}
                            onValueChange={(value: any) => handleStatusChange(student.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="present">Present</SelectItem>
                              <SelectItem value="absent">Absent</SelectItem>
                              <SelectItem value="late">Late</SelectItem>
                              <SelectItem value="excused">Excused</SelectItem>
                              <SelectItem value="half_day">Half Day</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={
              !selectedClass ||
              !selectedSection ||
              selectedStudents.size === 0 ||
              bulkMutation.isPending
            }
          >
            {bulkMutation.isPending ? 'Marking...' : `Mark Attendance (${selectedStudents.size})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
