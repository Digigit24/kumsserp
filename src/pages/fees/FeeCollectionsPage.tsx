import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const FeeCollectionsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fee Collections</h1>
        <p className="text-muted-foreground mt-2">Manage fee payments and collections</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collection Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Track and manage fee collections from students.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
