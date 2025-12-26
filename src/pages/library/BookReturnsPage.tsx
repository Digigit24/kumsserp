import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
const BookReturnsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Book Returns</h1>
    <Card><CardHeader><CardTitle>Book Return Records</CardTitle></CardHeader>
      <CardContent><div className="text-center py-12 text-muted-foreground"><p>Book return management will be available soon</p></div></CardContent>
    </Card>
  </div>
);
export default BookReturnsPage;
