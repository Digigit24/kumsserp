/**
 * Marks Registers Page
 * View consolidated marks registers
 */

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const MarksRegistersPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marks Registers</h1>
        <p className="text-muted-foreground">View consolidated marks registers for exams</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marks Registers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Marks register functionality will be available soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarksRegistersPage;
