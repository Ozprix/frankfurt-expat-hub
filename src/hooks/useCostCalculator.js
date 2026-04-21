
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { generateBudgetPDF } from '@/utils/budgetUtils';
import { useAuth } from '@/context/AuthContext';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useCostCalculator = () => {
  const [budgets, setBudgets] = useState([]);
  const [costCategories, setCostCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch Categories (Reference Data)
  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('cost_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      setCostCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  // Fetch All User Budgets
  const fetchUserBudgets = useCallback(async (force = false) => {
    if (!user) return;
    const now = Date.now();
    if (!force && now - lastFetch < CACHE_TTL && budgets.length > 0) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_budgets')
        .select('*, user_budget_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBudgets(data);
      setLastFetch(now);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error fetching budgets",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, lastFetch, budgets.length, toast]);

  // Fetch Single Budget
  const fetchBudget = async (budgetId) => {
    try {
      const { data, error } = await supabase
        .from('user_budgets')
        .select('*, user_budget_items(*)')
        .eq('id', budgetId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not load budget details", variant: "destructive" });
      return null;
    }
  };

  // CRUD Operations
  const createBudget = async (budgetData) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_budgets')
        .insert([{ ...budgetData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setBudgets([data, ...budgets]);
      toast({ title: "Success", description: "Budget created successfully" });
      return data;
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      throw err;
    }
  };

  const updateBudget = async (budgetId, updates) => {
    try {
      const { data, error } = await supabase
        .from('user_budgets')
        .update(updates)
        .eq('id', budgetId)
        .select()
        .single();

      if (error) throw error;
      setBudgets(budgets.map(b => b.id === budgetId ? { ...b, ...data } : b));
      return data;
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      throw err;
    }
  };

  const deleteBudget = async (budgetId) => {
    try {
      const { error } = await supabase
        .from('user_budgets')
        .delete()
        .eq('id', budgetId);

      if (error) throw error;
      setBudgets(budgets.filter(b => b.id !== budgetId));
      toast({ title: "Success", description: "Budget deleted" });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const duplicateBudget = async (originalBudget) => {
    try {
      // 1. Create new budget
      const { data: newBudget, error: budgetError } = await supabase
        .from('user_budgets')
        .insert([{
          name: `${originalBudget.name} (Copy)`,
          total_monthly_budget: originalBudget.total_monthly_budget,
          currency: originalBudget.currency,
          custom_fields: originalBudget.custom_fields,
          user_id: user.id
        }])
        .select()
        .single();
        
      if (budgetError) throw budgetError;

      // 2. Copy items
      if (originalBudget.user_budget_items?.length > 0) {
        const itemsToInsert = originalBudget.user_budget_items.map(item => ({
          budget_id: newBudget.id,
          category_id: item.category_id,
          name: item.name,
          estimated_cost: item.estimated_cost,
          actual_cost: item.actual_cost,
          frequency: item.frequency,
          notes: item.notes
        }));

        const { error: itemsError } = await supabase
          .from('user_budget_items')
          .insert(itemsToInsert);
          
        if (itemsError) throw itemsError;
      }

      await fetchUserBudgets(true);
      toast({ title: "Success", description: "Budget duplicated successfully" });
      return newBudget.id;
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Item Management
  const addBudgetItem = async (budgetId, itemData) => {
    try {
      const { data, error } = await supabase
        .from('user_budget_items')
        .insert([{ ...itemData, budget_id: budgetId }])
        .select()
        .single();

      if (error) throw error;
      
      // Optimistic update for list view if needed, or rely on refetch
      const updatedBudgets = budgets.map(b => {
        if (b.id === budgetId) {
          const items = b.user_budget_items || [];
          return { ...b, user_budget_items: [...items, data] };
        }
        return b;
      });
      setBudgets(updatedBudgets);
      return data;
    } catch (err) {
      toast({ title: "Error", description: "Failed to add item", variant: "destructive" });
      throw err;
    }
  };

  const updateBudgetItem = async (itemId, updates) => {
    try {
      const { data, error } = await supabase
        .from('user_budget_items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      toast({ title: "Error", description: "Failed to update item", variant: "destructive" });
      throw err;
    }
  };

  const deleteBudgetItem = async (itemId, budgetId) => {
    try {
      const { error } = await supabase
        .from('user_budget_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      const updatedBudgets = budgets.map(b => {
        if (b.id === budgetId) {
          return { 
            ...b, 
            user_budget_items: b.user_budget_items.filter(i => i.id !== itemId) 
          };
        }
        return b;
      });
      setBudgets(updatedBudgets);
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete item", variant: "destructive" });
    }
  };

  // Custom Fields
  const updateCustomFields = async (budgetId, newFields) => {
    return updateBudget(budgetId, { custom_fields: newFields });
  };

  const exportPDF = async (budget) => {
    try {
      await generateBudgetPDF(budget, budget.user_budget_items || [], costCategories);
      toast({ title: "Success", description: "PDF downloaded" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to generate PDF", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchUserBudgets();
    }
  }, [user, fetchCategories, fetchUserBudgets]);

  return {
    budgets,
    costCategories,
    loading,
    error,
    fetchUserBudgets,
    fetchBudget,
    createBudget,
    updateBudget,
    deleteBudget,
    duplicateBudget,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    updateCustomFields,
    exportPDF
  };
};
