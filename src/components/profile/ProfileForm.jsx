
import React, { useState, useEffect } from 'react';
import { Save, Loader2, MapPin, User, Phone } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';

const ProfileForm = ({ initialData, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
    bio: ''
  });
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  // Load initial data and check local storage
  useEffect(() => {
    const savedDraft = localStorage.getItem('profile_draft');
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
      setHasChanges(true);
      toast({
        title: "Draft Restored",
        description: "We found unsaved changes from your last session.",
      });
    } else if (initialData) {
      setFormData({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        phone: initialData.phone || '',
        location: initialData.location || '',
        bio: initialData.bio || ''
      });
    }
  }, [initialData, toast]);

  // Handle changes and auto-save to local storage
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Bio character limit
    if (name === 'bio' && value.length > 500) return;

    const newData = { ...formData, [name]: value };
    setFormData(newData);
    setHasChanges(true);
    localStorage.setItem('profile_draft', JSON.stringify(newData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSave) {
      await onSave(formData);
      localStorage.removeItem('profile_draft');
      setHasChanges(false);
    }
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        phone: initialData.phone || '',
        location: initialData.location || '',
        bio: initialData.bio || ''
      });
      localStorage.removeItem('profile_draft');
      setHasChanges(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details and public profile.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="Jane"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+49 123 456789"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  name="location"
                  placeholder="Frankfurt, Germany"
                  value={formData.location}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">
              Bio 
              <span className={`ml-2 text-xs ${formData.bio.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
                ({formData.bio.length}/500)
              </span>
            </Label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tell us a little about yourself..."
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={handleCancel}
            disabled={!hasChanges || isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-teal-600 hover:bg-teal-700"
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileForm;
