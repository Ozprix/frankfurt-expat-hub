
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useCostCalculator } from '@/hooks/useCostCalculator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Calculator, 
  ArrowRight, 
  Trash2, 
  Edit2, 
  TrendingUp, 
  Wallet, 
  ChevronRight, 
  MoreHorizontal 
} from '@/lib/icons';
import { formatCurrency, calculatePercentageUsed } from '@/utils/budgetUtils';

const CostCalculatorPage = () => {
  const navigate = useNavigate();
  const { budgets, deleteBudget, loading, error, fetchUserBudgets } = useCostCalculator();

  return (
    <>
      <Helmet>
        <title>Financial Planner | Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-gray-200">
                  <Calculator className="w-6 h-6" />
                </div>
                Planner
              </h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed">
                Take control of your Frankfurt relocation finances. Create multiple scenarios, track actual spending, and stay within your limits.
              </p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <Button variant="outline" size="lg" onClick={() => navigate('/budget-templates')} className="flex-1 md:flex-none h-14 rounded-2xl border-2 font-bold hover:bg-white hover:border-teal-100 hover:text-teal-700 transition-all">
                Blueprints
              </Button>
              <Button onClick={() => navigate('/budget/create')} size="lg" className="flex-1 md:flex-none bg-teal-600 hover:bg-teal-700 text-white font-bold h-14 rounded-2xl shadow-xl shadow-teal-100 transition-all transform active:scale-95">
                <Plus className="w-5 h-5 mr-2" /> New Budget
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white h-64 rounded-3xl animate-pulse shadow-sm border border-gray-100" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-24 bg-white rounded-[40px] border border-red-100 shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <Wallet className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Planner temporarily unavailable</h3>
              <p className="text-gray-500 mb-8 max-w-md font-medium leading-relaxed">
                We could not load your budgets right now. Please retry before creating a new plan.
              </p>
              <Button onClick={() => fetchUserBudgets(true)} size="lg" className="bg-gray-900 hover:bg-black text-white rounded-2xl h-14 font-bold px-8">
                Retry Loading Budgets
              </Button>
            </div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100 shadow-sm flex flex-col items-center">
              <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-8">
                <Wallet className="w-10 h-10 text-teal-600" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">No Active Plans</h3>
              <p className="text-gray-500 mb-10 max-w-sm font-medium leading-relaxed">Start by creating your first budget scenario or use one of our pre-configured blueprints.</p>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs px-4">
                <Button onClick={() => navigate('/budget/create')} size="lg" className="bg-gray-900 hover:bg-black text-white rounded-2xl h-14 font-bold">Start From Scratch</Button>
                <Button variant="ghost" onClick={() => navigate('/budget-templates')} size="lg" className="font-bold h-14 rounded-2xl">Browse Blueprints <ChevronRight className="ml-1 w-4 h-4" /></Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {budgets.map(budget => {
                const items = budget.user_budget_items || [];
                const spent = items.reduce((sum, i) => sum + (Number(i.actual_cost)||0), 0);
                const percent = calculatePercentageUsed(spent, budget.total_monthly_budget);
                
                return (
                  <Card key={budget.id} className="hover:shadow-2xl transition-all duration-500 border-none group bg-white rounded-[32px] overflow-hidden flex flex-col h-full shadow-lg shadow-gray-100">
                    <CardContent className="p-8 flex-grow">
                      <div className="flex justify-between items-start mb-6">
                        <div className="max-w-[80%]">
                          <h3 className="text-2xl font-black text-gray-900 truncate group-hover:text-teal-600 transition-colors tracking-tight">{budget.name}</h3>
                          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Frankfurt, Germany</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-gray-50">
                              <MoreHorizontal className="w-5 h-5 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl">
                            <DropdownMenuItem onClick={() => navigate(`/budget/${budget.id}/edit`)}>
                              <Edit2 className="w-4 h-4 mr-2" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={async () => { if (confirm('Permanently delete?')) await deleteBudget(budget.id); }}>
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-6">
                        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">
                             <span>Progress</span>
                             <span className={percent > 100 ? 'text-red-600' : 'text-teal-600'}>{percent}%</span>
                           </div>
                           <div className="flex justify-between items-end mb-3">
                             <div className="text-sm font-bold text-gray-900">{formatCurrency(spent, budget.currency)} <span className="text-gray-400 font-medium">/ {formatCurrency(budget.total_monthly_budget, budget.currency)}</span></div>
                           </div>
                           <div className="w-full bg-white h-2.5 rounded-full overflow-hidden shadow-inner border border-gray-100">
                             <div className={`h-full rounded-full transition-all duration-1000 ${percent > 100 ? 'bg-red-500' : 'bg-teal-500'}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm font-bold">
                           <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${percent > 90 ? 'bg-orange-50 text-orange-600' : 'bg-teal-50 text-teal-600'}`}>
                             {percent > 90 ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                             {percent > 90 ? 'Approaching Limit' : 'On Track'}
                           </div>
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-8 pt-0 mt-auto">
                        <Button 
                          className="w-full bg-gray-900 text-white hover:bg-teal-600 font-bold h-14 rounded-2xl transition-all duration-300 transform active:scale-95 group/btn"
                          onClick={() => navigate(`/budget/${budget.id}/edit`)}
                        >
                          Launch Planner <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CostCalculatorPage;
