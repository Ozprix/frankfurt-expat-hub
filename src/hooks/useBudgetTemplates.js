
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { budgetTemplatesData } from '@/data/budgetTemplatesData';

const normalizeTemplateCategory = (categoryName = '') => {
  const value = categoryName.toLowerCase();

  if (value.includes('housing') || value.includes('rent')) return 'Housing';
  if (value.includes('grocery') || value.includes('food') || value.includes('dining')) return 'Food & Groceries';
  if (value.includes('transport') || value.includes('ticket') || value.includes('bike') || value.includes('car')) return 'Transport';
  if (value.includes('health') || value.includes('insurance') || value.includes('medical')) return 'Healthcare';
  if (value.includes('school') || value.includes('education') || value.includes('book') || value.includes('student')) return 'Education';
  if (value.includes('internet') || value.includes('mobile') || value.includes('subscription') || value.includes('utilities')) return 'Utilities & Services';
  if (value.includes('work') || value.includes('business') || value.includes('office') || value.includes('software')) return 'Work & Business';

  return 'Entertainment';
};

const fallbackSystemTemplates = budgetTemplatesData.map((template) => ({
  id: template.id,
  name: template.name,
  description: template.description,
  total_amount: template.total_budget,
  currency: 'EUR',
  is_preset: true,
  category_breakdown: template.categories.map((category) => ({
    category_name: normalizeTemplateCategory(category.name),
    items: [
      {
        name: category.name,
        estimated_cost: category.amount,
      },
    ],
  })),
}));

const isMissingTableError = (error) => {
  const message = `${error?.message || ''} ${error?.details || ''}`.toLowerCase();
  return error?.code === '42P01' || message.includes('does not exist') || message.includes('schema cache');
};

const normalizeUserTemplateRecord = (template) => ({
  ...template,
  is_preset: false,
  total_monthly_budget: Number(template.total_amount || 0),
});

const normalizeLegacyUserTemplateRecord = (template) => ({
  ...template,
  is_preset: false,
  name: template.template_name || template.name,
  total_monthly_budget: Number(template.total_monthly_budget || 0),
});

const buildSnapshotBreakdown = (budget, budgetItems = [], categories = []) => {
  const categoriesById = new Map((categories || []).map((category) => [String(category.id), category]));
  const groups = new Map();

  budgetItems.forEach((item) => {
    const category = categoriesById.get(String(item.category_id || ''));
    const categoryName = category?.name || normalizeTemplateCategory(item.name);

    if (!groups.has(categoryName)) {
      groups.set(categoryName, {
        category_name: categoryName,
        items: [],
      });
    }

    groups.get(categoryName).items.push({
      name: item.name,
      estimated_cost: Number(item.estimated_cost) || 0,
      actual_cost: Number(item.actual_cost) || 0,
      frequency: item.frequency || 'monthly',
      notes: item.notes || null,
    });
  });

  return {
    name: budget.template_name || budget.name,
    description: budget.description || `Saved from ${budget.name}.`,
    total_amount: Number(budget.total_monthly_budget) || 0,
    currency: budget.currency || 'EUR',
    category_breakdown: Array.from(groups.values()),
  };
};

const fetchLegacyUserTemplates = async (userId) => {
  const { data, error } = await supabase
    .from('user_budgets')
    .select('*, user_budget_items(*)')
    .eq('user_id', userId)
    .eq('is_template', true);

  if (error) throw error;
  return (data || []).map(normalizeLegacyUserTemplateRecord);
};

const mergeUserTemplates = (snapshotTemplates = [], legacyTemplates = []) => {
  const mergedByName = new Map();

  snapshotTemplates.forEach((template) => {
    mergedByName.set(template.name.trim().toLowerCase(), template);
  });

  legacyTemplates.forEach((template) => {
    const key = template.name.trim().toLowerCase();
    if (!mergedByName.has(key)) {
      mergedByName.set(key, template);
    }
  });

  return Array.from(mergedByName.values());
};

