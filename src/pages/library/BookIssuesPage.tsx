import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
const BookIssuesPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Book Issues</h1>
    <Card><CardHeader><CardTitle>Book Issue Records</CardTitle></CardHeader>
      <CardContent><div className="text-center py-12 text-muted-foreground"><p>Book issue management will be available soon</p></div></CardContent>
    </Card>
  </div>
);
export default BookIssuesPage;
