import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from '@/lib/motion';
import { Search, Filter, BookOpen, Home, CreditCard, Heart, Zap, Briefcase, Globe, Truck, Loader2 } from '@/lib/icons';
import { useTemplates } from '@/hooks/useTemplates';
import TemplatePreviewModal from '@/components/TemplatePreviewModal';

const TemplatesPage = () => {
  const { templates, loading, importTemplate, downloadTemplate } = useTemplates();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const categories = [
    { id: 'All', label: 'All Templates', icon: BookOpen },
    { id: 'visa', label: 'Visa', icon: Globe },
    { id: 'housing', label: 'Housing', icon: Home },
    { id: 'banking', label: 'Banking', icon: CreditCard },
    { id: 'healthcare', label: 'Health', icon: Heart },
    { id: 'utilities', label: 'Utilities', icon: Zap },
  ];

  const getCategoryIcon = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.icon : BookOpen;
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Document Templates - Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Template Library</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional checklists and task templates to jumpstart your relocation process.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
              />
            </div>

            {/* Category Pills - Mobile scrollable */}
            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
               <div className="flex gap-2">
                 {categories.map((cat) => {
                   const Icon = cat.icon;
                   const isActive = activeCategory === cat.id;
                   return (
                     <button
                       key={cat.id}
                       onClick={() => setActiveCategory(cat.id)}
                       className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                         isActive 
                           ? 'bg-teal-600 text-white shadow-md' 
                           : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                       }`}
                     >
                       <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                       {cat.label}
                     </button>
                   );
                 })}
               </div>
            </div>
          </div>

          {/* Grid */}
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template, idx) => {
                const Icon = getCategoryIcon(template.category);
                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedTemplate(template)}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer group transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="h-2 bg-gradient-to-r from-teal-400 to-teal-600" />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                         <div className="p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                           <Icon className="w-6 h-6 text-teal-600" />
                         </div>
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{template.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{template.title}</h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">{template.description}</p>
                      
                      <div className="flex items-center text-xs font-medium text-gray-400 pt-4 border-t border-gray-50">
                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">{template.tasks?.length} Tasks</span>
                        <span className="mx-2">•</span>
                        <span>Official Guide</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No templates found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}

        </div>
      </div>

      <TemplatePreviewModal
        template={selectedTemplate}
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        onImport={importTemplate}
        onDownload={downloadTemplate}
      />
    </>
  );
};

export default TemplatesPage;