export const useBudgetTemplates = () => {
  const [templates, setTemplates] = useState({ system: [], user: [] });
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

      // Fetch User Templates (immutable user snapshots)
      let userTemplates = [];
      if (user) {
        const { data: myTemplates, error: userError } = await supabase
          .from('user_budget_templates')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        const legacyTemplates = await fetchLegacyUserTemplates(user.id);
        
        if (userError && !isMissingTableError(userError)) throw userError;
        userTemplates = isMissingTableError(userError)
          ? legacyTemplates
          : mergeUserTemplates((myTemplates || []).map(normalizeUserTemplateRecord), legacyTemplates);
      }

      setTemplates({
        system: sysError ? fallbackSystemTemplates : ((systemTemplates && systemTemplates.length > 0) ? systemTemplates : fallbackSystemTemplates),
        user: userTemplates || []
      });

      if (sysError) {
        console.warn('Falling back to bundled budget templates:', sysError);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
      setTemplates({
        system: fallbackSystemTemplates,
        user: [],
      });
      toast({ title: "Notice", description: "Loaded bundled templates while reconnecting saved blueprints.", variant: "default" });
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
        const { data: categories, error: categoriesError } = await supabase.from('cost_categories').select('id, name');
        if (categoriesError) throw categoriesError;
        const categoryMap = new Map((categories || []).map((category) => [category.name.toLowerCase(), category.id]));
        
        template.category_breakdown.forEach(cat => {
            const normalizedCategoryName = normalizeTemplateCategory(cat.category_name).toLowerCase();
            const categoryId = categoryMap.get(normalizedCategoryName);
            (cat.items || []).forEach(item => {
              itemsToInsert.push({
                budget_id: newBudget.id,
                category_id: categoryId || null,
                name: item.name,
                estimated_cost: item.estimated_cost,
                actual_cost: item.actual_cost || 0,
                frequency: item.frequency || 'monthly',
                notes: item.notes || null,
              });
            });
        });
      } else if (template.user_budget_items?.length > 0) {
        itemsToInsert = template.user_budget_items.map((item) => ({
          budget_id: newBudget.id,
          category_id: item.category_id || null,
          name: item.name,
          estimated_cost: item.estimated_cost || 0,
          actual_cost: item.actual_cost || 0,
          frequency: item.frequency || 'monthly',
          notes: item.notes || null,
        }));
      }

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
            .from('user_budget_items')
            .insert(itemsToInsert);
        if (itemsError) {
          await supabase.from('user_budgets').delete().eq('id', newBudget.id);
          throw itemsError;
        }
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
      if (!user) {
        toast({ title: "Error", description: "Must be logged in", variant: "destructive" });
        return false;
      }

      const [{ data: budget, error: budgetError }, { data: categories, error: categoriesError }] = await Promise.all([
        supabase
          .from('user_budgets')
          .select('*, user_budget_items(*)')
          .eq('id', budgetId)
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('cost_categories')
          .select('id, name'),
      ]);

      if (budgetError) throw budgetError;
      if (categoriesError) throw categoriesError;

      const snapshot = buildSnapshotBreakdown(
        { ...budget, template_name: templateName },
        budget.user_budget_items || [],
        categories || []
      );

      const { error } = await supabase
        .from('user_budget_templates')
        .upsert({
          user_id: user.id,
          source_budget_id: budget.id,
          name: templateName,
          description: snapshot.description,
          total_amount: snapshot.total_amount,
          currency: snapshot.currency,
          category_breakdown: snapshot.category_breakdown,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,name' });

      if (error) {
        if (isMissingTableError(error)) {
          const { error: legacyError } = await supabase
            .from('user_budgets')
            .update({ is_template: true, template_name: templateName })
            .eq('id', budgetId)
            .eq('user_id', user.id);

          if (legacyError) throw legacyError;
          toast({ title: "Saved", description: "Blueprint saved using the legacy template format." });
          fetchTemplates();
          return true;
        }

        throw error;
      }

      toast({ title: "Success", description: "Blueprint saved" });
      fetchTemplates(); // Refresh
      return true;
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to save blueprint snapshot", variant: "destructive" });
      return false;
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
