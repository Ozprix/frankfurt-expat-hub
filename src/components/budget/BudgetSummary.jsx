
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { formatCurrency, calculatePercentageUsed } from '@/utils/budgetUtils';
import { Wallet, AlertCircle, TrendingUp, TrendingDown } from '@/lib/icons';

const BudgetSummary = ({ budget, items = [] }) => {
  const totalActual = items.reduce((sum, item) => sum + (Number(item.actual_cost) || 0), 0);
  const totalEstimated = items.reduce((sum, item) => sum + (Number(item.estimated_cost) || 0), 0);
  const goal = Number(budget.total_monthly_budget) || 0;
  
  const percentage = calculatePercentageUsed(totalActual, goal);
  const remaining = goal - totalActual;
  const diffFromPlan = totalEstimated - totalActual;

  return (
    <Card className="shadow-lg border-teal-50 overflow-hidden">
      <CardHeader className="pb-2 bg-teal-600 text-white">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Summary Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Budget Goal</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(goal, budget.currency)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Total Spent</p>
            <p className={`text-xl font-bold ${remaining < 0 ? 'text-red-600' : 'text-teal-600'}`}>
              {formatCurrency(totalActual, budget.currency)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
            <span className={percentage > 100 ? 'text-red-600' : 'text-gray-500'}>
              {percentage}% OF GOAL REACHED
            </span>
            <span className={remaining >= 0 ? 'text-teal-600' : 'text-red-600'}>
              {remaining >= 0 ? `${formatCurrency(remaining, budget.currency)} left` : `${formatCurrency(Math.abs(remaining), budget.currency)} over`}
            </span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden border border-gray-50 shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${percentage > 100 ? 'bg-red-500' : percentage > 85 ? 'bg-amber-500' : 'bg-teal-500'}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className={`flex items-center justify-between p-2 rounded-lg text-sm ${diffFromPlan >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <span className="flex items-center gap-1.5 font-medium">
              {diffFromPlan >= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              {diffFromPlan >= 0 ? 'Under Planned' : 'Over Planned'}
            </span>
            <span className="font-bold">{formatCurrency(Math.abs(diffFromPlan), budget.currency)}</span>
          </div>
        </div>

        {percentage > 95 && (
          <div className="flex items-start gap-3 bg-orange-50 p-4 rounded-xl text-sm text-orange-800 border border-orange-100 animate-pulse">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="font-medium">
              {percentage > 100 ? "Caution: You have exceeded your target budget limit." : "Warning: You are approaching your budget limit."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetSummary;
