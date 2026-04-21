import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from '@/lib/motion';
import { Bell, Mail, Clock, Calendar, CheckCircle, Loader2 } from '@/lib/icons';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';

const NotificationPreferencesPage = () => {
  const { preferences, updatePreferences, loading } = useNotificationPreferences();

  const handleToggle = (key) => {
    if (!preferences) return;
    updatePreferences({ [key]: !preferences[key] });
  };

  const handleSelect = (key, value) => {
    updatePreferences({ [key]: value });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  }

  return (
    <>
      <Helmet>
        <title>Notification Preferences - Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Notification Settings
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Control when and how we contact you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-teal-600 px-6 py-4 flex items-center">
              <Bell className="w-6 h-6 text-white mr-3" />
              <h2 className="text-lg font-bold text-white">Email Preferences</h2>
            </div>

            <div className="p-6 space-y-8">
              {/* Task Reminders */}
              <div className="flex items-start justify-between group">
                <div className="flex-1 pr-4">
                  <div className="flex items-center mb-1">
                    <Clock className="w-5 h-5 text-teal-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Task Reminders</h3>
                  </div>
                  <p className="text-gray-500 text-sm">Receive daily emails at 8 AM for tasks due within 24 hours.</p>
                </div>
                <div className="flex items-center mt-1">
                   <button
                     onClick={() => handleToggle('email_task_reminders')}
                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${preferences?.email_task_reminders ? 'bg-teal-600' : 'bg-gray-200'}`}
                   >
                     <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences?.email_task_reminders ? 'translate-x-6' : 'translate-x-1'}`} />
                   </button>
                </div>
              </div>

              {/* First Month Reminders */}
              <div className="border-t pt-6 flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center mb-1">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">First 30 Days Setup Reminders</h3>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Receive checklist nudges for Anmeldung, insurance, banking, tax ID, and rental paperwork.
                  </p>
                </div>
                <div className="flex items-center mt-1">
                  <button
                    onClick={() => handleToggle('first_month_reminders')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${preferences?.first_month_reminders ? 'bg-teal-600' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences?.first_month_reminders ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {/* Weekly Digest */}
              <div className="border-t pt-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-4">
                    <div className="flex items-center mb-1">
                        <Mail className="w-5 h-5 text-purple-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Weekly Digest</h3>
                    </div>
                    <p className="text-gray-500 text-sm">Get a weekly summary of your progress and completed tasks.</p>
                    </div>
                    <div className="flex items-center mt-1">
                    <button
                        onClick={() => handleToggle('email_weekly_digest')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${preferences?.email_weekly_digest ? 'bg-purple-600' : 'bg-gray-200'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences?.email_weekly_digest ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    </div>
                </div>

                {/* Conditional Settings for Weekly Digest */}
                {preferences?.email_weekly_digest && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-purple-50 rounded-lg p-4 flex flex-col sm:flex-row gap-4"
                    >
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Send on</label>
                            <select
                                value={preferences.digest_day}
                                onChange={(e) => handleSelect('digest_day', e.target.value)}
                                className="block w-full rounded-md border-purple-200 text-sm focus:border-purple-500 focus:ring-purple-500 bg-white py-2"
                            >
                                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                                    <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Time</label>
                            <select
                                value={preferences.reminder_time.slice(0,5)}
                                onChange={(e) => handleSelect('reminder_time', e.target.value)}
                                className="block w-full rounded-md border-purple-200 text-sm focus:border-purple-500 focus:ring-purple-500 bg-white py-2"
                            >
                                {Array.from({ length: 13 }, (_, i) => i + 8).map(hour => (
                                    <option key={hour} value={`${hour < 10 ? '0' : ''}${hour}:00`}>{hour}:00</option>
                                ))}
                            </select>
                        </div>
                    </motion.div>
                )}
              </div>

              {/* Payment Reminders */}
              <div className="border-t pt-6 flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center mb-1">
                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Payment Reminders</h3>
                  </div>
                  <p className="text-gray-500 text-sm">Get notified 7 days before your subscription renews.</p>
                </div>
                <div className="flex items-center mt-1">
                   <button
                     onClick={() => handleToggle('email_payment_reminders')}
                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${preferences?.email_payment_reminders ? 'bg-blue-600' : 'bg-gray-200'}`}
                   >
                     <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences?.email_payment_reminders ? 'translate-x-6' : 'translate-x-1'}`} />
                   </button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotificationPreferencesPage;
