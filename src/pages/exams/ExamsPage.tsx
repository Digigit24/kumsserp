import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Calendar, Users, Eye } from 'lucide-react';

export const ExamsPage: React.FC = () => {
  const [exams] = useState([
    {
      id: '1',
      name: 'Mid-term Mathematics Exam',
      subject: 'Mathematics',
      class: 'Class 10-A',
      date: '2025-12-30',
      maxMarks: 100,
      duration: 180,
      status: 'scheduled',
    },
    {
      id: '2',
      name: 'Physics Final Exam',
      subject: 'Physics',
      class: 'Class 11-B',
      date: '2026-01-05',
      maxMarks: 100,
      duration: 180,
      status: 'draft',
    },
    {
      id: '3',
      name: 'Chemistry Quiz',
      subject: 'Chemistry',
      class: 'Class 12-A',
      date: '2025-12-28',
      maxMarks: 50,
      duration: 60,
      status: 'completed',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Examinations</h1>
          <p className="text-muted-foreground mt-2">Manage all examinations and tests</p>
        </div>
        <Link to="/exams/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Exam
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exams.filter(e => e.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exams.filter(e => e.status === 'draft').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exams.filter(e => e.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Examinations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Exam Name</th>
                  <th className="text-left p-3 font-medium">Subject</th>
                  <th className="text-left p-3 font-medium">Class</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Max Marks</th>
                  <th className="text-left p-3 font-medium">Duration</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{exam.name}</td>
                    <td className="p-3">{exam.subject}</td>
                    <td className="p-3">{exam.class}</td>
                    <td className="p-3">{new Date(exam.date).toLocaleDateString()}</td>
                    <td className="p-3">{exam.maxMarks}</td>
                    <td className="p-3">{exam.duration} min</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          exam.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : exam.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {exam.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
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
