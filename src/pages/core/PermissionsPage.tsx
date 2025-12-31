/**
 * Permissions Management Page
 * Manage role-based permissions
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Shield,
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  Package,
  MessageSquare,
  Settings,
  FileText,
  Save,
  RefreshCw,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

const PermissionsPage = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Role options
  const roles = [
    { value: 'super_admin', label: 'Super Admin', color: 'text-red-600' },
    { value: 'college_admin', label: 'College Admin', color: 'text-blue-600' },
    { value: 'teacher', label: 'Teacher', color: 'text-green-600' },
    { value: 'student', label: 'Student', color: 'text-purple-600' },
    { value: 'parent', label: 'Parent', color: 'text-orange-600' },
  ];

  // Permission modules with icons and permissions
  const permissionModules = [
    {
      module: 'Students',
      icon: GraduationCap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      permissions: [
        { key: 'students.view', label: 'View Students', description: 'Can view student list and details' },
        { key: 'students.create', label: 'Create Students', description: 'Can add new students' },
        { key: 'students.edit', label: 'Edit Students', description: 'Can modify student information' },
        { key: 'students.delete', label: 'Delete Students', description: 'Can remove students' },
        { key: 'students.promote', label: 'Promote Students', description: 'Can promote students to next class' },
      ],
    },
    {
      module: 'Academics',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      permissions: [
        { key: 'academics.view', label: 'View Academic Data', description: 'Can view classes, subjects, timetables' },
        { key: 'academics.manage_classes', label: 'Manage Classes', description: 'Can create and edit classes' },
        { key: 'academics.manage_subjects', label: 'Manage Subjects', description: 'Can create and assign subjects' },
        { key: 'academics.manage_timetable', label: 'Manage Timetable', description: 'Can create and modify timetables' },
      ],
    },
    {
      module: 'Attendance',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      permissions: [
        { key: 'attendance.view', label: 'View Attendance', description: 'Can view attendance records' },
        { key: 'attendance.mark', label: 'Mark Attendance', description: 'Can mark student attendance' },
        { key: 'attendance.edit', label: 'Edit Attendance', description: 'Can modify attendance records' },
        { key: 'attendance.reports', label: 'View Reports', description: 'Can generate attendance reports' },
      ],
    },
    {
      module: 'Examinations',
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      permissions: [
        { key: 'exams.view', label: 'View Exams', description: 'Can view exam schedules and results' },
        { key: 'exams.create', label: 'Create Exams', description: 'Can create exam schedules' },
        { key: 'exams.enter_marks', label: 'Enter Marks', description: 'Can enter student marks' },
        { key: 'exams.publish_results', label: 'Publish Results', description: 'Can publish exam results' },
      ],
    },
    {
      module: 'Fees',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      permissions: [
        { key: 'fees.view', label: 'View Fee Records', description: 'Can view fee structures and payments' },
        { key: 'fees.collect', label: 'Collect Fees', description: 'Can collect fee payments' },
        { key: 'fees.manage_structure', label: 'Manage Fee Structure', description: 'Can modify fee structures' },
        { key: 'fees.discounts', label: 'Manage Discounts', description: 'Can apply fee discounts' },
        { key: 'fees.refunds', label: 'Process Refunds', description: 'Can process fee refunds' },
      ],
    },
    {
      module: 'Store',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      permissions: [
        { key: 'store.view', label: 'View Store', description: 'Can view store items and sales' },
        { key: 'store.manage_items', label: 'Manage Items', description: 'Can add/edit store items' },
        { key: 'store.process_sales', label: 'Process Sales', description: 'Can process store sales' },
        { key: 'store.manage_credits', label: 'Manage Credits', description: 'Can manage student credits' },
      ],
    },
    {
      module: 'Accounts',
      icon: Users,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      permissions: [
        { key: 'accounts.view', label: 'View Users', description: 'Can view user accounts' },
        { key: 'accounts.create', label: 'Create Users', description: 'Can create new user accounts' },
        { key: 'accounts.edit', label: 'Edit Users', description: 'Can modify user accounts' },
        { key: 'accounts.delete', label: 'Delete Users', description: 'Can remove user accounts' },
        { key: 'accounts.manage_roles', label: 'Manage Roles', description: 'Can assign roles to users' },
      ],
    },
    {
      module: 'Communication',
      icon: MessageSquare,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      permissions: [
        { key: 'communication.send', label: 'Send Messages', description: 'Can send messages and notifications' },
        { key: 'communication.broadcast', label: 'Broadcast', description: 'Can send broadcast messages' },
        { key: 'communication.view', label: 'View Messages', description: 'Can view communication history' },
      ],
    },
    {
      module: 'Settings',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      permissions: [
        { key: 'settings.view', label: 'View Settings', description: 'Can view system settings' },
        { key: 'settings.edit', label: 'Edit Settings', description: 'Can modify system settings' },
        { key: 'settings.manage_college', label: 'Manage College', description: 'Can manage college settings' },
      ],
    },
  ];

  const handlePermissionToggle = (permissionKey: string) => {
    setPermissions(prev => ({
      ...prev,
      [permissionKey]: !prev[permissionKey],
    }));
    setHasChanges(true);
  };

  const handleSelectAll = (modulePermissions: any[]) => {
    const newPermissions = { ...permissions };
    const allEnabled = modulePermissions.every(p => permissions[p.key]);

    modulePermissions.forEach(p => {
      newPermissions[p.key] = !allEnabled;
    });

    setPermissions(newPermissions);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!selectedRole) {
      toast.error('Please select a role first');
      return;
    }

    try {
      // Prepare permissions JSON
      const permissionsJson = JSON.stringify(permissions);
      const collegeId = localStorage.getItem('kumss_college_id');

      const data = {
        college: collegeId ? parseInt(collegeId) : 0,
        role: selectedRole,
        permissions_json: permissionsJson,
        is_active: true,
      };

      // Here you would call the API
      // await permissionsApi.create(data);

      console.log('Saving permissions:', data);
      toast.success(`Permissions saved for ${roles.find(r => r.value === selectedRole)?.label}`);
      setHasChanges(false);
    } catch (error: any) {
      console.error('Error saving permissions:', error);
      toast.error(error?.message || 'Failed to save permissions');
    }
  };

  const handleReset = () => {
    setPermissions({});
    setHasChanges(false);
    toast.info('Permissions reset');
  };

  const getEnabledCount = (modulePermissions: any[]) => {
    return modulePermissions.filter(p => permissions[p.key]).length;
  };

  return (
    <div className="min-h-screen p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            Role Permissions
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage access control and permissions for different user roles
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
          <Button onClick={handleSave} disabled={!selectedRole || !hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Permissions
          </Button>
        </div>
      </div>

      {/* Role Selector Card */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Select Role
          </CardTitle>
          <CardDescription>
            Choose a role to view and configure its permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select a role to manage permissions" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center gap-2">
                        <Shield className={`h-4 w-4 ${role.color}`} />
                        <span className="font-medium">{role.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedRole && (
              <Badge variant="default" className="h-12 px-6 text-base">
                {roles.find(r => r.value === selectedRole)?.label}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Grid */}
      {selectedRole ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {permissionModules.map((module) => {
            const Icon = module.icon;
            const enabledCount = getEnabledCount(module.permissions);
            const totalCount = module.permissions.length;
            const allEnabled = enabledCount === totalCount;

            return (
              <Card key={module.module} className="overflow-hidden hover:shadow-lg transition-all">
                <CardHeader className={`${module.bgColor} border-b`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <Icon className={`h-5 w-5 ${module.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.module}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {enabledCount} of {totalCount} enabled
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={allEnabled ? "default" : "outline"}
                      onClick={() => handleSelectAll(module.permissions)}
                    >
                      {allEnabled ? <Unlock className="h-4 w-4 mr-1" /> : <Lock className="h-4 w-4 mr-1" />}
                      {allEnabled ? 'Enabled' : 'Enable All'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {module.permissions.map((permission) => (
                      <div
                        key={permission.key}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <Switch
                          id={permission.key}
                          checked={permissions[permission.key] || false}
                          onCheckedChange={() => handlePermissionToggle(permission.key)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={permission.key}
                            className="cursor-pointer font-medium text-sm"
                          >
                            {permission.label}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {permission.description}
                          </p>
                        </div>
                        {permissions[permission.key] && (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold mb-2">No Role Selected</h3>
            <p className="text-muted-foreground">
              Please select a role above to view and manage its permissions
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary Card */}
      {selectedRole && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Permissions Enabled</h3>
                <p className="text-3xl font-bold text-primary mt-1">
                  {Object.values(permissions).filter(Boolean).length}
                </p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-medium text-muted-foreground">For Role</h3>
                <p className="text-lg font-semibold mt-1">
                  {roles.find(r => r.value === selectedRole)?.label}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PermissionsPage;
