
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utils/profileUtils";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, User, MapPin } from '@/lib/icons';

const ProfileHeader = ({ profile, subscription, onEdit }) => {
  const fullName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User';
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-teal-500 to-blue-600 opacity-10"></div>
      
      <div className="relative z-10">
        <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
          <AvatarImage src={profile?.avatar_url} alt={fullName} />
          <AvatarFallback className="text-2xl bg-teal-100 text-teal-800 font-bold">
            {getInitials(fullName)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 text-center md:text-left pt-2 md:pt-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
            <p className="text-gray-500 mb-2">{profile?.email || 'No email set'}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
              <Badge variant={subscription?.tier === 'pro' ? 'default' : 'secondary'} className="uppercase">
                {subscription?.tier || 'Free Member'}
              </Badge>
              {profile?.location && (
                <span className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-3 h-3 mr-1" /> {profile.location}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={onEdit} variant="outline" className="gap-2">
              <User className="w-4 h-4" /> Edit Profile
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        </div>
        
        {profile?.bio && (
          <p className="mt-4 text-gray-600 max-w-2xl text-sm leading-relaxed">
            {profile.bio}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
