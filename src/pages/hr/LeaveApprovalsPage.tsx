import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
const LeaveApprovalsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Leave Approvals</h1>
    <Card><CardHeader><CardTitle>Pending Leave Approvals</CardTitle></CardHeader>
      <CardContent><div className="text-center py-12 text-muted-foreground"><p>Leave approvals will be available soon</p></div></CardContent>
    </Card>
  </div>
);
export default LeaveApprovalsPage;
