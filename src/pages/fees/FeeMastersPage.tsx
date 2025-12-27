import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const FeeMastersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fee Masters</h1>
          <p className="text-muted-foreground mt-2">Manage fee structures and categories</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Fee Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Configure fee types, categories, and structures. Full functionality after backend integration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
