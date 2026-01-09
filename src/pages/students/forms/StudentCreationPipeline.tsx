/**
 * Student Creation Pipeline - Multi-step wizard for creating Students
 * Steps: 1. Account Details → 2. Personal Information → 3. Academic Details → 4. Contact Information → 5. Review & Submit
 *
 * This wizard streamlines the student creation process by combining user account creation
 * and student record creation into a single, guided workflow.
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Edit2,
  GraduationCap,
  Mail,
  User,
  UserCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CollegeDropdown } from '../../../components/common/CollegeDropdown';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useAuth } from '../../../hooks/useAuth';
import { useClasses, usePrograms, useSections } from '../../../hooks/useAcademic';
import { useUsers } from '../../../hooks/useAccounts';
import { useAcademicYears } from '../../../hooks/useCore';
import { userApi } from '../../../services/accounts.service';
import { studentApi } from '../../../services/students.service';
import { getCurrentUserCollege, isSuperAdmin } from '../../../utils/auth.utils';

interface StudentCreationPipelineProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

type StepType = 1 | 2 | 3 | 4 | 5;

type StudentCreationFormValues = {
  // Step 1: Account Details
  accountMode: 'create' | 'existing'; // New: choose between creating new user or linking existing
  existingUserId: string; // For linking existing user
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  college: number | null;

  // Step 2: Personal Information
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  nationality: string;
  religion: string;
  caste: string;
  mother_tongue: string;
  aadhar_number: string;
  pan_number: string;

  // Step 3: Academic Details
  admission_number: string;
  admission_date: string;
  admission_type: string;
  registration_number: string;
  roll_number: string;
  program: number | null;
  current_class: number | null;
  current_section: number | null;
  academic_year: number | null;

  // Step 4: Contact Information
  phone: string;
  alternate_phone: string;
  photo: string;
};

const ADMISSION_TYPES = [
  { value: 'regular', label: 'Regular' },
  { value: 'lateral', label: 'Lateral Entry' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'management', label: 'Management Quota' },
];

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export const StudentCreationPipeline = ({ onSubmit, onCancel }: StudentCreationPipelineProps) => {
  const [currentStep, setCurrentStep] = useState<StepType>(() => {
    const savedStep = localStorage.getItem('STUDENT_CREATION_STEP');
    return savedStep ? (parseInt(savedStep) as StepType) : 1;
  });
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors }, control, watch, setValue, trigger, reset } = useForm<StudentCreationFormValues>({
    defaultValues: {
      // Account Details
      accountMode: 'create',
      existingUserId: '',
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      college: getCurrentUserCollege(user as any) || null,

      // Personal Information
      first_name: '',
      middle_name: '',
      last_name: '',
      date_of_birth: '',
      gender: 'male',
      blood_group: '',
      nationality: 'Indian',
      religion: '',
      caste: '',
      mother_tongue: '',
      aadhar_number: '',
      pan_number: '',

      // Academic Details
      admission_number: '',
      admission_date: new Date().toISOString().split('T')[0],
      admission_type: 'regular',
      registration_number: '',
      roll_number: '',
      program: null,
      current_class: null,
      current_section: null,
      academic_year: null,

      // Contact Information
      phone: '',
      alternate_phone: '',
      photo: '',
    },
    mode: 'onChange',
  });

  // Fetch academic data
  const { data: programsData } = usePrograms({ page_size: 100, is_active: true });
  const { data: classesData } = useClasses({ page_size: 100, is_active: true });
  const { data: sectionsData } = useSections({ page_size: 100, is_active: true });
  const { data: yearsData } = useAcademicYears({ page_size: 100 });

  // Fetch existing student users for linking option
  const { data: studentUsersData, isLoading: isUsersLoading } = useUsers({
    user_type: 'student',
    page_size: 1000
  });

  const programs = programsData?.results || [];
  const classes = classesData?.results || [];
  const sections = sectionsData?.results || [];
  const years = yearsData?.results || [];
  const studentUsers = studentUsersData?.results || [];

  const accountMode = watch('accountMode');

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('STUDENT_CREATION_DRAFT');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed) {
          reset(parsed);
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [reset]);

  // Save draft on change
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem('STUDENT_CREATION_DRAFT', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Save current step on change
  useEffect(() => {
    localStorage.setItem('STUDENT_CREATION_STEP', currentStep.toString());
  }, [currentStep]);

  // Step validation
  const validateStep1 = async () => {
    const mode = watch('accountMode');

    if (mode === 'existing') {
      // For existing user, only validate user selection and college
      const isValid = await trigger(['existingUserId', 'college']);

      const existingUserId = watch('existingUserId');
      if (!existingUserId) {
        toast.error('Please select an existing user');
        return false;
      }

      return isValid;
    } else {
      // For new user, validate all account fields
      const isValid = await trigger([
        'username',
        'password',
        'confirmPassword',
        'email',
        'college',
      ]);

      // Check password match
      const password = watch('password');
      const confirmPassword = watch('confirmPassword');
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }

      // Check password strength
      if (password.length < 8) {
        toast.error('Password must be at least 8 characters');
        return false;
      }

      return isValid;
    }
  };

  const validateStep2 = async () => {
    const isValid = await trigger([
      'first_name',
      'last_name',
      'date_of_birth',
      'gender',
    ]);
    return isValid;
  };

  const validateStep3 = async () => {
    const isValid = await trigger([
      'admission_number',
      'admission_date',
      'registration_number',
      'program',
      'academic_year',
    ]);
    return isValid;
  };

  const validateStep4 = async () => {
    const isValid = await trigger(['phone']);
    return isValid;
  };

  // Navigation handlers
  const handleNext = async () => {
    let canProceed = false;

    if (currentStep === 1) {
      canProceed = await validateStep1();
    } else if (currentStep === 2) {
      canProceed = await validateStep2();
    } else if (currentStep === 3) {
      canProceed = await validateStep3();
    } else if (currentStep === 4) {
      canProceed = await validateStep4();
    }

    if (canProceed) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, 5) as StepType);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1) as StepType);
  };

  const goToStep = (step: StepType) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const handleFinalSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);

      let userId: string;

      if (data.accountMode === 'existing') {
        // Use existing user
        userId = data.existingUserId;
        toast.info('Linking to existing user account...');
      } else {
        // Step 1: Create User Account
        const userData = {
          username: data.username.toLowerCase().trim(),
          password: data.password,
          email: data.email,
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          user_type: 'student',
          college: data.college,
          phone: data.phone,
          gender: data.gender,
          date_of_birth: data.date_of_birth,
          is_active: true,
        };

        toast.info('Creating user account...');
        const createdUser = await userApi.create(userData);

        if (!createdUser || !createdUser.id) {
          throw new Error('Failed to create user account');
        }

        userId = createdUser.id;
        toast.success('User account created successfully');
      }

      // Step 2: Create Student Record
      const studentData = {
        user: userId,
        college: data.college,
        admission_number: data.admission_number,
        admission_date: data.admission_date,
        admission_type: data.admission_type,
        registration_number: data.registration_number,
        roll_number: data.roll_number,
        program: data.program,
        current_class: data.current_class,
        current_section: data.current_section,
        academic_year: data.academic_year,
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        blood_group: data.blood_group,
        email: data.email,
        phone: data.phone,
        alternate_phone: data.alternate_phone,
        photo: data.photo,
        nationality: data.nationality,
        religion: data.religion,
        caste: data.caste,
        mother_tongue: data.mother_tongue,
        aadhar_number: data.aadhar_number,
        pan_number: data.pan_number,
        is_active: true,
        is_alumni: false,
      };

      toast.info('Creating student record...');
      const createdStudent = await studentApi.create(studentData);

      toast.success(`Student created successfully! Admission #${data.admission_number}`);

      // Clear localStorage
      localStorage.removeItem('STUDENT_CREATION_DRAFT');
      localStorage.removeItem('STUDENT_CREATION_STEP');

      onSubmit(createdStudent);
    } catch (err: any) {
      console.error('Student creation error:', err);

      // Enhanced error handling
      if (err?.response?.data) {
        const errorData = err.response.data;

        // Handle field-specific errors
        if (errorData.username) {
          toast.error(`Username error: ${errorData.username[0]}`);
        } else if (errorData.email) {
          toast.error(`Email error: ${errorData.email[0]}`);
        } else if (errorData.admission_number) {
          toast.error(`Admission number error: ${errorData.admission_number[0]}`);
        } else if (errorData.non_field_errors) {
          toast.error(errorData.non_field_errors[0]);
        } else {
          toast.error(err?.message || 'Failed to create student');
        }
      } else {
        toast.error(err?.message || 'Failed to create student');
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  // Step indicators
  const steps = [
    { number: 1, title: 'Account', icon: User },
    { number: 2, title: 'Personal Info', icon: UserCircle },
    { number: 3, title: 'Academic', icon: GraduationCap },
    { number: 4, title: 'Contact', icon: Mail },
    { number: 5, title: 'Review', icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  currentStep > step.number
                    ? 'bg-primary border-primary text-primary-foreground'
                    : currentStep === step.number
                    ? 'border-primary text-primary'
                    : 'border-muted text-muted-foreground'
                }`}
              >
                {currentStep > step.number ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 transition-all ${
                  currentStep > step.number ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="relative overflow-y-auto max-h-[calc(100vh-400px)]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            {/* Step 1: Account Details */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>
                    {accountMode === 'create'
                      ? 'Create login credentials for the student'
                      : 'Link to an existing user account'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Account Mode Selection */}
                  <div>
                    <Label>Account Type</Label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="create"
                          {...register('accountMode')}
                          className="w-4 h-4"
                        />
                        <span>Create New User Account</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="existing"
                          {...register('accountMode')}
                          className="w-4 h-4"
                        />
                        <span>Link Existing User</span>
                      </label>
                    </div>
                  </div>

                  {/* Existing User Selection */}
                  {accountMode === 'existing' && (
                    <div>
                      <Label htmlFor="existingUserId" required>
                        Select Existing User
                      </Label>
                      <Select
                        value={watch('existingUserId')}
                        onValueChange={(value) => setValue('existingUserId', value, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {isUsersLoading ? (
                            <SelectItem value="" disabled>Loading users...</SelectItem>
                          ) : studentUsers.length === 0 ? (
                            <SelectItem value="" disabled>No student users available</SelectItem>
                          ) : (
                            studentUsers.map((user: any) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.full_name || user.username} ({user.email})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.existingUserId && (
                        <p className="text-xs text-destructive mt-1">{errors.existingUserId.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Select a user who doesn't have a student record yet
                      </p>
                    </div>
                  )}

                  {/* New User Creation Fields */}
                  {accountMode === 'create' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="username" required>
                            Username
                          </Label>
                          <Input
                            id="username"
                            {...register('username', {
                              required: accountMode === 'create' ? 'Username is required' : false,
                              minLength: { value: 3, message: 'Username must be at least 3 characters' },
                              pattern: {
                                value: /^[a-z0-9_]+$/,
                                message: 'Username must be lowercase letters, numbers, and underscores only'
                              }
                            })}
                            placeholder="student.username"
                            className="lowercase"
                          />
                          {errors.username && (
                            <p className="text-xs text-destructive mt-1">{errors.username.message}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Lowercase letters, numbers, and underscores only
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="password" required>
                            Password
                          </Label>
                          <Input
                            id="password"
                            type="password"
                            {...register('password', {
                              required: accountMode === 'create' ? 'Password is required' : false,
                              minLength: { value: 8, message: 'Password must be at least 8 characters' }
                            })}
                            placeholder="Enter password"
                          />
                          {errors.password && (
                            <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="confirmPassword" required>
                            Confirm Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            {...register('confirmPassword', {
                              required: accountMode === 'create' ? 'Please confirm password' : false
                            })}
                            placeholder="Re-enter password"
                          />
                          {errors.confirmPassword && (
                            <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email" required>
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email', {
                            required: accountMode === 'create' ? 'Email is required' : false,
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          placeholder="student@example.com"
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Important:</strong> The username and password will be used by the student to log into the system.
                        </AlertDescription>
                      </Alert>
                    </>
                  )}

                  <div>
                    <Controller
                      name="college"
                      control={control}
                      rules={{ required: 'College is required' }}
                      render={({ field }) => (
                        <CollegeDropdown
                          value={field.value}
                          onChange={field.onChange}
                          required
                          error={errors.college?.message}
                          disabled={!isSuperAdmin(user as any)}
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Enter the student's personal and identity details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="first_name" required>
                        First Name
                      </Label>
                      <Input
                        id="first_name"
                        {...register('first_name', { required: 'First name is required' })}
                        placeholder="John"
                      />
                      {errors.first_name && (
                        <p className="text-xs text-destructive mt-1">{errors.first_name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="middle_name">
                        Middle Name
                      </Label>
                      <Input
                        id="middle_name"
                        {...register('middle_name')}
                        placeholder="Michael"
                      />
                    </div>

                    <div>
                      <Label htmlFor="last_name" required>
                        Last Name
                      </Label>
                      <Input
                        id="last_name"
                        {...register('last_name', { required: 'Last name is required' })}
                        placeholder="Doe"
                      />
                      {errors.last_name && (
                        <p className="text-xs text-destructive mt-1">{errors.last_name.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date_of_birth" required>
                        Date of Birth
                      </Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        {...register('date_of_birth', { required: 'Date of birth is required' })}
                      />
                      {errors.date_of_birth && (
                        <p className="text-xs text-destructive mt-1">{errors.date_of_birth.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="gender" required>
                        Gender
                      </Label>
                      <Select
                        value={watch('gender')}
                        onValueChange={(value) => setValue('gender', value, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {GENDERS.map(gender => (
                            <SelectItem key={gender.value} value={gender.value}>
                              {gender.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="blood_group">
                        Blood Group
                      </Label>
                      <Select
                        value={watch('blood_group')}
                        onValueChange={(value) => setValue('blood_group', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          {BLOOD_GROUPS.map(bg => (
                            <SelectItem key={bg} value={bg}>
                              {bg}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="nationality">
                        Nationality
                      </Label>
                      <Input
                        id="nationality"
                        {...register('nationality')}
                        placeholder="Indian"
                      />
                    </div>

                    <div>
                      <Label htmlFor="religion">
                        Religion
                      </Label>
                      <Input
                        id="religion"
                        {...register('religion')}
                        placeholder="Religion"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="caste">
                        Caste
                      </Label>
                      <Input
                        id="caste"
                        {...register('caste')}
                        placeholder="Caste"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mother_tongue">
                        Mother Tongue
                      </Label>
                      <Input
                        id="mother_tongue"
                        {...register('mother_tongue')}
                        placeholder="Mother tongue"
                      />
                    </div>

                    <div>
                      <Label htmlFor="aadhar_number">
                        Aadhar Number
                      </Label>
                      <Input
                        id="aadhar_number"
                        {...register('aadhar_number')}
                        placeholder="1234 5678 9012"
                        maxLength={12}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pan_number">
                        PAN Number
                      </Label>
                      <Input
                        id="pan_number"
                        {...register('pan_number')}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        className="uppercase"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Academic Details */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Academic Details</CardTitle>
                  <CardDescription>
                    Enter admission and academic information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="admission_number" required>
                        Admission Number
                      </Label>
                      <Input
                        id="admission_number"
                        {...register('admission_number', { required: 'Admission number is required' })}
                        placeholder="ADM-2026-001"
                      />
                      {errors.admission_number && (
                        <p className="text-xs text-destructive mt-1">{errors.admission_number.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="admission_date" required>
                        Admission Date
                      </Label>
                      <Input
                        id="admission_date"
                        type="date"
                        {...register('admission_date', { required: 'Admission date is required' })}
                      />
                      {errors.admission_date && (
                        <p className="text-xs text-destructive mt-1">{errors.admission_date.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="registration_number" required>
                        Registration Number
                      </Label>
                      <Input
                        id="registration_number"
                        {...register('registration_number', { required: 'Registration number is required' })}
                        placeholder="REG-2026-001"
                      />
                      {errors.registration_number && (
                        <p className="text-xs text-destructive mt-1">{errors.registration_number.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="roll_number">
                        Roll Number
                      </Label>
                      <Input
                        id="roll_number"
                        {...register('roll_number')}
                        placeholder="ROLL-001"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="admission_type">
                      Admission Type
                    </Label>
                    <Select
                      value={watch('admission_type')}
                      onValueChange={(value) => setValue('admission_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select admission type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ADMISSION_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="program" required>
                      Program
                    </Label>
                    <Select
                      value={watch('program')?.toString()}
                      onValueChange={(value) => setValue('program', parseInt(value), { shouldValidate: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program: any) => (
                          <SelectItem key={program.id} value={program.id.toString()}>
                            {program.name} ({program.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.program && (
                      <p className="text-xs text-destructive mt-1">Program is required</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="current_class">
                        Class
                      </Label>
                      <Select
                        value={watch('current_class')?.toString() || ''}
                        onValueChange={(value) => setValue('current_class', value ? parseInt(value) : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls: any) => (
                            <SelectItem key={cls.id} value={cls.id.toString()}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="current_section">
                        Section
                      </Label>
                      <Select
                        value={watch('current_section')?.toString() || ''}
                        onValueChange={(value) => setValue('current_section', value ? parseInt(value) : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((section: any) => (
                            <SelectItem key={section.id} value={section.id.toString()}>
                              {section.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="academic_year" required>
                      Academic Year
                    </Label>
                    <Select
                      value={watch('academic_year')?.toString()}
                      onValueChange={(value) => setValue('academic_year', parseInt(value), { shouldValidate: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year: any) => (
                          <SelectItem key={year.id} value={year.id.toString()}>
                            {year.name} {year.is_current && '(Current)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.academic_year && (
                      <p className="text-xs text-destructive mt-1">Academic year is required</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Contact Information */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Enter contact details and photo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" required>
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Phone number must be 10 digits'
                          }
                        })}
                        placeholder="9876543210"
                        maxLength={10}
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="alternate_phone">
                        Alternate Phone
                      </Label>
                      <Input
                        id="alternate_phone"
                        type="tel"
                        {...register('alternate_phone')}
                        placeholder="9876543210"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="photo">
                      Photo URL
                    </Label>
                    <Input
                      id="photo"
                      {...register('photo')}
                      placeholder="https://example.com/photo.jpg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter a URL to the student's photo (optional)
                    </p>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Phone number will be used for communication and notifications.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Account Details</CardTitle>
                      <CardDescription>Review account information</CardDescription>
                    </div>
                    <Button type="button" size="sm" variant="ghost" onClick={() => goToStep(1)}>
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Username</Label>
                        <p className="font-semibold">{watch('username')}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-semibold">{watch('email')}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">College</Label>
                        <p className="font-semibold">College #{watch('college')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Review personal details</CardDescription>
                    </div>
                    <Button type="button" size="sm" variant="ghost" onClick={() => goToStep(2)}>
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Full Name</Label>
                        <p className="font-semibold">
                          {watch('first_name')} {watch('middle_name')} {watch('last_name')}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Date of Birth</Label>
                        <p className="font-semibold">
                          {watch('date_of_birth') ? new Date(watch('date_of_birth')).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Gender</Label>
                        <Badge className="capitalize">{watch('gender')}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Blood Group</Label>
                        <p className="font-semibold">{watch('blood_group') || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Nationality</Label>
                        <p className="font-semibold">{watch('nationality')}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Religion</Label>
                        <p className="font-semibold">{watch('religion') || '-'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Academic Details</CardTitle>
                      <CardDescription>Review academic information</CardDescription>
                    </div>
                    <Button type="button" size="sm" variant="ghost" onClick={() => goToStep(3)}>
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Admission Number</Label>
                        <p className="font-semibold">{watch('admission_number')}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Registration Number</Label>
                        <p className="font-semibold">{watch('registration_number')}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Admission Date</Label>
                        <p className="font-semibold">
                          {watch('admission_date') ? new Date(watch('admission_date')).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Admission Type</Label>
                        <Badge className="capitalize">{watch('admission_type')}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>Review contact details</CardDescription>
                    </div>
                    <Button type="button" size="sm" variant="ghost" onClick={() => goToStep(4)}>
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Phone</Label>
                        <p className="font-semibold">{watch('phone')}</p>
                      </div>
                      {watch('alternate_phone') && (
                        <div>
                          <Label className="text-muted-foreground">Alternate Phone</Label>
                          <p className="font-semibold">{watch('alternate_phone')}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please review all information carefully before submitting. This will create both a user account and a student record.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>

          {currentStep < 5 ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button type="button" onClick={handleFinalSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Creating Student...' : 'Create Student'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
