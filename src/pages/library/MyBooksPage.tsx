import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
const MyBooksPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">My Books</h1>
    <Card><CardHeader><CardTitle>My Issued Books</CardTitle></CardHeader>
      <CardContent><div className="text-center py-12 text-muted-foreground"><p>Your issued books will be displayed here</p></div></CardContent>
    </Card>
  </div>
);
export default MyBooksPage;
