import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Award,
  TrendingUp,
  Settings,
  Edit,
  Download,
  FileText,
  Users,
  Building,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AcademicInfo {
  enrollmentNumber: string;
  program: string;
  branch: string;
  semester: number;
  batch: string;
  section: string;
  admissionDate: string;
  rollNumber: string;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface GuardianInfo {
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
  guardianEmail: string;
}

interface AcademicPerformance {
  cgpa: number;
  sgpa: number;
  totalCredits: number;
  earnedCredits: number;
  attendance: number;
  rank?: number;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - in real app, fetch from API
  const [personalInfo] = useState<PersonalInfo>({
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@student.college.edu',
    phone: '+91 98765 43210',
    alternatePhone: '+91 98765 43211',
    dateOfBirth: '2003-05-15',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '123, Green Park Society, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
  });

  const [academicInfo] = useState<AcademicInfo>({
    enrollmentNumber: 'BTech/CSE/2021/001',
    program: 'Bachelor of Technology',
    branch: 'Computer Science Engineering',
    semester: 5,
    batch: '2021-2025',
    section: 'A',
    admissionDate: '2021-08-01',
    rollNumber: '21CSE001',
  });

  const [guardianInfo] = useState<GuardianInfo>({
    fatherName: 'Rajesh Kumar Sharma',
    fatherOccupation: 'Business',
    fatherPhone: '+91 98765 12345',
    motherName: 'Sunita Sharma',
    motherOccupation: 'Teacher',
    motherPhone: '+91 98765 12346',
    guardianEmail: 'rajesh.sharma@email.com',
  });

  const [performance] = useState<AcademicPerformance>({
    cgpa: 8.5,
    sgpa: 8.7,
    totalCredits: 120,
    earnedCredits: 80,
    attendance: 87,
    rank: 12,
  });

  const getInitials = () => {
    return `${personalInfo.firstName[0]}${personalInfo.lastName[0]}`.toUpperCase();
  };

  const stats = [
    { label: 'CGPA', value: performance.cgpa.toFixed(2), icon: TrendingUp, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Attendance', value: `${performance.attendance}%`, icon: Calendar, color: 'text-green-600 dark:text-green-400' },
    { label: 'Credits', value: `${performance.earnedCredits}/${performance.totalCredits}`, icon: BookOpen, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Rank', value: performance.rank ? `#${performance.rank}` : 'N/A', icon: Award, color: 'text-orange-600 dark:text-orange-400' },
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
                <h2 className="text-2xl font-bold">{personalInfo.firstName} {personalInfo.lastName}</h2>
                <p className="text-muted-foreground">{academicInfo.enrollmentNumber}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge variant="default" className="gap-1">
                  <GraduationCap className="h-3 w-3" />
                  {academicInfo.branch}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <BookOpen className="h-3 w-3" />
                  Semester {academicInfo.semester}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />
                  Section {academicInfo.section}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>Batch {academicInfo.batch}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
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
                <p className="text-muted-foreground">Enrollment No.</p>
                <p className="font-medium">{academicInfo.enrollmentNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Roll Number</p>
                <p className="font-medium">{academicInfo.rollNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Program</p>
                <p className="font-medium">{academicInfo.program}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Branch</p>
                <p className="font-medium">{academicInfo.branch}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Semester</p>
                <p className="font-medium">Semester {academicInfo.semester}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Section</p>
                <p className="font-medium">Section {academicInfo.section}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Batch</p>
                <p className="font-medium">{academicInfo.batch}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Admission Date</p>
                <p className="font-medium">{new Date(academicInfo.admissionDate).toLocaleDateString()}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium">Academic Performance</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">CGPA</p>
                  <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{performance.cgpa.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current SGPA</p>
                  <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{performance.sgpa.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Credits Earned</p>
                  <p className="font-medium">{performance.earnedCredits} / {performance.totalCredits}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Class Rank</p>
                  <p className="font-medium">{performance.rank ? `#${performance.rank}` : 'N/A'}</p>
                </div>
              </div>
            </div>
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
                <p className="font-medium">{personalInfo.firstName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Name</p>
                <p className="font-medium">{personalInfo.lastName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{new Date(personalInfo.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gender</p>
                <p className="font-medium">{personalInfo.gender}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Blood Group</p>
                <p className="font-medium">{personalInfo.bloodGroup}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium truncate">{personalInfo.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{personalInfo.phone}</p>
              </div>
              {personalInfo.alternatePhone && (
                <div>
                  <p className="text-muted-foreground">Alternate Phone</p>
                  <p className="font-medium">{personalInfo.alternatePhone}</p>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </h4>
              <div className="text-sm space-y-1">
                <p>{personalInfo.address}</p>
                <p>{personalInfo.city}, {personalInfo.state} - {personalInfo.pincode}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guardian Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Guardian Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Father's Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{guardianInfo.fatherName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Occupation</p>
                    <p className="font-medium">{guardianInfo.fatherOccupation}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{guardianInfo.fatherPhone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Mother's Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{guardianInfo.motherName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Occupation</p>
                    <p className="font-medium">{guardianInfo.motherOccupation}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{guardianInfo.motherPhone}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="text-sm">
                  <p className="text-muted-foreground">Guardian Email</p>
                  <p className="font-medium">{guardianInfo.guardianEmail}</p>
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
