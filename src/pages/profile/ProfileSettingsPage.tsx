import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
const ProfileSettingsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Profile Settings</h1>
    <Card><CardHeader><CardTitle>Settings</CardTitle></CardHeader>
      <CardContent><div className="text-center py-12 text-muted-foreground"><p>Profile settings will be available soon</p></div></CardContent>
    </Card>
  </div>
);
export default ProfileSettingsPage;
