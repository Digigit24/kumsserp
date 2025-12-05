import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your dashboard
        </p>
      </div>

      {/* Empty dashboard content - ready for your custom content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Add your dashboard widgets here */}
      </div>
    </div>
  );
};
