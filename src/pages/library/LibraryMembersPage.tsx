import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
const LibraryMembersPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Library Members</h1>
    <Card><CardHeader><CardTitle>Library Member Management</CardTitle></CardHeader>
      <CardContent><div className="text-center py-12 text-muted-foreground"><p>Library members management will be available soon</p></div></CardContent>
    </Card>
  </div>
);
export default LibraryMembersPage;
