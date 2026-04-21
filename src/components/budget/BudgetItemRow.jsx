
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Save, X, Edit2 } from '@/lib/icons';
import { formatCurrency } from '@/utils/budgetUtils';

const BudgetItemRow = ({ item, onUpdate, onDelete, currency = 'EUR' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({ 
    name: item.name, 
    estimated_cost: item.estimated_cost, 
    actual_cost: item.actual_cost 
  });

  const handleSave = () => {
    onUpdate(item.id, editValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({ 
      name: item.name, 
      estimated_cost: item.estimated_cost, 
      actual_cost: item.actual_cost 
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="grid grid-cols-12 gap-2 items-center p-2 bg-blue-50 rounded-md mb-2 border border-blue-100">
        <div className="col-span-5">
          <Input 
            value={editValues.name} 
            onChange={(e) => setEditValues({...editValues, name: e.target.value})}
            placeholder="Item Name"
            className="h-8 text-sm"
          />
        </div>
        <div className="col-span-2">
          <Input 
            type="number" 
            value={editValues.estimated_cost} 
            onChange={(e) => setEditValues({...editValues, estimated_cost: Number(e.target.value)})}
            placeholder="Est."
            className="h-8 text-sm"
          />
        </div>
        <div className="col-span-2">
          <Input 
            type="number" 
            value={editValues.actual_cost} 
            onChange={(e) => setEditValues({...editValues, actual_cost: Number(e.target.value)})}
            placeholder="Act."
            className="h-8 text-sm"
          />
        </div>
        <div className="col-span-3 flex justify-end gap-1">
          <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0 text-green-600 hover:bg-green-100">
            <Save className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 w-8 p-0 text-red-600 hover:bg-red-100">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-2 items-center p-3 hover:bg-gray-50 rounded-md transition-colors group mb-1 border-b border-gray-50 last:border-0">
      <div className="col-span-5 flex items-center gap-2 font-medium text-gray-700 truncate">
        <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
        {item.name}
      </div>
      <div className="col-span-2 text-gray-500 text-xs text-right">
        {formatCurrency(item.estimated_cost, currency)}
      </div>
      <div className="col-span-3 text-gray-900 font-bold text-sm text-right">
        {formatCurrency(item.actual_cost || 0, currency)}
      </div>
      <div className="col-span-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="h-7 w-7 p-0 text-gray-400 hover:text-teal-600">
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onDelete(item.id)} className="h-7 w-7 p-0 text-gray-400 hover:text-red-500">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default BudgetItemRow;
