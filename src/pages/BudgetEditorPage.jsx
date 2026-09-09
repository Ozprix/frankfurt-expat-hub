
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useCostCalculator } from '@/hooks/useCostCalculator';
import { useBudgetTemplates } from '@/hooks/useBudgetTemplates';
import BudgetItemRow from '@/components/budget/BudgetItemRow';
import AddItemForm from '@/components/budget/AddItemForm';
import BudgetSummary from '@/components/budget/BudgetSummary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  MoreHorizontal, 
  Share2, 
  Trash2, 
  Loader2, 
  Sparkles 
} from '@/lib/icons';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { calculateCategoryTotal, formatCurrency } from '@/utils/budgetUtils';
import { useToast } from '@/components/ui/use-toast';

const BudgetEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { saveAsTemplate } = useBudgetTemplates();
  const { 
    fetchBudget, 
    updateBudget, 
    addBudgetItem, 
    updateBudgetItem, 
    deleteBudgetItem, 
    duplicateBudget,
    deleteBudget,
    exportPDF,
    costCategories,
    createBudget
  } = useCostCalculator();

  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const isCreateMode = location.pathname === '/budget/create' || !id;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      if (isCreateMode) {
        setBudget({ name: 'My Frankfurt Budget', total_monthly_budget: 2500, currency: 'EUR' });
        setItems([]);
        setLoading(false);
        return;
      }

      const data = await fetchBudget(id);
      if (data) {
        setBudget(data);
        setItems(data.user_budget_items || []);
      } else {
        navigate('/cost-calculator', { replace: true });
      }
      setLoading(false);
    };
    loadData();
  }, [id, isCreateMode, fetchBudget, navigate]);

  const groupedItems = useMemo(() => {
    const groups = {};
    costCategories.forEach(cat => { groups[cat.id] = { ...cat, items: [] }; });
    const uncategorizedItems = [];

    items.forEach(item => {
      if (groups[item.category_id]) {
        groups[item.category_id].items.push(item);
        return;
      }

      uncategorizedItems.push(item);
    });

    const visibleGroups = Object.values(groups).filter(g => g.items.length > 0);

    if (uncategorizedItems.length > 0) {
      visibleGroups.push({
        id: 'uncategorized',
        name: 'Uncategorized',
        icon: '?',
        items: uncategorizedItems,
      });
    }

    return visibleGroups;
  }, [items, costCategories]);

  const handleSaveMeta = async () => {
    setIsSaving(true);
    try {
      if (isCreateMode) {
        const newBudget = await createBudget(budget);
        if (newBudget) navigate(`/budget/${newBudget.id}/edit`, { replace: true });
      } else {
        await updateBudget(id, { name: budget.name, total_monthly_budget: budget.total_monthly_budget });
        toast({ title: "Updated", description: "Budget settings saved successfully." });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddItem = async (itemData) => {
    if (isCreateMode) {
      toast({ title: "Action Required", description: "Save the budget first to add items.", variant: "warning" });
      return;
    }
    await addBudgetItem(id, itemData);
    const updated = await fetchBudget(id);
    if(updated) setItems(updated.user_budget_items || []);
  };

  const handleUpdateItem = async (itemId, updates) => {
    await updateBudgetItem(itemId, updates);
    setItems(items.map(i => i.id === itemId ? { ...i, ...updates } : i));
  };

  const handleDeleteItem = async (itemId) => {
    await deleteBudgetItem(itemId, id);
    setItems(items.filter(i => i.id !== itemId));
  };

  const handleSaveAsTemplate = async () => {
    if (isCreateMode || !budget?.id) {
      toast({ title: "Action Required", description: "Create the budget before saving it as a blueprint.", variant: "warning" });
      return;
    }

    const templateName = window.prompt('Save this budget as a reusable blueprint:', budget.name);
    if (!templateName?.trim()) return;

    await saveAsTemplate(budget.id, templateName.trim());
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
      <p className="text-gray-500 font-medium">Synchronizing your budget...</p>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{isCreateMode ? 'Create Budget' : budget.name} | Budget Planner</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-100 sticky top-16 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/cost-calculator')} className="hover:bg-teal-50 hover:text-teal-700">
                <ArrowLeft className="w-4 h-4 mr-2" /> Planner
              </Button>
              <div className="h-8 w-px bg-gray-200" />
              <div className="flex flex-col">
                <Input 
                  value={budget.name} 
                  onChange={(e) => setBudget({...budget, name: e.target.value})}
                  className="text-xl font-black border-none hover:bg-gray-50 focus:bg-white px-2 h-9 w-64 tracking-tight"
                />
                <div className="flex items-center gap-2 px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest mt-0.5">
                  Goal: 
                  <Input 
                    type="number"
                    value={budget.total_monthly_budget}
                    onChange={(e) => setBudget({...budget, total_monthly_budget: Number(e.target.value)})}
                    className="h-5 w-20 text-[10px] bg-transparent border-b border-t-0 border-x-0 rounded-none p-0 focus:ring-0 font-black text-teal-600"
                  />
                  {budget.currency}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleSaveMeta} disabled={isSaving} className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-100">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {isCreateMode ? 'Create' : 'Save'}
              </Button>
              
              {!isCreateMode && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-lg">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleSaveAsTemplate}>
                      <Sparkles className="w-4 h-4 mr-2" /> Save as Blueprint
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportPDF(budget)}>
                      <Download className="w-4 h-4 mr-2" /> PDF Export
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => duplicateBudget(budget)}>
                      <Share2 className="w-4 h-4 mr-2" /> Duplicate Plan
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => {
                        if(confirm('Delete this budget permanently?')) {
                            deleteBudget(budget.id).then((wasDeleted) => {
                              if (wasDeleted) {
                                navigate('/cost-calculator');
                              }
                            });
                        }
                    }}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              {groupedItems.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center">
                  <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-teal-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Build your Frankfurt budget</h3>
                  <p className="text-gray-500 max-w-sm">Add your expected expenses using the form on the right to start tracking your relocation costs.</p>
                </div>
              ) : (
                groupedItems.map(group => {
                    const subtotalAct = group.items.reduce((sum, i) => sum + (Number(i.actual_cost)||0), 0);
                    return (
                        <Card key={group.id} className="border-none shadow-sm overflow-hidden bg-white rounded-2xl">
                          <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                              <h3 className="font-bold text-gray-800 flex items-center gap-3">
                                <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">{group.icon}</span>
                                {group.name}
                              </h3>
                              <div className="text-xs font-bold text-gray-400 tracking-wider">
                                SUB: <span className="text-gray-900 ml-1">{formatCurrency(subtotalAct, budget.currency)}</span>
                              </div>
                          </div>
                          <CardContent className="p-0">
                              {group.items.map(item => (
                                <BudgetItemRow 
                                    key={item.id} 
                                    item={item} 
                                    currency={budget.currency}
                                    onUpdate={handleUpdateItem}
                                    onDelete={handleDeleteItem}
                                />
                              ))}
                          </CardContent>
                        </Card>
                    );
                })
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <BudgetSummary budget={budget} items={items} />
              <AddItemForm categories={costCategories} onAdd={handleAddItem} loading={false} />
              
              <div className="bg-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-teal-100 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-700" />
                 <h4 className="font-black uppercase tracking-widest text-[10px] mb-2 text-teal-200">Expat Pro-Tip</h4>
                 <p className="text-sm leading-relaxed font-medium">Frankfurt rent usually accounts for 35-45% of an expat's budget. Don't forget to include the 'Nebenkosten' (utilities) separately!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetEditorPage;
