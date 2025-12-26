import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
const PayrollsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Payrolls</h1>
    <Card><CardHeader><CardTitle>Payroll Management</CardTitle></CardHeader>
      <CardContent><div className="text-center py-12 text-muted-foreground"><p>Payroll management will be available soon</p></div></CardContent>
    </Card>
  </div>
);
export default PayrollsPage;
