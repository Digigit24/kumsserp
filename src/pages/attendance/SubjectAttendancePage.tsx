/**
 * Subject Attendance Page
 */

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const SubjectAttendancePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subject Attendance</h1>
        <p className="text-muted-foreground">Period-wise subject attendance tracking</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Subject attendance functionality will be available soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubjectAttendancePage;
