
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from '@/lib/icons';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const SubscriptionCard = ({ subscription, stats }) => {
  const tier = subscription?.tier || 'free';
  
  const tiers = {
    free: { color: 'bg-gray-100 text-gray-800', border: 'border-gray-200', name: 'Starter' },
    pro: { color: 'bg-indigo-100 text-indigo-800', border: 'border-indigo-200', name: 'Professional' },
    enterprise: { color: 'bg-amber-100 text-amber-800', border: 'border-amber-200', name: 'Enterprise' }
  };

  const currentTier = tiers[tier] || tiers.free;

  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className={`h-2 w-full ${tier === 'pro' ? 'bg-indigo-500' : 'bg-gray-400'}`}></div>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">Current Plan</CardTitle>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-black">{currentTier.name}</span>
              <Badge variant="outline" className={currentTier.color}>Active</Badge>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-2xl font-bold">€0</span>
            <span className="text-xs text-gray-500">free access</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {subscription?.current_period_end && (
          <div className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between">
            <span className="text-gray-600">Renews on:</span>
            <span className="font-semibold text-gray-900">
              {new Date(subscription.current_period_end).toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Features</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-green-500" />
              <span>Unlimited Budget Scenarios</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-green-500" />
              <span>Basic Forum Access</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              {tier === 'pro' ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
              <span className={tier === 'pro' ? 'text-gray-900' : 'text-gray-400'}>Priority Support</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              {tier === 'pro' ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
              <span className={tier === 'pro' ? 'text-gray-900' : 'text-gray-400'}>Advanced Analytics</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
           <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Usage</h4>
           <div className="space-y-2">
             <div className="flex justify-between text-xs mb-1">
               <span>Storage Used</span>
               <span>{stats?.storage_percent || 0}%</span>
             </div>
             <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats?.storage_percent || 0}%` }}></div>
             </div>
           </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 p-4 border-t gap-3">
        {tier !== 'pro' ? (
           <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white shadow-md">
             Beta Access Active
           </Button>
        ) : (
          <Button variant="outline" className="w-full border-gray-300">
            Billing Paused
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
