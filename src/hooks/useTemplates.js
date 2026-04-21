import { useState, useEffect } from 'react';
import { supabaseClient } from '@/config/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { usePlan } from '@/hooks/usePlan';
import { downloadPDF } from '@/utils/pdfGenerator';

const CACHE_KEY = 'templates_cache';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export const useTemplates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addTask } = usePlan();
  
  const [templates, setTemplates] = useState([]);
  const [userTemplates, setUserTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTemplates = async (force = false) => {
    setLoading(true);
    try {
      // 1. Fetch Library
      let library = [];
      const cached = localStorage.getItem(CACHE_KEY);
      
      if (!force && cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          library = data;
        }
      }

      if (library.length === 0) {
        const { data, error } = await supabaseClient
          .from('templates')
          .select('*')
          .order('title');
        
        if (error) throw error;
        library = data;
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: library,
          timestamp: Date.now()
        }));
      }

      setTemplates(library);

      // 2. Fetch User Imports
      if (user) {
        const { data: imports, error: importError } = await supabaseClient
          .from('user_templates')
          .select('*')
          .eq('user_id', user.id);
        
        if (importError) throw importError;
        setUserTemplates(imports);
      }

    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const importTemplate = async (template) => {
    if (!user) return;
    try {
      // 1. Record Import
      const { error: logError } = await supabaseClient
        .from('user_templates')
        .insert({ user_id: user.id, template_id: template.id });
      
      if (logError) throw logError;

      // 2. Add tasks to plan
      // We process sequentially to avoid potential race conditions in usePlan hook if it's sensitive
      for (const task of template.tasks) {
          // Add default structure for plan tasks
          await addTask({
            title: task.title,
            description: task.description,
            category: template.category,
            status: 'pending',
            priority: 'medium',
            officialLink: '',
            dueDate: '',
            dependsOn: [],
            conditions: []
          });
      }

      // Refresh imports
      fetchTemplates(true);
      
      toast({
        title: "Template Imported",
        description: `Successfully added ${template.tasks.length} tasks to your plan.`
      });

    } catch (err) {
      console.error('Import error:', err);
      toast({
        title: "Import Failed",
        description: "Could not import tasks.",
        variant: "destructive"
      });
    }
  };

  const downloadTemplate = async (template) => {
    try {
      await downloadPDF(template);
      toast({ title: "Downloading PDF", description: "Your download should start shortly." });
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "PDF generation failed.", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [user]);

  return {
    templates,
    userTemplates,
    importTemplate,
    downloadTemplate,
    loading,
    error
  };
};
