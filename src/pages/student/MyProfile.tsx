import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const MyProfile: React.FC = () => {
  // Mock data - Replace with actual API calls
  const studentProfile = {
    name: 'John Doe',
    studentId: 'STU2024001',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    dateOfBirth: '2005-05-15',
    bloodGroup: 'O+',
    address: '123 Main Street, City, State 12345',
    class: 'Class 12-A',
    section: 'Science',
    rollNumber: '15',
    admissionDate: '2020-04-01',
    program: 'Higher Secondary - Science',
    academicYear: '2024-2025',
    profileImage: null,
  };

  const guardian = {
    name: 'Jane Doe',
    relationship: 'Mother',
    phone: '+1 234 567 8901',
    email: 'jane.doe@example.com',
    occupation: 'Teacher',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your profile information
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                {studentProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{studentProfile.name}</h2>
                <p className="text-muted-foreground">Student ID: {studentProfile.studentId}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{studentProfile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{studentProfile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">DOB: {new Date(studentProfile.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Blood Group: {studentProfile.bloodGroup}</span>
                </div>
              </div>

              <Button variant="outline">Edit Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Academic Information
            </CardTitle>
            <CardDescription>Your current academic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Class</span>
              <span className="font-medium">{studentProfile.class}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Section</span>
              <span className="font-medium">{studentProfile.section}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Roll Number</span>
              <span className="font-medium">{studentProfile.rollNumber}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Program</span>
              <span className="font-medium">{studentProfile.program}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Academic Year</span>
              <span className="font-medium">{studentProfile.academicYear}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground">Admission Date</span>
              <span className="font-medium">{new Date(studentProfile.admissionDate).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Guardian Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Guardian Information
            </CardTitle>
            <CardDescription>Primary guardian details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="font-medium">{guardian.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Relationship</span>
              <Badge>{guardian.relationship}</Badge>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="font-medium">{guardian.phone}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="font-medium text-sm">{guardian.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground">Occupation</span>
              <span className="font-medium">{guardian.occupation}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Information
          </CardTitle>
          <CardDescription>Current residential address</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{studentProfile.address}</p>
        </CardContent>
      </Card>
    </div>
  );
};
