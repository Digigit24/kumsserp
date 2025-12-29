import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BookOpen, Users, Clock, FileText, Settings, Plus } from 'lucide-react';
import { toast } from 'sonner';

export const TeacherSubjectsPage: React.FC = () => {
  const [syllabusDialogOpen, setSyllabusDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);

  const mockSyllabus = [
    { unit: 'Unit 1', topic: 'Introduction to Algebra', duration: '2 weeks', status: 'Completed' },
    { unit: 'Unit 2', topic: 'Quadratic Equations', duration: '3 weeks', status: 'In Progress' },
    { unit: 'Unit 3', topic: 'Trigonometry', duration: '4 weeks', status: 'Pending' },
    { unit: 'Unit 4', topic: 'Calculus Basics', duration: '4 weeks', status: 'Pending' },
  ];

  const mockSubjects = [
    {
      id: '1',
      name: 'Mathematics',
      code: 'MATH101',
      classes: ['Class 10-A', 'Class 12-A'],
      students: 70,
      hoursPerWeek: 6,
    },
    {
      id: '2',
      name: 'Physics',
      code: 'PHY201',
      classes: ['Class 11-B'],
      students: 30,
      hoursPerWeek: 4,
    },
    {
      id: '3',
      name: 'Advanced Mathematics',
      code: 'MATH301',
      classes: ['Class 12-A'],
      students: 35,
      hoursPerWeek: 5,
    },
  ];

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
            <div className="text-2xl font-bold">{mockSubjects.length}</div>
            <p className="text-xs text-muted-foreground">Active subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSubjects.reduce((sum, subject) => sum + subject.students, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSubjects.reduce((sum, subject) => sum + subject.hoursPerWeek, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Teaching hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockSubjects.map((subject) => (
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
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{subject.hoursPerWeek} hours/week</span>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Classes:</p>
                  <div className="flex flex-wrap gap-2">
                    {subject.classes.map((cls, idx) => (
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
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Unit</th>
                    <th className="text-left p-3 font-medium">Topic</th>
                    <th className="text-left p-3 font-medium">Duration</th>
                    <th className="text-left p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSyllabus.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-3 font-medium">{item.unit}</td>
                      <td className="p-3">{item.topic}</td>
                      <td className="p-3">{item.duration}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => toast.info('Download syllabus functionality coming soon')} variant="outline" className="flex-1">
                Download PDF
              </Button>
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
