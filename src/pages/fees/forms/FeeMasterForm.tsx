/**
 * Fee Master Form Component
 * Create/Edit form for fee masters
 */

import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { SearchableSelect, SearchableSelectOption } from '../../../components/ui/searchable-select';
import { FeeMaster, FeeMasterCreateInput } from '../../../types/fees.types';
import { usePrograms } from '../../../hooks/useAcademic';
import { useAcademicSessions } from '../../../hooks/useCore';

interface FeeMasterFormProps {
  feeMaster: FeeMaster | null;
  onSubmit: (data: Partial<FeeMasterCreateInput>) => void;
  onCancel: () => void;
}

export const FeeMasterForm = ({ feeMaster, onSubmit, onCancel }: FeeMasterFormProps) => {
  const [formData, setFormData] = useState<Partial<FeeMasterCreateInput>>({
    semester: 1,
    amount: '0',
    college: 0,
    program: 0,
    academic_year: 0,
    fee_type: 0,
    is_active: true,
  });

  // Fetch dropdowns data
  const { data: programsData } = usePrograms({ page_size: 1000 });
  const { data: academicSessionsData } = useAcademicSessions({ page_size: 1000 });

  // Create options for dropdowns
  const programOptions: SearchableSelectOption[] = useMemo(() => {
    if (!programsData?.results) return [];
    return programsData.results.map((program) => ({
      value: program.id,
      label: program.name,
      subtitle: `${program.code || ''} • ${program.department_name || ''}`,
    }));
  }, [programsData]);

  const academicYearOptions: SearchableSelectOption[] = useMemo(() => {
    if (!academicSessionsData?.results) return [];
    return academicSessionsData.results.map((session) => ({
      value: session.id,
      label: session.name,
      subtitle: `${session.start_date} to ${session.end_date}`,
    }));
  }, [academicSessionsData]);

  useEffect(() => {
    if (feeMaster) {
      setFormData({
        semester: feeMaster.semester,
        amount: feeMaster.amount,
        college: feeMaster.college,
        program: feeMaster.program,
        academic_year: feeMaster.academic_year,
        fee_type: feeMaster.fee_type,
        is_active: feeMaster.is_active,
      });
    } else {
      // Auto-populate college from user data
      const storedUser = localStorage.getItem('kumss_user');
      let collegeId = 1;

      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user?.college) {
          collegeId = user.college;
        } else if (user?.user_roles && user.user_roles.length > 0) {
          const primaryRole = user.user_roles.find((r: any) => r.is_primary) || user.user_roles[0];
          collegeId = primaryRole.college_id || 1;
        }
      }

      setFormData(prev => ({ ...prev, college: collegeId }));
    }
  }, [feeMaster]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('kumss_user_id') || undefined;
    const submitData: any = { ...formData };

    if (!feeMaster && userId) {
      submitData.created_by = userId;
      submitData.updated_by = userId;
    } else if (feeMaster && userId) {
      submitData.updated_by = userId;
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="program">Program *</Label>
        <SearchableSelect
          options={programOptions}
          value={formData.program}
          onChange={(value) => setFormData({ ...formData, program: Number(value) })}
          placeholder="Select program"
          searchPlaceholder="Search programs..."
          emptyText="No programs available"
          disabled={!!feeMaster}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="academic_year">Academic Year *</Label>
        <SearchableSelect
          options={academicYearOptions}
          value={formData.academic_year}
          onChange={(value) => setFormData({ ...formData, academic_year: Number(value) })}
          placeholder="Select academic year"
          searchPlaceholder="Search academic years..."
          emptyText="No academic years available"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fee_type">Fee Type *</Label>
        <Input
          id="fee_type"
          type="number"
          value={formData.fee_type}
          onChange={(e) => setFormData({ ...formData, fee_type: parseInt(e.target.value) || 0 })}
          placeholder="Fee Type ID"
          required
          min="1"
        />
        <p className="text-xs text-muted-foreground">Note: Fee type dropdown will be available once API is implemented</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester">Semester *</Label>
        <Input
          id="semester"
          type="number"
          value={formData.semester}
          onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
          placeholder="Semester number"
          required
          min="1"
          max="10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (₹) *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
          required
          min="0"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {feeMaster ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
