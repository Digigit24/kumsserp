import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
const BooksPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Books</h1>
    <Card><CardHeader><CardTitle>Library Books</CardTitle></CardHeader>
      <CardContent><div className="text-center py-12 text-muted-foreground"><p>Library books management will be available soon</p></div></CardContent>
    </Card>
  </div>
);
export default BooksPage;
