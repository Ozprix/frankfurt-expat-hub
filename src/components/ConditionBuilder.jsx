import React from 'react';
import { Plus, X } from '@/lib/icons';

const ConditionBuilder = ({ conditions, onChange }) => {
  const fields = [
    'hasAnmeldung', 'visaType', 'householdType', 'hasInsurance', 'arrivalDate', 'isInFrankfurt', 'employmentStatus'
  ];
  
  const operators = [
    '==', '!=', 'includes', '>', '<', 'exists'
  ];

  const handleAdd = () => {
    onChange([...conditions, { field: 'visaType', operator: '==', value: '' }]);
  };

  const handleRemove = (index) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    onChange(newConditions);
  };

  const updateCondition = (index, key, val) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [key]: val };
    onChange(newConditions);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">Conditions</label>
        <button
          type="button"
          onClick={handleAdd}
          className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded hover:bg-teal-100 flex items-center"
        >
          <Plus className="w-3 h-3 mr-1" /> Add Condition
        </button>
      </div>
      
      {conditions.length === 0 && (
          <p className="text-sm text-gray-500 italic">No conditions (task applies to everyone)</p>
      )}

      {conditions.map((cond, index) => (
        <div key={index} className="flex gap-2 items-center">
          <select
            value={cond.field}
            onChange={(e) => updateCondition(index, 'field', e.target.value)}
            className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm p-2 border"
          >
            {fields.map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          <select
            value={cond.operator}
            onChange={(e) => updateCondition(index, 'operator', e.target.value)}
            className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm p-2 border"
          >
            {operators.map(op => <option key={op} value={op}>{op}</option>)}
          </select>

          <input
            type="text"
            value={cond.value}
            onChange={(e) => updateCondition(index, 'value', e.target.value)}
            placeholder="Value"
            className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm p-2 border"
          />

          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <p className="text-xs text-gray-500 mt-1">Define rules that determine when this task appears for a user.</p>
    </div>
  );
};

export default ConditionBuilder;