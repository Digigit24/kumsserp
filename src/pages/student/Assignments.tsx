import React, { useState } from 'react';
import { FileText, Clock, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Assignments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');

  // Mock data - Replace with actual API calls
  const pendingAssignments = [
    {
      id: 1,
      subject: 'Chemistry',
      title: 'Lab Report - Chemical Reactions',
      description: 'Write a detailed lab report on the chemical reactions experiment conducted in class.',
      dueDate: '2025-12-28',
      assignedDate: '2025-12-20',
      marks: 25,
      priority: 'high',
    },
    {
      id: 2,
      subject: 'History',
      title: 'Essay on World War II',
      description: 'Write a comprehensive essay on the causes and effects of World War II.',
      dueDate: '2025-12-30',
      assignedDate: '2025-12-22',
      marks: 30,
      priority: 'medium',
    },
    {
      id: 3,
      subject: 'Mathematics',
      title: 'Calculus Problem Set',
      description: 'Solve the problems from Chapter 5 (Problems 1-20).',
      dueDate: '2026-01-02',
      assignedDate: '2025-12-23',
      marks: 20,
      priority: 'low',
    },
  ];

  const submittedAssignments = [
    {
      id: 4,
      subject: 'Physics',
      title: 'Newton\'s Laws Assignment',
      description: 'Application problems on Newton\'s three laws of motion.',
      submittedDate: '2025-12-15',
      dueDate: '2025-12-18',
      marks: 25,
      status: 'evaluated',
      obtainedMarks: 23,
    },
    {
      id: 5,
      subject: 'English',
      title: 'Shakespeare Analysis',
      description: 'Analyze the themes in Shakespeare\'s Macbeth.',
      submittedDate: '2025-12-10',
      dueDate: '2025-12-12',
      marks: 30,
      status: 'pending-evaluation',
    },
  ];

  const getDaysLeft = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
        <p className="text-muted-foreground mt-2">
          View and submit your assignments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">To be submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submittedAssignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingAssignments.filter(a => a.priority === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Due soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Pending/Submitted */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submittedAssignments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingAssignments.map((assignment) => {
            const daysLeft = getDaysLeft(assignment.dueDate);
            return (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>{assignment.title}</CardTitle>
                        <Badge variant={
                          assignment.priority === 'high' ? 'destructive' :
                          assignment.priority === 'medium' ? 'warning' : 'secondary'
                        }>
                          {assignment.priority}
                        </Badge>
                      </div>
                      <CardDescription>{assignment.subject}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg">
                      {assignment.marks} marks
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{assignment.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className={`h-4 w-4 ${daysLeft <= 2 ? 'text-destructive' : 'text-orange-600'}`} />
                        <span className={daysLeft <= 2 ? 'text-destructive font-medium' : 'text-orange-600 font-medium'}>
                          Due: {new Date(assignment.dueDate).toLocaleDateString()} ({daysLeft} days left)
                        </span>
                      </div>
                    </div>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4 mt-6">
          {submittedAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{assignment.title}</CardTitle>
                    <CardDescription>{assignment.subject}</CardDescription>
                  </div>
                  <Badge variant={assignment.status === 'evaluated' ? 'success' : 'warning'}>
                    {assignment.status === 'evaluated' ? 'Evaluated' : 'Pending Evaluation'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{assignment.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">
                        Submitted: {new Date(assignment.submittedDate).toLocaleDateString()}
                      </span>
                    </div>
                    {assignment.status === 'evaluated' && assignment.obtainedMarks && (
                      <div className="flex items-center gap-2">
                        <Badge variant="success" className="text-lg">
                          {assignment.obtainedMarks}/{assignment.marks}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
