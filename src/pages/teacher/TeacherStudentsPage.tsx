import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, GraduationCap, TrendingUp, Mail, Phone, Calendar, BookOpen, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSubjectAssignments } from '@/hooks/useAcademic';
import { useStudents } from '@/hooks/useStudents';
import { useAuth } from '@/hooks/useAuth';

export const TeacherStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch subject assignments for the logged-in teacher
  const { data: assignmentsData, isLoading: isLoadingAssignments } = useSubjectAssignments({
    teacher: user?.id,
    is_active: true,
    page_size: 100,
  });

  // Get unique class and section combinations
  const classFilters = useMemo(() => {
    if (!assignmentsData?.results) return [];
    const uniqueClasses = new Map();
    assignmentsData.results.forEach(assignment => {
      const key = `${assignment.class_obj}-${assignment.section}`;
      if (!uniqueClasses.has(key)) {
        uniqueClasses.set(key, {
          class_obj: assignment.class_obj,
          section: assignment.section,
          class_name: assignment.class_name,
          section_name: assignment.section_name,
        });
      }
    });
    return Array.from(uniqueClasses.values());
  }, [assignmentsData]);

  // Fetch students for all assigned classes
  const { data: studentsData, isLoading: isLoadingStudents } = useStudents({
    is_active: true,
    page_size: 1000, // Get all students from teacher's classes
  });

  // Filter and map students from teacher's classes
  const myStudents = useMemo(() => {
    if (!studentsData?.results || !classFilters.length) return [];

    const classIds = new Set(classFilters.map(c => c.class_obj));
    const sectionIds = new Set(classFilters.map(c => c.section).filter(Boolean));

    return studentsData.results
      .filter(student => {
        // Student must be in one of the teacher's classes
        if (!student.current_class || !classIds.has(student.current_class)) {
          return false;
        }
        // If the class has a section, student must be in that section
        if (student.current_section && sectionIds.size > 0) {
          return sectionIds.has(student.current_section);
        }
        return true;
      })
      .map(student => ({
        id: student.id,
        name: student.full_name,
        class: student.current_class_name || 'N/A',
        rollNo: student.admission_number,
        attendance: 0, // TODO: Calculate from attendance records
        email: student.email,
        phone: student.phone || 'N/A',
        dateOfBirth: student.date_of_birth,
        guardianName: 'N/A', // Will be populated from guardian relationship
        guardianPhone: 'N/A',
        performance: 'N/A',
        subjects: [],
      }));
  }, [studentsData, classFilters]);

  const stats = useMemo(() => ({
    totalStudents: myStudents.length,
    avgAttendance: 0, // TODO: Calculate from attendance records
    activeClasses: classFilters.length,
  }), [myStudents, classFilters]);

  const isLoading = isLoadingAssignments || isLoadingStudents;

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Students</h1>
        <p className="text-muted-foreground mt-2">
          View and manage students from your classes
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.activeClasses} {stats.activeClasses === 1 ? 'class' : 'classes'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClasses}</div>
            <p className="text-xs text-muted-foreground">Current semester</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>
        <CardContent>
          {myStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No students found in your assigned classes</p>
              <p className="text-sm mt-2">Students will appear here once they are enrolled in your classes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Admission No</th>
                    <th className="text-left p-3 font-medium">Name</th>
                    <th className="text-left p-3 font-medium">Class</th>
                    <th className="text-left p-3 font-medium">Email</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">{student.rollNo}</td>
                      <td className="p-3">{student.name}</td>
                      <td className="p-3">{student.class}</td>
                      <td className="p-3 text-sm text-muted-foreground">{student.email}</td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(student)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base font-semibold">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admission Number</p>
                  <p className="text-base font-semibold">{selectedStudent.rollNo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Class</p>
                  <p className="text-base">{selectedStudent.class}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p className="text-base">{new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm">{selectedStudent.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guardian Info */}
              {selectedStudent.guardianName !== 'N/A' && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Guardian Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Guardian Name</p>
                      <p className="text-sm">{selectedStudent.guardianName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Guardian Phone</p>
                      <p className="text-sm">{selectedStudent.guardianPhone}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => setIsDetailsOpen(false)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
