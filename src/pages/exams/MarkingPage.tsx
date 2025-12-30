/**
 * Marking Page - Shows all exams with question papers for marking
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, Column } from '../../components/common/DataTable';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { CheckCircle, Clock, FileText, Users } from 'lucide-react';
import { useExamSchedules, useMarksRegisters, useStudentMarks } from '../../hooks/useExamination';

const MarkingPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 100 });

  // Fetch real API data
  const { data: schedulesData, isLoading: isLoadingSchedules, refetch } = useExamSchedules(filters);
  const { data: registersData } = useMarksRegisters({ page_size: 1000 });
  const { data: marksData } = useStudentMarks({ page_size: 1000 });

  // Enrich exam schedules with marking statistics
  const enrichedData = useMemo(() => {
    if (!schedulesData?.results) return [];

    return schedulesData.results.map((schedule: any) => {
      // Find related marks register
      const register = registersData?.results?.find(
        (r: any) => r.exam === schedule.exam && r.subject === schedule.subject
      );

      if (!register) {
        return {
          ...schedule,
          stats: null,
        };
      }

      // Calculate marking statistics
      const studentMarksForRegister = marksData?.results?.filter(
        (mark: any) => mark.marks_register === register.id
      ) || [];

      const totalStudents = schedule.total_students || 0;
      const markedStudents = studentMarksForRegister.length;
      const markingProgress = totalStudents > 0 ? (markedStudents / totalStudents) * 100 : 0;

      return {
        ...schedule,
        max_marks: register.max_marks,
        stats: {
          question_paper_id: schedule.id,
          total_students: totalStudents,
          marked_students: markedStudents,
          marking_progress: markingProgress,
        },
      };
    });
  }, [schedulesData, registersData, marksData]);

  const enrichedPaginated = {
    count: schedulesData?.count || 0,
    next: schedulesData?.next || null,
    previous: schedulesData?.previous || null,
    results: enrichedData,
  };

  type EnrichedPaper = typeof enrichedData[0];

  const columns: Column<EnrichedPaper>[] = [
    {
      key: 'exam_name',
      label: 'Exam Name',
      sortable: true,
      render: (paper) => (
        <div>
          <p className="font-semibold">{paper.exam_name || '-'}</p>
          <p className="text-xs text-muted-foreground">{paper.subject_name || '-'}</p>
        </div>
      ),
    },
    {
      key: 'class_name',
      label: 'Class',
      sortable: true,
      render: (paper) => paper.class_name || paper.classroom_name || '-',
    },
    {
      key: 'date',
      label: 'Exam Date',
      sortable: true,
      render: (paper) => paper.date ? new Date(paper.date).toLocaleDateString() : '-',
    },
    {
      key: 'max_marks',
      label: 'Max Marks',
      render: (paper) => <Badge variant="outline">{paper.max_marks || '-'}</Badge>,
      sortable: true,
    },
    {
      key: 'stats',
      label: 'Progress',
      render: (paper) => {
        if (!paper.stats) return <Badge variant="secondary">Not Started</Badge>;
        const progress = paper.stats.marking_progress;
        return (
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
          </div>
        );
      },
    },
    {
      key: 'stats.marked_students',
      label: 'Marked',
      render: (paper) => {
        if (!paper.stats) return '-';
        return (
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>{paper.stats.marked_students}/{paper.stats.total_students}</span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (paper) => (
        <Button
          size="sm"
          onClick={() => navigate(`/exams/marking/${paper.id}`)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Start Marking
        </Button>
      ),
    },
  ];

  // Calculate overall statistics
  const totalPapers = enrichedPaginated.count;
  const totalStudentsToMark = enrichedData.reduce((sum, paper) => sum + (paper.stats?.total_students || 0), 0);
  const totalMarked = enrichedData.reduce((sum, paper) => sum + (paper.stats?.marked_students || 0), 0);
  const overallProgress = totalStudentsToMark > 0 ? (totalMarked / totalStudentsToMark) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exam Marking</h1>
        <p className="text-muted-foreground">Review and mark student answer sheets</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Papers</p>
                <p className="text-2xl font-bold">{totalPapers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{totalStudentsToMark}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Marked</p>
                <p className="text-2xl font-bold">{totalMarked}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{overallProgress.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question Papers Table */}
      <DataTable
        title="Question Papers"
        description="Select a question paper to start marking"
        columns={columns}
        data={enrichedPaginated}
        isLoading={isLoadingSchedules}
        error={null}
        onRefresh={refetch}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search exams..."
      />
    </div>
  );
};

export default MarkingPage;
