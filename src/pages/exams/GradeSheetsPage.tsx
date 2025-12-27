import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

export const GradeSheetsPage: React.FC = () => {
  const gradeSheets = [
    { id: '1', class: 'Class 10-A', subject: 'Mathematics', exam: 'Mid-term', avgMarks: 75 },
    { id: '2', class: 'Class 11-B', subject: 'Physics', exam: 'Mid-term', avgMarks: 82 },
    { id: '3', class: 'Class 12-A', subject: 'Chemistry', exam: 'Quiz', avgMarks: 68 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Grade Sheets</h1>
        <p className="text-muted-foreground mt-2">View class-wise grade sheets</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Grade Sheets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Class</th>
                  <th className="text-left p-3 font-medium">Subject</th>
                  <th className="text-left p-3 font-medium">Exam</th>
                  <th className="text-left p-3 font-medium">Avg. Marks</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gradeSheets.map((sheet) => (
                  <tr key={sheet.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{sheet.class}</td>
                    <td className="p-3">{sheet.subject}</td>
                    <td className="p-3">{sheet.exam}</td>
                    <td className="p-3">{sheet.avgMarks}%</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
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
