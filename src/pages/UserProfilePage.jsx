
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, formatDate, getDeviceInfo } from "@/utils/profileUtils";
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import AvatarUploader from '@/components/profile/AvatarUploader';
import PasswordResetForm from '@/components/profile/PasswordResetForm';
import SubscriptionCard from '@/components/profile/SubscriptionCard';
import QuickStats from '@/components/profile/QuickStats';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Shield, Clock, Smartphone, Bell, Mail } from '@/lib/icons';
import { useDashboard } from '@/hooks/useDashboard';

const UserProfilePage = () => {
  const { user } = useAuth();
  const { profile, loading, subscription, activityLogs, updateProfile, uploadAvatar, updatePassword } = useProfile();
  const { userStats } = useDashboard(user?.id);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    marketingEmails: false,
    twoFactor: false
  });

  const handleUpdateProfile = async (data) => {
    const success = await updateProfile(data);
    if (success) setIsEditModalOpen(false);
  };

  const deviceInfo = getDeviceInfo();

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile - Frankfurt Expat Services</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <ProfileHeader 
            profile={profile} 
            subscription={subscription}
            onEdit={() => setIsEditModalOpen(true)}
          />

          <QuickStats stats={userStats} />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-gray-500" /> Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500 uppercase block mb-1">Email Address</span>
                        <span className="font-medium text-gray-900">{profile?.email || user?.email}</span>
                     </div>
                     <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500 uppercase block mb-1">Phone Number</span>
                        <span className="font-medium text-gray-900">{profile?.phone || 'Not provided'}</span>
                     </div>
                     <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500 uppercase block mb-1">Language</span>
                        <span className="font-medium text-gray-900 uppercase">{profile?.language || 'EN'}</span>
                     </div>
                     <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500 uppercase block mb-1">Timezone</span>
                        <span className="font-medium text-gray-900">{profile?.timezone || 'UTC'}</span>
                     </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gray-500" /> Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">Password</p>
                        <p className="text-xs text-gray-500">Last changed recently</p>
                      </div>
                      <button 
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline"
                      >
                        Change Password
                      </button>
                   </div>
                   
                   <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">Active Session</p>
                        <p className="text-xs text-gray-500">
                          {deviceInfo.browser} on {deviceInfo.os} • {profile?.location || 'Unknown Location'}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Current
                      </span>
                   </div>

                   <div className="flex items-center justify-between">
                      <div>
                         <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                         <p className="text-xs text-gray-500">Add an extra layer of security</p>
                      </div>
                      <Switch 
                        checked={preferences.twoFactor} 
                        onCheckedChange={(checked) => setPreferences(p => ({...p, twoFactor: checked}))}
                      />
                   </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-gray-500" /> Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                           <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                           <p className="text-xs text-gray-500">Receive updates about your activity</p>
                        </div>
                     </div>
                     <Switch 
                        checked={preferences.emailNotifications} 
                        onCheckedChange={(checked) => setPreferences(p => ({...p, emailNotifications: checked}))}
                      />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Bell className="w-4 h-4 text-gray-400" />
                        <div>
                           <p className="text-sm font-medium text-gray-900">Marketing Communications</p>
                           <p className="text-xs text-gray-500">Receive tips and special offers</p>
                        </div>
                     </div>
                     <Switch 
                        checked={preferences.marketingEmails} 
                        onCheckedChange={(checked) => setPreferences(p => ({...p, marketingEmails: checked}))}
                      />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <SubscriptionCard subscription={subscription} stats={{storage_percent: 45}} />
              
              <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-lg">
                     <Clock className="w-5 h-5 text-gray-500" /> Recent Activity
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-6">
                      {activityLogs && activityLogs.length > 0 ? (
                        activityLogs.map((log) => (
                          <div key={log.id} className="flex gap-4 relative">
                             <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-100 -z-10 h-full last:hidden"></div>
                             <div className="w-4 h-4 rounded-full bg-teal-100 border-2 border-white ring-1 ring-teal-500 mt-1 shrink-0"></div>
                             <div>
                                <p className="text-sm font-medium text-gray-900 capitalize">
                                  {log.action.replace('_', ' ')}: {log.feature_name}
                                </p>
                                <p className="text-xs text-gray-500">{formatDate(log.created_at)}</p>
                             </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No recent activity recorded.</p>
                      )}
                    </div>
                 </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>{getInitials(`${profile?.first_name} ${profile?.last_name}`)}</AvatarFallback>
                </Avatar>
                <div>
                   <button 
                     onClick={() => { setIsEditModalOpen(false); setIsAvatarModalOpen(true); }}
                     className="text-sm text-teal-600 font-medium hover:underline"
                   >
                     Change Avatar
                   </button>
                   <p className="text-xs text-gray-500">JPG, PNG or WebP. Max 5MB.</p>
                </div>
             </div>
             <ProfileEditForm 
               profile={profile} 
               onSave={handleUpdateProfile} 
               onCancel={() => setIsEditModalOpen(false)} 
             />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Avatar</DialogTitle>
          </DialogHeader>
          <AvatarUploader 
            currentAvatar={profile?.avatar_url}
            onUpload={uploadAvatar}
            onClose={() => setIsAvatarModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
             <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <PasswordResetForm 
            onUpdatePassword={async (currentPass, newPass) => {
               const success = await updatePassword(newPass);
               if (success) setIsPasswordModalOpen(false);
            }} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfilePage;
