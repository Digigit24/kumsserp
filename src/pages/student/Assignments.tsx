import React, { useState } from 'react';
import { FileText, Clock, CheckCircle2, AlertCircle, Upload, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAssignments } from '@/hooks/useAssignments';
import { DetailSidebar } from '@/components/common/DetailSidebar';
import type { Assignment } from '@/types/assignments.types';

export const Assignments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Fetch assignments from API
  const { data, isLoading, error } = useAssignments({ page_size: 100, status: 'active' });
  const assignments = data?.results || [];

  // Filter assignments by status
  const today = new Date();
  const pendingAssignments = assignments.filter(a => {
    const dueDate = new Date(a.due_date);
    return dueDate >= today;
  });

  const overdueAssignments = assignments.filter(a => {
    const dueDate = new Date(a.due_date);
    return dueDate < today;
  });

  const urgentAssignments = pendingAssignments.filter(a => {
    const dueDate = new Date(a.due_date);
    const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3;
  });

  const getDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleViewDetails = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedAssignment(null);
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Due upcoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgentAssignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Due within 3 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueAssignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Past deadline</p>
          </CardContent>
        </Card>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading assignments...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load assignments: {error.message}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Tabs for All/Pending/Overdue */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="all">All ({assignments.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
              <TabsTrigger value="urgent">Urgent ({urgentAssignments.length})</TabsTrigger>
              <TabsTrigger value="overdue">Overdue ({overdueAssignments.length})</TabsTrigger>
            </TabsList>

            {/* All Assignments */}
            <TabsContent value="all" className="space-y-4 mt-6">
              {assignments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No assignments available</p>
                  </CardContent>
                </Card>
              ) : (
                assignments.map((assignment) => {
                  const daysLeft = getDaysLeft(assignment.due_date);
                  const isOverdue = daysLeft < 0;
                  const isUrgent = daysLeft >= 0 && daysLeft <= 3;

                  return (
                    <Card
                      key={assignment.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleViewDetails(assignment)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{assignment.title}</CardTitle>
                              {isOverdue && (
                                <Badge variant="destructive">Overdue</Badge>
                              )}
                              {isUrgent && !isOverdue && (
                                <Badge variant="warning">Urgent</Badge>
                              )}
                            </div>
                            <CardDescription>
                              {assignment.subject_name} • {assignment.class_name}
                              {assignment.section_name && ` - ${assignment.section_name}`}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="text-base">
                            {assignment.max_marks} marks
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm line-clamp-2">{assignment.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Created: {new Date(assignment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <AlertCircle
                                className={`h-4 w-4 ${
                                  isOverdue
                                    ? 'text-destructive'
                                    : isUrgent
                                    ? 'text-orange-600'
                                    : 'text-muted-foreground'
                                }`}
                              />
                              <span
                                className={
                                  isOverdue
                                    ? 'text-destructive font-medium'
                                    : isUrgent
                                    ? 'text-orange-600 font-medium'
                                    : 'text-muted-foreground'
                                }
                              >
                                Due: {new Date(assignment.due_date).toLocaleDateString()}
                                {isOverdue
                                  ? ` (${Math.abs(daysLeft)} days overdue)`
                                  : ` (${daysLeft} days left)`}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(assignment);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            {/* Pending Assignments */}
            <TabsContent value="pending" className="space-y-4 mt-6">
              {pendingAssignments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-4" />
                    <p className="text-muted-foreground">No pending assignments!</p>
                  </CardContent>
                </Card>
              ) : (
                pendingAssignments.map((assignment) => {
                  const daysLeft = getDaysLeft(assignment.due_date);
                  const isUrgent = daysLeft <= 3;

                  return (
                    <Card
                      key={assignment.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleViewDetails(assignment)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{assignment.title}</CardTitle>
                              {isUrgent && <Badge variant="warning">Urgent</Badge>}
                            </div>
                            <CardDescription>
                              {assignment.subject_name} • {assignment.class_name}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="text-base">
                            {assignment.max_marks} marks
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm line-clamp-2">{assignment.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <AlertCircle
                              className={`h-4 w-4 ${isUrgent ? 'text-orange-600' : 'text-muted-foreground'}`}
                            />
                            <span className={isUrgent ? 'text-orange-600 font-medium' : 'text-muted-foreground'}>
                              Due: {new Date(assignment.due_date).toLocaleDateString()} ({daysLeft} days left)
                            </span>
                          </div>
                          <Button size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Submit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            {/* Urgent Assignments */}
            <TabsContent value="urgent" className="space-y-4 mt-6">
              {urgentAssignments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-4" />
                    <p className="text-muted-foreground">No urgent assignments</p>
                  </CardContent>
                </Card>
              ) : (
                urgentAssignments.map((assignment) => {
                  const daysLeft = getDaysLeft(assignment.due_date);

                  return (
                    <Card
                      key={assignment.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200"
                      onClick={() => handleViewDetails(assignment)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{assignment.title}</CardTitle>
                              <Badge variant="destructive">
                                {daysLeft === 0 ? 'Due Today' : daysLeft === 1 ? 'Due Tomorrow' : `${daysLeft} days left`}
                              </Badge>
                            </div>
                            <CardDescription>
                              {assignment.subject_name} • {assignment.class_name}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="text-base">
                            {assignment.max_marks} marks
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm line-clamp-2">{assignment.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-orange-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">
                              Due: {new Date(assignment.due_date).toLocaleDateString()}
                            </span>
                          </div>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            <Upload className="h-4 w-4 mr-2" />
                            Submit Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            {/* Overdue Assignments */}
            <TabsContent value="overdue" className="space-y-4 mt-6">
              {overdueAssignments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-4" />
                    <p className="text-muted-foreground">No overdue assignments!</p>
                  </CardContent>
                </Card>
              ) : (
                overdueAssignments.map((assignment) => {
                  const daysOverdue = Math.abs(getDaysLeft(assignment.due_date));

                  return (
                    <Card
                      key={assignment.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer border-red-200"
                      onClick={() => handleViewDetails(assignment)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{assignment.title}</CardTitle>
                              <Badge variant="destructive">{daysOverdue} days overdue</Badge>
                            </div>
                            <CardDescription>
                              {assignment.subject_name} • {assignment.class_name}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="text-base">
                            {assignment.max_marks} marks
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm line-clamp-2">{assignment.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">
                              Was due: {new Date(assignment.due_date).toLocaleDateString()}
                            </span>
                          </div>
                          <Button size="sm" variant="destructive">
                            <Upload className="h-4 w-4 mr-2" />
                            Submit Late
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Detail Sidebar */}
      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={selectedAssignment?.title || 'Assignment Details'}
        mode="view"
        width="lg"
      >
        {selectedAssignment && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
              <p className="mt-1 text-lg font-semibold">{selectedAssignment.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                <p className="mt-1">{selectedAssignment.subject_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Class</h3>
                <p className="mt-1">
                  {selectedAssignment.class_name}
                  {selectedAssignment.section_name && ` - ${selectedAssignment.section_name}`}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description & Instructions</h3>
              <p className="mt-1 whitespace-pre-wrap">{selectedAssignment.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                <p className="mt-1 font-medium">
                  {new Date(selectedAssignment.due_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Maximum Marks</h3>
                <p className="mt-1 font-medium">{selectedAssignment.max_marks}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Assigned On</h3>
                <p className="mt-1">{new Date(selectedAssignment.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Teacher</h3>
                <p className="mt-1">{selectedAssignment.teacher_name || 'N/A'}</p>
              </div>
            </div>

            {selectedAssignment.attachments && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Attachments</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Assignment File
                </Button>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button className="w-full" size="lg">
                <Upload className="h-4 w-4 mr-2" />
                Submit Assignment
              </Button>
            </div>
          </div>
        )}
      </DetailSidebar>
    </div>
  );
};
