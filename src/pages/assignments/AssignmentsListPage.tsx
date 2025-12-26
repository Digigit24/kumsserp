import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Clock, Users, Plus } from 'lucide-react';

export const AssignmentsListPage: React.FC = () => {
  const mockAssignments = [
    {
      id: '1',
      title: 'Algebra Assignment',
      subject: 'Mathematics',
      class: 'Class 10-A',
      dueDate: '2025-12-30',
      totalStudents: 35,
      submissions: 28,
      status: 'active',
    },
    {
      id: '2',
      title: 'Thermodynamics Lab Report',
      subject: 'Physics',
      class: 'Class 11-B',
      dueDate: '2025-12-29',
      totalStudents: 30,
      submissions: 15,
      status: 'active',
    },
    {
      id: '3',
      title: 'Calculus Problem Set',
      subject: 'Advanced Mathematics',
      class: 'Class 12-A',
      dueDate: '2025-12-27',
      totalStudents: 35,
      submissions: 35,
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your assignments
          </p>
        </div>
        <Link to="/assignments/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAssignments.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAssignments.filter(a => a.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Ongoing assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAssignments.reduce((sum, a) => sum + (a.totalStudents - a.submissions), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Students pending</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAssignments.map((assignment) => (
              <div key={assignment.id} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {assignment.subject} • {assignment.class}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    assignment.status === 'active'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {assignment.status === 'active' ? 'Active' : 'Completed'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {assignment.submissions}/{assignment.totalStudents} submitted
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-background rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(assignment.submissions / assignment.totalStudents) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium">
                      {Math.round((assignment.submissions / assignment.totalStudents) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/assignments/submissions?id=${assignment.id}`}>
                    <Button size="sm" variant="outline">View Submissions</Button>
                  </Link>
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="outline">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
