import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
const ProfilePage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">My Profile</h1>
    <Card><CardHeader><CardTitle>User Profile</CardTitle></CardHeader>
      <CardContent><div className="text-center py-12 text-muted-foreground"><p>Profile management will be available soon</p></div></CardContent>
    </Card>
  </div>
);
export default ProfilePage;
