
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from '@/lib/icons';

const DangerZoneCard = () => {
  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader>
        <CardTitle className="text-red-700 flex items-center gap-2 text-base">
          <AlertTriangle className="w-5 h-5" /> Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
           <div>
              <p className="text-sm font-medium text-gray-900">Delete Account</p>
              <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
           </div>
           <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="w-4 h-4" /> Delete
           </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DangerZoneCard;
