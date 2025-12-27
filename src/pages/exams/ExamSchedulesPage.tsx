import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';

export const ExamSchedulesPage: React.FC = () => {
  const schedules = [
    {
      id: '1',
      examName: 'Mid-term Mathematics',
      subject: 'Mathematics',
      class: 'Class 10-A',
      date: '2025-12-30',
      time: '09:00 AM',
      duration: '3 hours',
      room: 'Hall A',
    },
    {
      id: '2',
      examName: 'Physics Final',
      subject: 'Physics',
      class: 'Class 11-B',
      date: '2026-01-05',
      time: '02:00 PM',
      duration: '3 hours',
      room: 'Lab 1',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exam Schedules</h1>
          <p className="text-muted-foreground mt-2">View and manage examination timetable</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Download Schedule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <CardTitle>Examination Schedule</CardTitle>
          </div>
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
                  <th className="text-left p-3 font-medium">Time</th>
                  <th className="text-left p-3 font-medium">Duration</th>
                  <th className="text-left p-3 font-medium">Room</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{schedule.examName}</td>
                    <td className="p-3">{schedule.subject}</td>
                    <td className="p-3">{schedule.class}</td>
                    <td className="p-3">{new Date(schedule.date).toLocaleDateString()}</td>
                    <td className="p-3">{schedule.time}</td>
                    <td className="p-3">{schedule.duration}</td>
                    <td className="p-3">{schedule.room}</td>
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
