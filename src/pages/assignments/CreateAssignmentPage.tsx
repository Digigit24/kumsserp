import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export const CreateAssignmentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Assignment</h1>
        <p className="text-muted-foreground mt-2">
          Create a new assignment for your students
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                placeholder="Enter assignment title"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground">
                <option>Select subject</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Advanced Mathematics</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground">
                <option>Select class</option>
                <option>Class 10-A</option>
                <option>Class 11-B</option>
                <option>Class 12-A</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                rows={4}
                placeholder="Enter assignment description and instructions"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Marks</label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Attachments</label>
              <div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop files here or click to browse
                </p>
                <input type="file" multiple className="hidden" />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1">
                Save as Draft
              </Button>
              <Button type="submit" className="flex-1">
                Create Assignment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
