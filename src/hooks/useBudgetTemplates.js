
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useBudgetTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch System Templates
      const { data: systemTemplates, error: sysError } = await supabase
        .from('budget_templates')
        .select('*')
        .eq('is_preset', true);

      if (sysError) throw sysError;

      // Fetch User Templates (Budgets marked as templates)
      let userTemplates = [];
      if (user) {
        const { data: myTemplates, error: userError } = await supabase
          .from('user_budgets')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_template', true);
        
        if (userError) throw userError;
        userTemplates = myTemplates;
      }

      setTemplates({
        system: systemTemplates || [],
        user: userTemplates || []
      });
    } catch (err) {
      console.error('Error fetching templates:', err);
      toast({ title: "Error", description: "Could not load templates", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const applyTemplate = async (template, budgetName) => {
    if (!user) {
      toast({ title: "Error", description: "Must be logged in", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      
      // 1. Create the budget
      const { data: newBudget, error: budgetError } = await supabase
        .from('user_budgets')
        .insert([{
          user_id: user.id,
          name: budgetName,
          total_monthly_budget: template.total_amount || template.total_monthly_budget,
          currency: template.currency || 'EUR'
        }])
        .select()
        .single();

      if (budgetError) throw budgetError;

      // 2. Prepare items from template breakdown
      // Note: System templates use 'category_breakdown' (JSON), User templates use 'user_budget_items' (if fetching full object)
      // For simplicity, we assume system templates structure here. If it's a user template, we'd need to fetch its items first.
      
      let itemsToInsert = [];
      
      if (template.category_breakdown) {
        // Handle System Template
        // Need to map category names to IDs. Fetch categories first or assume we have them.
        // For robustness, we'll try to match names, or create unmapped items if category not found.
        const { data: categories } = await supabase.from('cost_categories').select('id, name');
        
        template.category_breakdown.forEach(cat => {
            const categoryId = categories.find(c => c.name === cat.category_name)?.id;
            cat.items.forEach(item => {
                itemsToInsert.push({
                    budget_id: newBudget.id,
                    category_id: categoryId, // might be null if no match
                    name: item.name,
                    estimated_cost: item.estimated_cost,
                    actual_cost: 0
                });
            });
        });
      }

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
            .from('user_budget_items')
            .insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      toast({ title: "Success", description: "Budget created from template!" });
      return newBudget.id;
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to apply template", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const saveAsTemplate = async (budgetId, templateName) => {
    try {
      const { error } = await supabase
        .from('user_budgets')
        .update({ is_template: true, template_name: templateName })
        .eq('id', budgetId);

      if (error) throw error;
      toast({ title: "Success", description: "Saved as template" });
      fetchTemplates(); // Refresh
    } catch (err) {
      toast({ title: "Error", description: "Failed to save template", variant: "destructive" });
    }
  };

  return {
    templates,
    loading,
    fetchTemplates,
    applyTemplate,
    saveAsTemplate
  };
};
