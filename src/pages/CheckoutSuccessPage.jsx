import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from '@/lib/motion';
import { CheckCircle, LayoutDashboard, Settings } from '@/lib/icons';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tier, getRenewalPrice, billing_period } = useSubscription();

  // Auto-redirect after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 15000);
    return () => clearTimeout(timer);
  }, [navigate]);
  
  // Format price helper
  const formatPrice = (priceInCents) => {
    if (!priceInCents) return 'calculating...';
    return `€${(priceInCents / 100).toFixed(2)}`;
  };

  return (
    <>
      <Helmet>
        <title>Payment Successful - Frankfurt Expat Services</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="bg-green-100 p-4 rounded-full"
            >
              <CheckCircle className="w-16 h-16 text-green-600" />
            </motion.div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your account has been upgraded and you now have full access to {tier} features.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Subscription Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-900">{tier || 'Premium Plan'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing Period</span>
                <span className="font-medium text-gray-900 capitalize">{billing_period || 'Monthly'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-medium text-gray-900">
                   {formatPrice(getRenewalPrice())}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="flex items-center justify-center w-full px-4 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Go to Dashboard
              <LayoutDashboard className="w-4 h-4 ml-2" />
            </Link>
            
            <Link
              to="/account"
              className="flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              View Account Settings
              <Settings className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-400">
            Redirecting to dashboard in 15 seconds...
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default CheckoutSuccessPage;