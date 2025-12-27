import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export const MarksEntryPage: React.FC = () => {
  const [students] = useState([
    { id: '1', rollNo: '001', name: 'John Doe', marks: '' },
    { id: '2', rollNo: '002', name: 'Jane Smith', marks: '' },
    { id: '3', rollNo: '015', name: 'Bob Johnson', marks: '' },
    { id: '4', rollNo: '016', name: 'Alice Williams', marks: '' },
  ]);

  const [marks, setMarks] = useState<Record<string, string>>({});

  const handleMarksChange = (studentId: string, value: string) => {
    setMarks({ ...marks, [studentId]: value });
  };

  const handleSubmit = () => {
    console.log('Submitting marks:', marks);
    alert('Marks saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Marks Entry</h1>
        <p className="text-muted-foreground mt-2">Enter student marks for examinations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mid-term Mathematics - Class 10-A</CardTitle>
          <p className="text-sm text-muted-foreground">Max Marks: 100</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Roll No</th>
                  <th className="text-left p-3 font-medium">Student Name</th>
                  <th className="text-left p-3 font-medium">Marks Obtained</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="p-3">{student.rollNo}</td>
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Enter marks"
                        className="w-32 rounded-md border border-input bg-background px-3 py-2"
                        value={marks[student.id] || ''}
                        onChange={(e) => handleMarksChange(student.id, e.target.value)}
                      />
                    </td>
                    <td className="p-3">
                      {marks[student.id] ? (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                          Entered
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Button onClick={handleSubmit} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Marks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
