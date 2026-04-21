
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, AlertTriangle } from '@/lib/icons';

const AccountStatusCard = ({ isActive, isVerified }) => {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 border-none shadow-sm">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
             {isActive ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Account Status</p>
            <p className="text-xs text-gray-500">{isActive ? 'Your account is active and secure' : 'Action required'}</p>
          </div>
        </div>
        <Badge variant={isActive ? 'default' : 'destructive'}>
          {isActive ? 'Active' : 'Restricted'}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default AccountStatusCard;
