import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const ExamTypesPage: React.FC = () => {
  const examTypes = [
    { id: '1', name: 'Mid-term Exam', description: 'Mid-semester examination', weight: 30 },
    { id: '2', name: 'Final Exam', description: 'End of semester examination', weight: 50 },
    { id: '3', name: 'Quiz', description: 'Short assessment', weight: 10 },
    { id: '4', name: 'Assignment', description: 'Take-home assignment', weight: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exam Types</h1>
          <p className="text-muted-foreground mt-2">Manage examination types and weightage</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Exam Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Exam Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Type Name</th>
                  <th className="text-left p-3 font-medium">Description</th>
                  <th className="text-left p-3 font-medium">Weightage (%)</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {examTypes.map((type) => (
                  <tr key={type.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{type.name}</td>
                    <td className="p-3">{type.description}</td>
                    <td className="p-3">{type.weight}%</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="destructive">Delete</Button>
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
