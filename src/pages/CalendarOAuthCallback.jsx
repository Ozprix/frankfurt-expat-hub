import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from '@/lib/motion';
import { Loader2, CheckCircle, XCircle } from '@/lib/icons';
import { useCalendarIntegration } from '@/hooks/useCalendarIntegration';
import { useToast } from '@/components/ui/use-toast';

const CalendarOAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOAuthCallback } = useCalendarIntegration();
  const { toast } = useToast();
  
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      
      if (error) {
        setStatus('error');
        setErrorMessage('Access denied or error during authentication.');
        return;
      }

      if (!code) {
        setStatus('error');
        setErrorMessage('No authorization code found.');
        return;
      }

      // Determine provider from path
      const provider = location.pathname.includes('google') ? 'google' : 'outlook';

      try {
        await handleOAuthCallback(code, provider);
        setStatus('success');
        toast({
          title: "Calendar Connected",
          description: `Your ${provider} calendar has been successfully connected.`
        });
        
        // Redirect after delay
        setTimeout(() => {
          navigate('/calendar/settings');
        }, 2000);

      } catch (err) {
        console.error(err);
        setStatus('error');
        setErrorMessage(err.message || 'Failed to connect calendar.');
      }
    };

    processCallback();
  }, [searchParams, location, handleOAuthCallback, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {status === 'processing' && (
          <div className="flex flex-col items-center">
             <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
             <h2 className="text-xl font-bold text-gray-900">Connecting Calendar...</h2>
             <p className="text-gray-500 mt-2">Please wait while we secure your connection.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
             <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
             <h2 className="text-xl font-bold text-gray-900">Success!</h2>
             <p className="text-gray-500 mt-2">Redirecting you back to settings...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
             <XCircle className="w-12 h-12 text-red-500 mb-4" />
             <h2 className="text-xl font-bold text-gray-900">Connection Failed</h2>
             <p className="text-red-500 mt-2">{errorMessage}</p>
             <button 
               onClick={() => navigate('/calendar/settings')}
               className="mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
             >
               Return to Settings
             </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CalendarOAuthCallback;