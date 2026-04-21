import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from '@/lib/motion';
import { XCircle, ArrowLeft, Mail } from '@/lib/icons';

const CheckoutCancelPage = () => {
  return (
    <>
      <Helmet>
        <title>Payment Cancelled - Frankfurt Expat Services</title>
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
              className="bg-amber-100 p-4 rounded-full"
            >
              <XCircle className="w-16 h-16 text-amber-600" />
            </motion.div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
          <p className="text-gray-600 mb-8">
            The checkout process was cancelled. No charges were made to your card.
            You can try again whenever you're ready.
          </p>

          <div className="space-y-3">
            <Link
              to="/pricing"
              className="flex items-center justify-center w-full px-4 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Pricing
            </Link>
            
            <a
              href="mailto:hello@frankfurtexpatservices.com"
              className="flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Contact Support
              <Mail className="w-4 h-4 ml-2" />
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CheckoutCancelPage;