import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Clock, Download, Loader2, AlertCircle } from 'lucide-react';
import { useSubmissions, useAssignment, useGradeSubmission } from '@/hooks/useAssignments';
import { toast } from 'sonner';

export const SubmissionsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get('id');

  // Fetch assignment details
  const {
    data: assignment,
    isLoading: isLoadingAssignment,
    error: assignmentError,
  } = useAssignment(assignmentId ? parseInt(assignmentId) : 0);

  // Fetch submissions for this assignment
  const {
    data: submissionsData,
    isLoading: isLoadingSubmissions,
    error: submissionsError,
    refetch,
  } = useSubmissions({
    assignment: assignmentId ? parseInt(assignmentId) : undefined,
    page_size: 100,
  });

  const gradeMutation = useGradeSubmission();

  const submissions = submissionsData?.results || [];

  // Calculate statistics
  const stats = useMemo(() => {
    const totalStudents = assignment?.total_students || submissions.length;
    const submittedCount = submissions.filter(s => s.status !== 'pending').length;
    const gradedCount = submissions.filter(s => s.status === 'graded').length;

    return {
      totalStudents,
      submittedCount,
      gradedCount,
    };
  }, [submissions, assignment]);

  const handleGrade = async (submissionId: number) => {
    const marks = prompt('Enter marks obtained:');
    if (!marks) return;

    const marksNum = parseFloat(marks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > (assignment?.max_marks || 100)) {
      toast.error(`Marks must be between 0 and ${assignment?.max_marks || 100}`);
      return;
    }

    const feedback = prompt('Enter feedback (optional):') || '';

    try {
      await gradeMutation.mutateAsync({
        id: submissionId,
        data: {
          marks_obtained: marksNum,
          feedback,
        },
      });
      toast.success('Submission graded successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to grade submission');
    }
  };

  const isLoading = isLoadingAssignment || isLoadingSubmissions;
  const error = assignmentError || submissionsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <p className="text-lg font-medium">Failed to load assignment</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error?.message || 'Assignment not found'}
          </p>
        </div>
      </div>
    );
  }

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
          <CardTitle>
            {assignment.title} - {assignment.class_name}
            {assignment.section_name && ` - ${assignment.section_name}`}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Subject: {assignment.subject_name} • Due: {new Date(assignment.due_date).toLocaleDateString()} • Max Marks: {assignment.max_marks}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Students</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Submitted</span>
              </div>
              <div className="text-2xl font-bold">{stats.submittedCount}</div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Graded</span>
              </div>
              <div className="text-2xl font-bold">{stats.gradedCount}</div>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No submissions yet</p>
              <p className="text-sm mt-2">Submissions will appear here once students submit their work</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission) => (
                <div key={submission.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{submission.student_name || 'Unknown Student'}</h3>
                        {submission.student_roll_number && (
                          <span className="text-sm text-muted-foreground">
                            Roll No: {submission.student_roll_number}
                          </span>
                        )}
                        {submission.is_late && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                            Late
                          </span>
                        )}
                      </div>

                      {submission.submitted_date ? (
                        <p className="text-sm text-muted-foreground">
                          Submitted on: {new Date(submission.submitted_date).toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-sm text-orange-600">Not submitted yet</p>
                      )}

                      {submission.marks_obtained !== null && submission.marks_obtained !== undefined && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-800">
                            Grade: {submission.marks_obtained}/{assignment.max_marks}
                          </span>
                          {submission.feedback && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Feedback: {submission.feedback}
                            </p>
                          )}
                        </div>
                      )}

                      {submission.submission_text && (
                        <div className="mt-2 p-2 bg-background rounded text-sm">
                          <p className="font-medium text-xs text-muted-foreground mb-1">Submission Text:</p>
                          <p className="whitespace-pre-wrap">{submission.submission_text}</p>
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
                          {submission.submission_file && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(submission.submission_file, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          )}
                          {submission.status === 'submitted' && (
                            <Button
                              size="sm"
                              onClick={() => handleGrade(submission.id)}
                              disabled={gradeMutation.isPending}
                            >
                              Grade
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
