
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from '@/lib/icons';
import { useToast } from '@/components/ui/use-toast';

const AddItemForm = ({ categories, onAdd, loading }) => {
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [actualCost, setActualCost] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryId || !name) {
      toast({ title: "Validation Error", description: "Please fill in category and item name", variant: "destructive" });
      return;
    }

    onAdd({
      category_id: categoryId,
      name,
      estimated_cost: Number(estimatedCost) || 0,
      actual_cost: Number(actualCost) || 0,
      frequency: 'monthly'
    });

    // Reset
    setName('');
    setEstimatedCost('');
    setActualCost('');
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Plus className="w-4 h-4 text-teal-600" /> Add Expense Item
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs text-gray-500">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <Label className="text-xs text-gray-500">Item Name</Label>
          <Input 
            placeholder="e.g. Rent, Groceries" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Est. Cost</Label>
            <Input 
              type="number" 
              placeholder="0.00" 
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Act. Cost</Label>
            <Input 
              type="number" 
              placeholder="0.00" 
              value={actualCost}
              onChange={(e) => setActualCost(e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-2" disabled={loading}>
          {loading ? 'Adding...' : 'Add Item'}
        </Button>
      </form>
    </div>
  );
};

export default AddItemForm;
