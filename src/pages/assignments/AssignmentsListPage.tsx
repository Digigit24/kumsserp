import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Clock, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { DetailSidebar } from '@/components/common/DetailSidebar';
import { Badge } from '@/components/ui/badge';
import { AssignmentForm } from './components/AssignmentForm';
import {
  useMyAssignments,
  useUpdateAssignment,
  useDeleteAssignment,
} from '@/hooks/useAssignments';
import { toast } from 'sonner';
import type { Assignment, AssignmentCreateInput } from '@/types/assignments.types';

export const AssignmentsListPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'edit'>('view');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Fetch my assignments
  const { data, isLoading, error, refetch } = useMyAssignments({ page_size: 100 });
  const updateMutation = useUpdateAssignment();
  const deleteMutation = useDeleteAssignment();

  const assignments = data?.results || [];
  const activeAssignments = assignments.filter(a => a.status === 'active');
  const totalPending = assignments.reduce(
    (sum, a) => sum + ((a.total_students || 0) - (a.submission_count || 0)),
    0
  );

  const handleEdit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSidebarMode('edit');
    setIsSidebarOpen(true);
  };

  const handleView = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleDelete = async (assignment: Assignment) => {
    if (window.confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
      try {
        await deleteMutation.mutateAsync(assignment.id);
        toast.success('Assignment deleted successfully');
        refetch();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete assignment');
      }
    }
  };

  const handleFormSubmit = async (data: AssignmentCreateInput | FormData) => {
    if (!selectedAssignment) return;

    try {
      await updateMutation.mutateAsync({ id: selectedAssignment.id, data: data as any });
      toast.success('Assignment updated successfully');
      setIsSidebarOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update assignment');
      console.error('Update assignment error:', error);
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedAssignment(null);
  };

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

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Ongoing assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
            <p className="text-xs text-muted-foreground">Students pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading assignments...</div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Failed to load assignments: {error.message}
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No assignments yet. Create your first assignment!
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => {
                const submissionRate = assignment.total_students
                  ? Math.round(((assignment.submission_count || 0) / assignment.total_students) * 100)
                  : 0;

                return (
                  <div
                    key={assignment.id}
                    className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
                    onClick={() => handleView(assignment)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {assignment.subject_name} • {assignment.class_name}
                          {assignment.section_name && ` - ${assignment.section_name}`}
                        </p>
                      </div>
                      <Badge
                        variant={
                          assignment.status === 'active'
                            ? 'default'
                            : assignment.status === 'draft'
                            ? 'secondary'
                            : 'success'
                        }
                      >
                        {assignment.status || 'active'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </div>
                      {assignment.total_students && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {assignment.submission_count || 0}/{assignment.total_students} submitted
                        </div>
                      )}
                    </div>

                    {assignment.total_students && assignment.total_students > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-background rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${submissionRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{submissionRate}%</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Link to={`/assignments/submissions?id=${assignment.id}`}>
                        <Button size="sm" variant="outline">
                          View Submissions
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(assignment);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(assignment);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Sidebar */}
      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'edit' ? 'Edit Assignment' : selectedAssignment?.title || 'Assignment Details'}
        mode={sidebarMode}
        width="xl"
      >
        {sidebarMode === 'view' && selectedAssignment ? (
          <div className="space-y-4">
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
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1 whitespace-pre-wrap">{selectedAssignment.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                <p className="mt-1">{new Date(selectedAssignment.due_date).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Maximum Marks</h3>
                <p className="mt-1">{selectedAssignment.max_marks}</p>
              </div>
            </div>
            {selectedAssignment.total_students && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Students</h3>
                  <p className="mt-1">{selectedAssignment.total_students}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Submissions</h3>
                  <p className="mt-1">{selectedAssignment.submission_count || 0}</p>
                </div>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedAssignment.is_active ? 'success' : 'destructive'}>
                  {selectedAssignment.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={() => setSidebarMode('edit')} className="flex-1">
                Edit Assignment
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(selectedAssignment)}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <AssignmentForm
            assignment={selectedAssignment}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
            isSubmitting={updateMutation.isPending}
          />
        )}
      </DetailSidebar>
    </div>
  );
};
