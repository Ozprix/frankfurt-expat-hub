import React from 'react';
import { motion } from '@/lib/motion';
import { Users } from '@/lib/icons';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const PaymentButton = ({ 
  tierName,
  buttonText = "Join Free Beta",
  className = "",
  highlighted = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePayment = async () => {
    toast({
      title: "Checkout Paused",
      description: user
        ? `${tierName || 'Premium'} access is currently free.`
        : 'Create a free account to use the tools.',
    });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePayment}
      aria-label={`Create free account for ${tierName}`}
      className={`relative w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
        highlighted
          ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg'
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      } ${className}`}
    >
      <Users className="w-4 h-4" />
      {buttonText}
    </motion.button>
  );
};

export default PaymentButton;
