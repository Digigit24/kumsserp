import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Clock, Download } from 'lucide-react';

export const SubmissionsPage: React.FC = () => {
  const mockSubmissions = [
    {
      id: '1',
      studentName: 'John Doe',
      rollNo: '001',
      submittedAt: '2025-12-25T10:30:00',
      status: 'submitted',
      grade: null,
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      rollNo: '002',
      submittedAt: '2025-12-25T14:20:00',
      status: 'submitted',
      grade: null,
    },
    {
      id: '3',
      studentName: 'Bob Johnson',
      rollNo: '015',
      submittedAt: '2025-12-24T09:15:00',
      status: 'graded',
      grade: 85,
    },
    {
      id: '4',
      studentName: 'Alice Williams',
      rollNo: '016',
      submittedAt: null,
      status: 'pending',
      grade: null,
    },
    {
      id: '5',
      studentName: 'Charlie Brown',
      rollNo: '030',
      submittedAt: '2025-12-26T08:45:00',
      status: 'submitted',
      grade: null,
    },
  ];

  const submittedCount = mockSubmissions.filter(s => s.status !== 'pending').length;
  const gradedCount = mockSubmissions.filter(s => s.status === 'graded').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Assignment Submissions</h1>
        <p className="text-muted-foreground mt-2">
          Review and grade student submissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Algebra Assignment - Class 10-A</CardTitle>
          <p className="text-sm text-muted-foreground">Due: December 30, 2025</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Students</span>
              </div>
              <div className="text-2xl font-bold">{mockSubmissions.length}</div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Submitted</span>
              </div>
              <div className="text-2xl font-bold">{submittedCount}</div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Graded</span>
              </div>
              <div className="text-2xl font-bold">{gradedCount}</div>
            </div>
          </div>

          <div className="space-y-3">
            {mockSubmissions.map((submission) => (
              <div key={submission.id} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{submission.studentName}</h3>
                      <span className="text-sm text-muted-foreground">
                        Roll No: {submission.rollNo}
                      </span>
                    </div>

                    {submission.submittedAt ? (
                      <p className="text-sm text-muted-foreground">
                        Submitted on: {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-sm text-orange-600">Not submitted yet</p>
                    )}

                    {submission.grade !== null && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-800">
                          Grade: {submission.grade}/100
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      submission.status === 'graded'
                        ? 'bg-green-100 text-green-800'
                        : submission.status === 'submitted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {submission.status === 'graded' ? 'Graded' :
                       submission.status === 'submitted' ? 'Submitted' : 'Pending'}
                    </span>

                    {submission.status !== 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        {submission.status === 'submitted' && (
                          <Button size="sm">Grade</Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
