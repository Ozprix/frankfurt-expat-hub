
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/budgetUtils';
import { ArrowRight, Layers } from '@/lib/icons';

const BudgetTemplateCard = ({ template, onUse }) => {
  const isPreset = template.is_preset;
  const breakdown = template.category_breakdown || [];
  const total = Number(template.total_amount || template.total_monthly_budget || 0);

  return (
    <Card className="hover:shadow-2xl transition-all duration-500 border-gray-100 group flex flex-col h-full bg-white">
      <CardHeader className="relative overflow-hidden">
        <div className="flex justify-between items-start z-10 relative">
          <Badge variant={isPreset ? "secondary" : "outline"} className={isPreset ? "bg-teal-50 text-teal-700 border-teal-100" : ""}>
            {isPreset ? "Standard Plan" : "My Custom"}
          </Badge>
          <Layers className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors" />
        </div>
        <CardTitle className="text-xl text-gray-900 mt-4 group-hover:text-teal-700 transition-colors">{template.name}</CardTitle>
        <CardDescription className="line-clamp-2 mt-2 text-gray-500 leading-relaxed min-h-[40px]">
          {template.description || "Relocation budget optimized for Frankfurt standards."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Estimated Monthly</div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-gray-900 tracking-tight">{formatCurrency(total, template.currency)}</span>
            <span className="text-sm font-medium text-gray-400">/mo</span>
          </div>
        </div>
        
        {isPreset && breakdown.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Breakdown</p>
            <div className="flex flex-wrap gap-2">
              {breakdown.slice(0, 4).map((cat, idx) => (
                <span key={idx} className="text-[11px] font-bold bg-white border border-gray-100 px-3 py-1 rounded-full text-gray-600 shadow-sm">
                  {cat.category_name}
                </span>
              ))}
              {breakdown.length > 4 && <span className="text-[11px] font-bold text-teal-600 px-1">+{breakdown.length - 4} more</span>}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={() => onUse(template)} 
          className="w-full bg-gray-900 hover:bg-teal-600 text-white font-bold h-12 rounded-xl transition-all duration-300 transform active:scale-95"
        >
          Initialize This Plan <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BudgetTemplateCard;
