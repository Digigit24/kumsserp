/**
 * Marks Entry Page - Teacher View
 * Teachers can enter marks for students
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Save, CheckCircle } from 'lucide-react';

interface StudentMark {
  id: number;
  student_name: string;
  student_roll_number: string;
  theory_marks: number | null;
  practical_marks: number | null;
  internal_marks: number | null;
  obtained_marks: number;
  is_absent: boolean;
}

const MarksEntryPage = () => {
  const [marks, setMarks] = useState<StudentMark[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Marks Entry</h1>
          <p className="text-muted-foreground">Enter marks for students</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          <Button>
            <CheckCircle className="h-4 w-4 mr-2" />
            Submit for Verification
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Exam & Subject</CardTitle>
          <CardDescription>Choose exam and subject to enter marks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Exam</label>
              <select className="w-full p-2 border rounded">
                <option>Select Exam</option>
                <option>Mid-Term 2024</option>
                <option>Final Exam 2024</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <select className="w-full p-2 border rounded">
                <option>Select Class</option>
                <option>Class 10 - A</option>
                <option>Class 10 - B</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <select className="w-full p-2 border rounded">
                <option>Select Subject</option>
                <option>Mathematics</option>
                <option>Physics</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enter Marks</CardTitle>
          <CardDescription>Enter marks for each student</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Select exam, class, and subject to start entering marks</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarksEntryPage;
