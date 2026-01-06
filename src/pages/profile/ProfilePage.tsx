import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { cn } from '@/lib/utils';
import {
  Award,
  BookOpen,
  Calendar,
  Download,
  Edit,
  FileText,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Settings,
  TrendingUp,
  User,
  Users
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profileData, isLoading, error } = useUserProfile();

  const getInitials = () => {
    if (!profileData?.user_name) return 'U';
    const names = profileData.user_name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return profileData.user_name.substring(0, 2).toUpperCase();
  };

  // Safe split for name
  const getUserNameParts = () => {
    if (!profileData?.user_name) return { first: '', last: '' };
    const parts = profileData.user_name.split(' ');
    return {
      first: parts[0],
      last: parts.slice(1).join(' ')
    };
  };

  const nameParts = getUserNameParts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-500 mb-4">Failed to load profile data</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Placeholder stats for now as they are not in the profile API
  const stats = [
    { label: 'CGPA', value: 'N/A', icon: TrendingUp, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Attendance', value: 'N/A', icon: Calendar, color: 'text-green-600 dark:text-green-400' },
    { label: 'Credits', value: 'N/A', icon: BookOpen, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Rank', value: 'N/A', icon: Award, color: 'text-orange-600 dark:text-orange-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">View and manage your profile information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Profile
          </Button>
          <Button onClick={() => navigate('/profile/settings')} className="gap-2">
            <Settings className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 text-3xl">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold">{profileData.user_name}</h2>
                <p className="text-muted-foreground">{profileData.college_name}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge variant="default" className="gap-1">
                  <GraduationCap className="h-3 w-3" />
                  {profileData.department_name || 'Department N/A'}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <BookOpen className="h-3 w-3" />
                  Semester N/A
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />
                  Section N/A
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{user?.email || 'No Email'}</span>
                </div>
                {profileData.emergency_contact_phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{profileData.emergency_contact_phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="h-4 w-4 flex-shrink-0" />
                  <span>{profileData.city || 'City N/A'}, {profileData.state}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats - Keeping placeholders for layout consistency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className={cn('text-2xl font-bold mt-1', stat.color)}>{stat.value}</p>
                </div>
                <stat.icon className={cn('h-8 w-8', stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">College</p>
                <p className="font-medium">{profileData.college_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-medium">{profileData.department_name}</p>
              </div>
              {/* Fields not present in API are commented out or shown as N/A */}
              <div>
                <p className="text-muted-foreground">Enrollment No.</p>
                <p className="font-medium">N/A</p>
              </div>
              <div>
                <p className="text-muted-foreground">Roll Number</p>
                <p className="font-medium">N/A</p>
              </div>
            </div>

            <Separator />

            <div className="mt-4">
              <h4 className="font-medium mb-2">Bio</h4>
              <p className="text-sm text-muted-foreground">{profileData.bio || 'No bio available.'}</p>
            </div>

            {profileData.linkedin_url || profileData.website_url ? (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Links</h4>
                <div className="flex gap-4 text-sm">
                  {profileData.linkedin_url && (
                    <a href={profileData.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
                  )}
                  {profileData.website_url && (
                    <a href={profileData.website_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Website</a>
                  )}
                </div>
              </div>
            ) : null}

          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">First Name</p>
                <p className="font-medium">{nameParts.first}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Name</p>
                <p className="font-medium">{nameParts.last}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Nationality</p>
                <p className="font-medium">{profileData.nationality || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Religion</p>
                <p className="font-medium">{profileData.religion || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Caste</p>
                <p className="font-medium">{profileData.caste || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Blood Group</p>
                <p className="font-medium">{profileData.blood_group || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Additional Info</p>
                <p className="font-medium break-all">{profileData.profile_data || 'N/A'}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </h4>
              <div className="text-sm space-y-1">
                <p>{profileData.address_line1}</p>
                {profileData.address_line2 && <p>{profileData.address_line2}</p>}
                <p>{profileData.city}, {profileData.state} - {profileData.pincode}</p>
                <p>{profileData.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact / Guardian Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Contact Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{profileData.emergency_contact_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Relationship</p>
                    <p className="font-medium">{profileData.emergency_contact_relation || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{profileData.emergency_contact_phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your profile and documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="outline" className="gap-2 justify-start">
              <FileText className="h-4 w-4" />
              Download ID Card
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <Download className="h-4 w-4" />
              Download Marksheet
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <Award className="h-4 w-4" />
              View Certificates
            </Button>
            <Button variant="outline" className="gap-2 justify-start" onClick={() => navigate('/profile/settings')}>
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
