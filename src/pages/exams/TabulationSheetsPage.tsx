/**
 * Tabulation Sheets Page
 * Admin view for tabulation sheets
 */

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Download } from 'lucide-react';

const TabulationSheetsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tabulation Sheets</h1>
          <p className="text-muted-foreground">View and download tabulation sheets</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Tabulation Sheet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tabulation Sheets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Tabulation sheet functionality will be available soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TabulationSheetsPage;
