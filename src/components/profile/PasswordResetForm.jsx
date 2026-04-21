
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, CheckCircle, XCircle } from '@/lib/icons';
import { usePasswordStrength } from '@/hooks/usePasswordStrength';

const PasswordResetForm = ({ onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { strength, label, color, requirements } = usePasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strength < 3 || newPassword !== confirmPassword) return;
    
    setIsSubmitting(true);
    await onSubmit(newPassword);
    setIsSubmitting(false);
    
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const RequirementItem = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-xs ${met ? 'text-green-600' : 'text-gray-400'}`}>
      {met ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      <span>{text}</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>New Password</Label>
        <div className="relative">
          <Input 
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="pr-10"
            placeholder="Enter new password"
          />
          <button 
            type="button"
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        
        {/* Strength Meter */}
        <div className="space-y-1 mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Strength:</span>
            <span className={`font-medium ${color.replace('bg-', 'text-')}`}>{label}</span>
          </div>
          <div className="flex gap-1 h-1.5 w-full">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step} 
                className={`flex-1 rounded-full transition-colors ${step <= strength ? color : 'bg-gray-100'}`}
              />
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <RequirementItem met={requirements.length} text="8+ Characters" />
          <RequirementItem met={requirements.uppercase} text="Uppercase Letter" />
          <RequirementItem met={requirements.lowercase} text="Lowercase Letter" />
          <RequirementItem met={requirements.number} text="Number" />
          <RequirementItem met={requirements.special} text="Special Char" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Confirm New Password</Label>
        <Input 
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className={confirmPassword && newPassword !== confirmPassword ? 'border-red-500' : ''}
        />
        {confirmPassword && newPassword !== confirmPassword && (
          <p className="text-xs text-red-500">Passwords do not match</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-teal-600 hover:bg-teal-700" 
        disabled={strength < 3 || newPassword !== confirmPassword || isSubmitting}
      >
        {isSubmitting ? 'Updating...' : 'Change Password'}
      </Button>
    </form>
  );
};

export default PasswordResetForm;
