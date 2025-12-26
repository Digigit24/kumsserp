/**
 * Progress Cards Page
 * Generate and manage student progress cards
 */

import { FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const ProgressCardsPage = () => {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Progress Cards</h1>
          <p className="text-muted-foreground">Generate student progress cards</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate Progress Cards
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress Card Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Progress card generation functionality will be available soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressCardsPage;
