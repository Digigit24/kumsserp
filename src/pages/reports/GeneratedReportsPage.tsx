import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart } from 'lucide-react';

export const GeneratedReportsPage: React.FC = () => {
  const reports = [
    { id: '1', name: 'Attendance Report - December 2025', date: '2025-12-26', type: 'Attendance' },
    { id: '2', name: 'Exam Results - Mid Term', date: '2025-12-25', type: 'Academics' },
    { id: '3', name: 'Fee Collection Report', date: '2025-12-24', type: 'Finance' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Generated Reports</h1>
        <p className="text-muted-foreground mt-2">View and download reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Report Name</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Generated On</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{report.name}</td>
                    <td className="p-3">{report.type}</td>
                    <td className="p-3">{new Date(report.date).toLocaleDateString()}</td>
                    <td className="p-3">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
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
