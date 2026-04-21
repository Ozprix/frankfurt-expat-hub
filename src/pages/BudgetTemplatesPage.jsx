
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useBudgetTemplates } from '@/hooks/useBudgetTemplates';
import BudgetTemplateCard from '@/components/budget/BudgetTemplateCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BookTemplate, Loader2, ArrowLeft, ChevronRight } from '@/lib/icons';

const BudgetTemplatesPage = () => {
  const { templates, fetchTemplates, applyTemplate, loading } = useBudgetTemplates();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleUseTemplate = async (template) => {
    const name = window.prompt("Customize your budget name:", template.name);
    if (name) {
      const newId = await applyTemplate(template, name);
      if (newId) navigate(`/budget/${newId}/edit`);
    }
  };

  if (loading && (!templates.system || templates.system.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-teal-600 mb-4" />
        <p className="text-gray-500 font-bold tracking-tight">Curating relocation blueprints...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Budget Blueprints | Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Button variant="ghost" size="sm" onClick={() => navigate('/cost-calculator')} className="mb-8 hover:bg-teal-50 text-gray-500 hover:text-teal-700 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Budgets
            </Button>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="max-w-2xl">
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal-100">
                    <BookTemplate className="w-6 h-6" />
                  </div>
                  Blueprints
                </h1>
                <p className="text-xl text-gray-500 font-medium leading-relaxed">
                  Start with a battle-tested financial plan based on your persona. From students to families, we've mapped the Frankfurt reality.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="system" className="w-full">
            <div className="flex items-center justify-between mb-8">
              <TabsList className="bg-white border border-gray-200 p-1 rounded-2xl shadow-sm h-14">
                <TabsTrigger value="system" className="rounded-xl px-8 h-12 data-[state=active]:bg-gray-900 data-[state=active]:text-white transition-all font-bold">
                  Standard Templates
                </TabsTrigger>
                <TabsTrigger value="user" className="rounded-xl px-8 h-12 data-[state=active]:bg-gray-900 data-[state=active]:text-white transition-all font-bold">
                  My Saved Blueprints
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="system">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.system?.map(template => (
                  <BudgetTemplateCard key={template.id} template={template} onUse={handleUseTemplate} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="user">
               {templates.user?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {templates.user.map(template => (
                    <BudgetTemplateCard key={template.id} template={template} onUse={handleUseTemplate} />
                  ))}
                </div>
               ) : (
                 <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                   <div className="max-w-sm mx-auto">
                     <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <BookTemplate className="w-10 h-10" />
                     </div>
                     <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Your template gallery is empty</h3>
                     <p className="text-gray-500 mb-8 font-medium">Save any of your active budgets as a template to reuse it for future planning or scenarios.</p>
                     <Button variant="outline" className="rounded-xl font-bold h-12" onClick={() => navigate('/budget/create')}>
                        Create From Scratch
                     </Button>
                   </div>
                 </div>
               )}
            </TabsContent>
          </Tabs>

          <div className="mt-20 p-10 bg-gray-900 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-1000" />
            <div className="max-w-xl z-10">
              <h3 className="text-3xl font-black tracking-tight mb-4">Don't see what you need?</h3>
              <p className="text-gray-400 text-lg font-medium">Create a blank budget and build your own custom structure from the ground up.</p>
            </div>
            <Button 
              size="lg" 
              onClick={() => navigate('/budget/create')} 
              className="bg-white text-gray-900 hover:bg-teal-50 font-bold px-10 h-16 rounded-2xl text-lg group z-10"
            >
              Blank Canvas <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetTemplatesPage;
