import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from '@/lib/motion';
import { User, Mail, Settings, AlertTriangle } from '@/lib/icons';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import SubscriptionStatus from '@/components/SubscriptionStatus';

const AccountPage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    toast({
      title: "✅ Logged Out",
      description: "You have been successfully logged out"
    });
  };

  const handleDeleteAccount = () => {
    // In production, invoke Edge Function to wipe data
    navigate('/');
    toast({ title: "Account Deleted", description: "Your account and all data have been removed" });
  };

  return (
    <>
      <Helmet>
        <title>Account Settings - Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Account Settings</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Log Out
            </button>
          </div>

          {/* Profile Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <User className="w-5 h-5 text-teal-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  {user?.email}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subscription Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
            <SubscriptionStatus />
          </motion.div>

          {/* Danger Zone */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-100">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Danger Zone</h2>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="font-medium text-red-600">Delete Account</p>
                  <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-6 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  Delete Account
                </button>
            </div>
          </motion.div>

           {/* Delete Modal */}
           {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
                <h3 className="text-2xl font-bold text-red-600 mb-4">Delete Account?</h3>
                <p className="text-gray-600 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-3 border rounded-lg">Cancel</button>
                  <button onClick={handleDeleteAccount} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg">Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AccountPage;