import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, GraduationCap, TrendingUp } from 'lucide-react';

export const TeacherStudentsPage: React.FC = () => {
  const mockStudents = [
    { id: '1', name: 'John Doe', class: 'Class 10-A', rollNo: '001', attendance: 92 },
    { id: '2', name: 'Jane Smith', class: 'Class 10-A', rollNo: '002', attendance: 88 },
    { id: '3', name: 'Bob Johnson', class: 'Class 11-B', rollNo: '015', attendance: 95 },
    { id: '4', name: 'Alice Williams', class: 'Class 11-B', rollNo: '016', attendance: 90 },
    { id: '5', name: 'Charlie Brown', class: 'Class 12-A', rollNo: '030', attendance: 85 },
  ];

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
                      <Button size="sm" variant="outline">View Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
