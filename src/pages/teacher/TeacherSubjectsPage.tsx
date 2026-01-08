import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BookOpen, Users, Clock, FileText, Settings, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSubjectAssignments } from '@/hooks/useAcademic';
import { useStudents } from '@/hooks/useStudents';
import { useAuth } from '@/hooks/useAuth';

export const TeacherSubjectsPage: React.FC = () => {
  const { user } = useAuth();
  const [syllabusDialogOpen, setSyllabusDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);

  // Fetch subject assignments for the logged-in teacher
  const { data: assignmentsData, isLoading: isLoadingAssignments } = useSubjectAssignments({
    teacher: user?.id,
    is_active: true,
    page_size: 100,
  });

  // Fetch students data
  const { data: studentsData, isLoading: isLoadingStudents } = useStudents({
    is_active: true,
    page_size: 1000,
  });

  // Group assignments by subject and calculate statistics
  const mySubjects = useMemo(() => {
    if (!assignmentsData?.results) return [];

    const subjectMap = new Map();

    assignmentsData.results.forEach(assignment => {
      const subjectId = assignment.subject;

      if (!subjectMap.has(subjectId)) {
        subjectMap.set(subjectId, {
          id: subjectId,
          name: assignment.subject_name,
          code: assignment.subject_details?.code || `SUB-${subjectId}`,
          classes: [],
          classIds: new Set(),
          sectionIds: new Set(),
          students: 0,
        });
      }

      const subject = subjectMap.get(subjectId);
      const classLabel = assignment.section_name
        ? `${assignment.class_name} - ${assignment.section_name}`
        : assignment.class_name;

      if (!subject.classes.includes(classLabel)) {
        subject.classes.push(classLabel);
      }

      subject.classIds.add(assignment.class_obj);
      if (assignment.section) {
        subject.sectionIds.add(assignment.section);
      }
    });

    // Calculate student counts for each subject
    if (studentsData?.results) {
      subjectMap.forEach(subject => {
        const studentCount = studentsData.results.filter(student => {
          if (!student.current_class || !subject.classIds.has(student.current_class)) {
            return false;
          }
          if (subject.sectionIds.size > 0 && student.current_section) {
            return subject.sectionIds.has(student.current_section);
          }
          return true;
        }).length;
        subject.students = studentCount;
      });
    }

    return Array.from(subjectMap.values()).map(({ classIds, sectionIds, ...subject }) => subject);
  }, [assignmentsData, studentsData]);

  const stats = useMemo(() => ({
    totalSubjects: mySubjects.length,
    totalStudents: mySubjects.reduce((sum, subject) => sum + subject.students, 0),
    totalClasses: new Set(assignmentsData?.results?.map(a => `${a.class_obj}-${a.section}`) || []).size,
  }), [mySubjects, assignmentsData]);

  const isLoading = isLoadingAssignments || isLoadingStudents;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Subjects</h1>
        <p className="text-muted-foreground mt-2">
          Manage subjects you teach and view related information
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubjects}</div>
            <p className="text-xs text-muted-foreground">Active subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">Unique class sections</p>
          </CardContent>
        </Card>
      </div>

      {mySubjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">No subjects assigned yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Contact your administrator to get subject assignments
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {mySubjects.map((subject) => (
            <Card key={subject.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{subject.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{subject.code}</p>
                  </div>
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{subject.students} students</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Classes:</p>
                    <div className="flex flex-wrap gap-2">
                      {subject.classes.map((cls: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedSubject(subject);
                        setSyllabusDialogOpen(true);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View Syllabus
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedSubject(subject);
                        setManageDialogOpen(true);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Syllabus Dialog */}
      <Dialog open={syllabusDialogOpen} onOpenChange={setSyllabusDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Subject Syllabus</DialogTitle>
            <DialogDescription>
              {selectedSubject && `${selectedSubject.name} (${selectedSubject.code})`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">Syllabus Not Available</p>
              <p className="text-sm text-muted-foreground mt-2">
                Syllabus management functionality will be available soon
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setSyllabusDialogOpen(false)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Subject Dialog */}
      <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Subject</DialogTitle>
            <DialogDescription>
              {selectedSubject && `${selectedSubject.name} (${selectedSubject.code})`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-24 flex-col gap-2"
                onClick={() => {
                  setManageDialogOpen(false);
                  toast.success('Opening assignment management...');
                }}
              >
                <Plus className="h-6 w-6" />
                <span>Create Assignment</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2"
                onClick={() => toast.info('View assignments functionality coming soon')}
              >
                <FileText className="h-6 w-6" />
                <span>View Assignments</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2"
                onClick={() => toast.info('Add study material functionality coming soon')}
              >
                <BookOpen className="h-6 w-6" />
                <span>Study Materials</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2"
                onClick={() => toast.info('Grade management functionality coming soon')}
              >
                <Users className="h-6 w-6" />
                <span>Manage Grades</span>
              </Button>
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={() => setManageDialogOpen(false)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
