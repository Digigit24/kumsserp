/**
 * Student Medical Records Page
 * Displays all student medical records with CRUD operations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '../../hooks/useStudents';
import { useMedicalRecords, useCreateMedicalRecord, useDeleteMedicalRecord } from '../../hooks/useMedicalRecords';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SideDrawer, SideDrawerContent } from '../../components/common/SideDrawer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Heart } from 'lucide-react';
import type { StudentMedicalRecord } from '../../types/students.types';
import { isAdmin, isTeacher } from '@/utils/permissions';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const MedicalRecordsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useMedicalRecords(filters);
  const { data: studentsData } = useStudents({ page_size: 100, is_active: true });
  const createMutation = useCreateMedicalRecord();
  const deleteMutation = useDeleteMedicalRecord();

  const canManageRecords = isAdmin() || isTeacher();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<StudentMedicalRecord | null>(null);
  const [medicalDialogOpen, setMedicalDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    blood_group: '',
    height: '',
    weight: '',
    allergies: '',
    medical_conditions: '',
    medications: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: '',
    health_insurance_provider: '',
    health_insurance_number: '',
    last_checkup_date: '',
    is_active: true,
  });

  const errorMessage = error instanceof Error ? error.message : null;

  // Define table columns
  const columns: Column<StudentMedicalRecord>[] = [
    {
      key: 'student_name',
      label: 'Student',
      render: (record) => record.student_name || `Student #${record.student}`,
    },
    {
      key: 'blood_group',
      label: 'Blood Group',
      render: (record) => record.blood_group || '-',
    },
    {
      key: 'emergency_contact_name',
      label: 'Emergency Contact',
      render: (record) => (
        <div>
          <p className="font-medium">{record.emergency_contact_name || '-'}</p>
          <p className="text-xs text-muted-foreground">{record.emergency_contact_phone || '-'}</p>
        </div>
      ),
    },
    {
      key: 'health_insurance_provider',
      label: 'Insurance',
      render: (record) => record.health_insurance_provider || '-',
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (record) => (
        <Badge variant={record.is_active ? 'success' : 'secondary'}>
          {record.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  if (canManageRecords) {
    columns.push({
      key: 'actions',
      label: 'Actions',
      render: (record) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/students/${record.student}`)}>
            View Profile
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </div>
      ),
    });
  }

  const handleAdd = () => {
    setSelectedRecord(null);
    setSelectedStudentId(null);
    setFormData({
      blood_group: '',
      height: '',
      weight: '',
      allergies: '',
      medical_conditions: '',
      medications: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relation: '',
      health_insurance_provider: '',
      health_insurance_number: '',
      last_checkup_date: '',
      is_active: true,
    });
    setMedicalDialogOpen(true);
  };

  const handleDelete = (record: StudentMedicalRecord) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedRecord) {
      await deleteMutation.mutateAsync(selectedRecord.id);
      refetch();
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedStudentId) {
      alert('Please select a student');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        student: selectedStudentId,
        blood_group: formData.blood_group || null,
        height: formData.height || null,
        weight: formData.weight || null,
        allergies: formData.allergies || null,
        medical_conditions: formData.medical_conditions || null,
        medications: formData.medications || null,
        emergency_contact_name: formData.emergency_contact_name || null,
        emergency_contact_phone: formData.emergency_contact_phone || null,
        emergency_contact_relation: formData.emergency_contact_relation || null,
        health_insurance_provider: formData.health_insurance_provider || null,
        health_insurance_number: formData.health_insurance_number || null,
        last_checkup_date: formData.last_checkup_date || null,
        is_active: formData.is_active,
      };

      await createMutation.mutateAsync(payload);
      refetch();
      setMedicalDialogOpen(false);
      setSelectedStudentId(null);
    } catch (err) {
      console.error('Failed to save medical record:', err);
      alert('Failed to save medical record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <DataTable
        title="Student Medical Records"
        description="Manage all student medical records across the system"
        data={data || null}
        columns={columns}
        isLoading={isLoading}
        error={errorMessage}
        onRefresh={refetch}
        onAdd={canManageRecords ? handleAdd : undefined}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search by student, blood group..."
        addButtonLabel="Add Medical Record"
      />

      {/* Add Medical Record Dialog with Student Selector */}
      <SideDrawer open={medicalDialogOpen} onOpenChange={setMedicalDialogOpen}>
        <SideDrawerContent
          title="Add Medical Record"
          description="Select a student and add their medical information"
          size="lg"
          footer={
            selectedStudentId && (
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setMedicalDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} loading={isSubmitting}>
                  Save Medical Record
                </Button>
              </div>
            )
          }
        >
          <div className="space-y-4">
            {/* Student Selector */}
            <div className="space-y-2">
              <Label>Select Student <span className="text-destructive">*</span></Label>
              <Select
                value={selectedStudentId?.toString() || ''}
                onValueChange={(value) => setSelectedStudentId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent>
                  {studentsData?.results?.map((student) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.full_name} ({student.admission_number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Show medical form only when student is selected */}
            {selectedStudentId ? (
              <div className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Blood Group</Label>
                    <Select
                      value={formData.blood_group}
                      onValueChange={(value) => setFormData({ ...formData, blood_group: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map((bg) => (
                          <SelectItem key={bg} value={bg}>
                            {bg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="e.g., 170"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="e.g., 65"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Last Checkup Date</Label>
                    <Input
                      type="date"
                      value={formData.last_checkup_date}
                      onChange={(e) => setFormData({ ...formData, last_checkup_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Allergies</Label>
                  <Textarea
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="List any known allergies..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Medical Conditions</Label>
                  <Textarea
                    value={formData.medical_conditions}
                    onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
                    placeholder="List any existing medical conditions..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Current Medications</Label>
                  <Textarea
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                    placeholder="List any current medications..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>Emergency Contact Name</Label>
                    <Input
                      value={formData.emergency_contact_name}
                      onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                      placeholder="Enter emergency contact name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Emergency Contact Phone</Label>
                      <Input
                        value={formData.emergency_contact_phone}
                        onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Relation</Label>
                      <Input
                        value={formData.emergency_contact_relation}
                        onChange={(e) => setFormData({ ...formData, emergency_contact_relation: e.target.value })}
                        placeholder="e.g., Father, Mother"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Health Insurance Provider</Label>
                    <Input
                      value={formData.health_insurance_provider}
                      onChange={(e) => setFormData({ ...formData, health_insurance_provider: e.target.value })}
                      placeholder="Enter provider name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Insurance Number</Label>
                    <Input
                      value={formData.health_insurance_number}
                      onChange={(e) => setFormData({ ...formData, health_insurance_number: e.target.value })}
                      placeholder="Enter policy number"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Please select a student to add medical record</p>
              </div>
            )}
          </div>
        </SideDrawerContent>
      </SideDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Medical Record"
        description="Are you sure you want to delete this medical record? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
};
