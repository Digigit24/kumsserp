/**
 * Student Detail Page
 * Comprehensive student profile with tabs for all related information
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, Calendar, User, MapPin, FileText, Heart, GraduationCap, Award, CreditCard } from 'lucide-react';
import { useStudent } from '../../hooks/useStudents';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export const StudentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const studentId = id ? parseInt(id) : null;

  const { data: student, isLoading, error } = useStudent(studentId);
  const [activeTab, setActiveTab] = useState('personal');

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <p className="text-muted-foreground">Loading student details...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
          Error: {error || 'Student not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/students/list')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{student.full_name}</h1>
            <p className="text-muted-foreground mt-1">
              {student.admission_number} • {student.program_name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={student.is_active ? 'success' : 'destructive'}>
            {student.is_active ? 'Active' : 'Inactive'}
          </Badge>
          {student.is_alumni && <Badge variant="outline">Alumni</Badge>}
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Student
          </Button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Class</p>
              <p className="font-semibold">{student.current_class_name || 'Not Assigned'}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Mail className="h-5 w-5 text-blue-500" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold text-sm truncate">{student.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Phone className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-semibold">{student.phone || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admission Date</p>
              <p className="font-semibold">{student.admission_date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="personal">
            <User className="h-4 w-4 mr-2" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="academic">
            <GraduationCap className="h-4 w-4 mr-2" />
            Academic
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Phone className="h-4 w-4 mr-2" />
            Contact & Address
          </TabsTrigger>
          <TabsTrigger value="guardians">
            <User className="h-4 w-4 mr-2" />
            Guardians
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="medical">
            <Heart className="h-4 w-4 mr-2" />
            Medical
          </TabsTrigger>
          <TabsTrigger value="certificates">
            <Award className="h-4 w-4 mr-2" />
            Certificates
          </TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <p className="font-medium">{student.full_name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Date of Birth</label>
                <p className="font-medium">{student.date_of_birth}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Gender</label>
                <p className="font-medium capitalize">{student.gender}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Blood Group</label>
                <p className="font-medium">{student.blood_group || 'Not Specified'}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Nationality</label>
                <p className="font-medium">{student.nationality}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Religion</label>
                <p className="font-medium">{student.religion || 'Not Specified'}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Caste</label>
                <p className="font-medium">{student.caste || 'Not Specified'}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Mother Tongue</label>
                <p className="font-medium">{student.mother_tongue || 'Not Specified'}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Aadhar Number</label>
                <p className="font-medium">{student.aadhar_number || 'Not Provided'}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">PAN Number</label>
                <p className="font-medium">{student.pan_number || 'Not Provided'}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Academic Info Tab */}
        <TabsContent value="academic">
          <div className="space-y-4">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Current Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-muted-foreground">Admission Number</label>
                  <p className="font-medium">{student.admission_number}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Registration Number</label>
                  <p className="font-medium">{student.registration_number}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Admission Date</label>
                  <p className="font-medium">{student.admission_date}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Admission Type</label>
                  <p className="font-medium">{student.admission_type}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Program</label>
                  <p className="font-medium">{student.program_name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Current Class</label>
                  <p className="font-medium">{student.current_class_name || 'Not Assigned'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Section</label>
                  <p className="font-medium">{student.current_section_name || 'Not Assigned'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Roll Number</label>
                  <p className="font-medium">{student.roll_number || 'Not Assigned'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Category</label>
                  <p className="font-medium">{student.category_name || 'Not Specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Group</label>
                  <p className="font-medium">{student.group_name || 'Not Specified'}</p>
                </div>
              </div>
            </div>

            {student.optional_subjects && student.optional_subjects.length > 0 && (
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Optional Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {student.optional_subjects.map((subjectId) => (
                    <Badge key={subjectId} variant="secondary">
                      Subject ID: {subjectId}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Contact & Address Tab */}
        <TabsContent value="contact">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground">Email Address</label>
                <p className="font-medium">{student.email}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone Number</label>
                <p className="font-medium">{student.phone || 'Not Provided'}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Alternate Phone</label>
                <p className="font-medium">{student.alternate_phone || 'Not Provided'}</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-2">Detailed addresses available in Address module</p>
            </div>
          </div>
        </TabsContent>

        {/* Guardians Tab */}
        <TabsContent value="guardians">
          <div className="bg-card border rounded-lg p-6">
            <div className="text-center py-12 text-muted-foreground">
              <p>Guardian information will be fetched from the Student Guardians module</p>
              <p className="text-sm mt-2">This requires a separate API call to /students/student-guardians/</p>
            </div>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <div className="bg-card border rounded-lg p-6">
            <div className="text-center py-12 text-muted-foreground">
              <p>Student documents will be fetched from the Documents module</p>
              <p className="text-sm mt-2">This requires a separate API call to /students/documents/</p>
            </div>
          </div>
        </TabsContent>

        {/* Medical Tab */}
        <TabsContent value="medical">
          <div className="bg-card border rounded-lg p-6">
            <div className="text-center py-12 text-muted-foreground">
              <p>Medical records will be fetched from the Medical Records module</p>
              <p className="text-sm mt-2">This requires a separate API call to /students/medical-records/</p>
            </div>
          </div>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates">
          <div className="bg-card border rounded-lg p-6">
            <div className="text-center py-12 text-muted-foreground">
              <p>Certificates will be fetched from the Certificates module</p>
              <p className="text-sm mt-2">This requires a separate API call to /students/certificates/</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Debug: Raw API Data */}
      <details className="bg-muted p-4 rounded-lg">
        <summary className="cursor-pointer font-semibold mb-2">Raw API Response (Debug)</summary>
        <pre className="text-xs overflow-auto max-h-96">
          {JSON.stringify(student, null, 2)}
        </pre>
      </details>
    </div>
  );
};
