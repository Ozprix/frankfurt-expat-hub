import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from '@/lib/motion';
import { Calendar, ShieldCheck, ArrowLeft } from '@/lib/icons';
import { Link } from 'react-router-dom';
import { useCalendarIntegration } from '@/hooks/useCalendarIntegration';
import CalendarIntegrationCard from '@/components/CalendarIntegrationCard';
import { Loader2 } from '@/lib/icons';

const CalendarIntegrationPage = () => {
  const { 
    integrations, 
    loading, 
    initiateGoogleOAuth, 
    initiateOutlookOAuth, 
    disconnectCalendar 
  } = useCalendarIntegration();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  }

  const googleIntegration = integrations.find(i => i.provider === 'google');
  const outlookIntegration = integrations.find(i => i.provider === 'outlook');

  return (
    <>
      <Helmet>
        <title>Calendar Integration - Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/account" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors">
               <ArrowLeft className="w-4 h-4 mr-1" /> Back to Account
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900">Calendar Settings</h1>
            <p className="text-lg text-gray-600 mt-2">
              Sync your relocation tasks with your personal calendar to never miss a deadline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <CalendarIntegrationCard 
                  provider="google" 
                  integration={googleIntegration}
                  onConnect={initiateGoogleOAuth}
                  onDisconnect={disconnectCalendar}
                />
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <CalendarIntegrationCard 
                  provider="outlook" 
                  integration={outlookIntegration}
                  onConnect={initiateOutlookOAuth}
                  onDisconnect={disconnectCalendar}
                />
             </motion.div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
             <div className="flex items-start">
               <ShieldCheck className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
               <div>
                 <h3 className="font-bold text-blue-900">Privacy & Security</h3>
                 <p className="text-sm text-blue-800 mt-1">
                   We only access your calendar to add relocation tasks. We do not read your existing events or share your calendar data with third parties. 
                   You can disconnect at any time to remove our access.
                 </p>
               </div>
             </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default CalendarIntegrationPage;