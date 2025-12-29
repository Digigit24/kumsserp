import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, GraduationCap, TrendingUp, Mail, Phone, Calendar, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const TeacherStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const mockStudents = [
    {
      id: '1',
      name: 'John Doe',
      class: 'Class 10-A',
      rollNo: '001',
      attendance: 92,
      email: 'john.doe@example.com',
      phone: '+91 98765 43210',
      dateOfBirth: '2008-05-15',
      guardianName: 'Robert Doe',
      guardianPhone: '+91 98765 43211',
      performance: 'Excellent',
      subjects: ['Mathematics', 'Physics', 'Chemistry']
    },
    {
      id: '2',
      name: 'Jane Smith',
      class: 'Class 10-A',
      rollNo: '002',
      attendance: 88,
      email: 'jane.smith@example.com',
      phone: '+91 98765 43212',
      dateOfBirth: '2008-08-22',
      guardianName: 'Mary Smith',
      guardianPhone: '+91 98765 43213',
      performance: 'Good',
      subjects: ['Mathematics', 'Biology', 'Chemistry']
    },
    {
      id: '3',
      name: 'Bob Johnson',
      class: 'Class 11-B',
      rollNo: '015',
      attendance: 95,
      email: 'bob.johnson@example.com',
      phone: '+91 98765 43214',
      dateOfBirth: '2007-03-10',
      guardianName: 'Tom Johnson',
      guardianPhone: '+91 98765 43215',
      performance: 'Excellent',
      subjects: ['Physics', 'Mathematics', 'Computer Science']
    },
    {
      id: '4',
      name: 'Alice Williams',
      class: 'Class 11-B',
      rollNo: '016',
      attendance: 90,
      email: 'alice.williams@example.com',
      phone: '+91 98765 43216',
      dateOfBirth: '2007-11-18',
      guardianName: 'Sarah Williams',
      guardianPhone: '+91 98765 43217',
      performance: 'Good',
      subjects: ['Biology', 'Chemistry', 'Physics']
    },
    {
      id: '5',
      name: 'Charlie Brown',
      class: 'Class 12-A',
      rollNo: '030',
      attendance: 85,
      email: 'charlie.brown@example.com',
      phone: '+91 98765 43218',
      dateOfBirth: '2006-07-25',
      guardianName: 'Lucy Brown',
      guardianPhone: '+91 98765 43219',
      performance: 'Average',
      subjects: ['Mathematics', 'Physics', 'Chemistry']
    },
  ];

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

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
            <div className="text-2xl font-bold">95</div>
            <p className="text-xs text-muted-foreground">Across 3 classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Current semester</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Roll No</th>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Class</th>
                  <th className="text-left p-3 font-medium">Attendance</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">{student.rollNo}</td>
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.class}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        student.attendance >= 90 ? 'bg-green-100 text-green-800' :
                        student.attendance >= 75 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.attendance}%
                      </span>
                    </td>
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
                  <p className="text-sm font-medium text-muted-foreground">Roll Number</p>
                  <p className="text-base font-semibold">{selectedStudent.rollNo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Class</p>
                  <p className="text-base">{selectedStudent.class}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                  <Badge variant={selectedStudent.attendance >= 90 ? 'success' : selectedStudent.attendance >= 75 ? 'default' : 'destructive'}>
                    {selectedStudent.attendance}%
                  </Badge>
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
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date of Birth</p>
                      <p className="text-sm">{new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guardian Info */}
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

              {/* Academic Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Academic Performance</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Overall Performance</p>
                    <Badge variant={selectedStudent.performance === 'Excellent' ? 'success' : selectedStudent.performance === 'Good' ? 'default' : 'secondary'}>
                      {selectedStudent.performance}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Subjects</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.subjects.map((subject: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

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
