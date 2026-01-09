/**
 * Class Teacher Creation Pipeline - Multi-step wizard for assigning Class Teachers
 * Steps: 1. Teacher Selection → 2. Class Selection → 3. Section Selection → 4. Assignment Details & Review
 *
 * This wizard streamlines the class teacher assignment process by allowing inline creation
 * of dependencies (teacher, class, section) if they don't exist yet.
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers,
  Mail,
  User,
  UserCircle,
  Users,
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
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Separator } from '../../../components/ui/separator';
import { Switch } from '../../../components/ui/switch';
import { useAuth } from '../../../hooks/useAuth';
import { useClasses, usePrograms, useSections } from '../../../hooks/useAcademic';
import { useAcademicSessions } from '../../../hooks/useCore';
import { userApi } from '../../../services/accounts.service';
import { classApi, classTeacherApi, sectionApi } from '../../../services/academic.service';
import type { UserCreateInput } from '../../../types/accounts.types';
import type { ClassCreateInput, SectionCreateInput } from '../../../types/academic.types';
import { getCurrentUserCollege, isSuperAdmin } from '../../../utils/auth.utils';

interface ClassTeacherCreationPipelineProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

type StepType = 1 | 2 | 3 | 4;

type ClassTeacherFormValues = {
  // Step 1: Teacher Selection/Creation
  teacherMode: 'existing' | 'create';
  existingTeacherId: string;
  // Teacher creation fields
  teacher_username: string;
  teacher_password: string;
  teacher_confirmPassword: string;
  teacher_email: string;
  teacher_first_name: string;
  teacher_middle_name: string;
  teacher_last_name: string;
  teacher_phone: string;
  teacher_gender: 'male' | 'female' | 'other';
  teacher_date_of_birth: string;

  // Step 2: Class Selection/Creation
  classMode: 'existing' | 'create';
  existingClassId: number | null;
  // Class creation fields
  class_program: number | null;
  class_name: string;
  class_semester: number;
  class_year: number;
  class_max_students: number;

  // Step 3: Section Selection/Creation
  sectionMode: 'existing' | 'create';
  existingSectionId: number | null;
  // Section creation fields
  section_name: string;
  section_max_students: number;

  // Step 4: Assignment Details
  academic_session: number | null;
  assigned_from: string;
  assigned_to: string;
  is_active: boolean;
  college: number | null;
};

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

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

export const ClassTeacherCreationPipeline = ({ onSubmit, onCancel }: ClassTeacherCreationPipelineProps) => {
  const [currentStep, setCurrentStep] = useState<StepType>(() => {
    const savedStep = localStorage.getItem('CLASS_TEACHER_CREATION_STEP');
    return savedStep ? (parseInt(savedStep) as StepType) : 1;
  });
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingTeachers, setExistingTeachers] = useState<any[]>([]);
  const [existingClasses, setExistingClasses] = useState<any[]>([]);
  const [existingSections, setExistingSections] = useState<any[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);

  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors }, control, watch, setValue, trigger, reset } = useForm<ClassTeacherFormValues>({
    defaultValues: {
      // Teacher
      teacherMode: 'existing',
      existingTeacherId: '',
      teacher_username: '',
      teacher_password: '',
      teacher_confirmPassword: '',
      teacher_email: '',
      teacher_first_name: '',
      teacher_middle_name: '',
      teacher_last_name: '',
      teacher_phone: '',
      teacher_gender: 'male',
      teacher_date_of_birth: '',

      // Class
      classMode: 'existing',
      existingClassId: null,
      class_program: null,
      class_name: '',
      class_semester: 1,
      class_year: 1,
      class_max_students: 60,

      // Section
      sectionMode: 'existing',
      existingSectionId: null,
      section_name: '',
      section_max_students: 60,

      // Assignment
      academic_session: null,
      assigned_from: new Date().toISOString().split('T')[0],
      assigned_to: '',
      is_active: true,
      college: getCurrentUserCollege(user as any) || null,
    },
    mode: 'onChange',
  });

  // Fetch academic data
  const { data: programsData } = usePrograms({ page_size: 100, is_active: true });
  const { data: sessionsData } = useAcademicSessions({ page_size: 100 });

  const programs = programsData?.results || [];
  const sessions = sessionsData?.results || [];

  const teacherMode = watch('teacherMode');
  const classMode = watch('classMode');
  const sectionMode = watch('sectionMode');
  const selectedClassId = watch('existingClassId');

  // Fetch teachers
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Fetch classes
  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch sections when class is selected
  useEffect(() => {
    if (classMode === 'existing' && selectedClassId) {
      fetchSections(selectedClassId);
    } else {
      setExistingSections([]);
      setValue('existingSectionId', null);
    }
  }, [classMode, selectedClassId]);

  const fetchTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const data = await userApi.list({
        user_type: 'teacher',
        page_size: 200,
        is_active: true
      });
      setExistingTeachers(data.results);
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
      setExistingTeachers([]);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const data = await classApi.list({ page_size: 100, is_active: true });
      setExistingClasses(data.results);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
      setExistingClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchSections = async (classId: number) => {
    try {
      setLoadingSections(true);
      const data = await sectionApi.list({
        class_obj: classId,
        page_size: 100,
        is_active: true
      });
      setExistingSections(data.results);
    } catch (err) {
      console.error('Failed to fetch sections:', err);
      setExistingSections([]);
    } finally {
      setLoadingSections(false);
    }
  };

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('CLASS_TEACHER_CREATION_DRAFT');
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
      localStorage.setItem('CLASS_TEACHER_CREATION_DRAFT', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Save current step on change
  useEffect(() => {
    localStorage.setItem('CLASS_TEACHER_CREATION_STEP', currentStep.toString());
  }, [currentStep]);

  // Step validation
  const validateStep1 = async () => {
    const mode = watch('teacherMode');

    if (mode === 'existing') {
      const existingTeacherId = watch('existingTeacherId');
      if (!existingTeacherId) {
        toast.error('Please select an existing teacher');
        return false;
      }
      return true;
    } else {
      // Validate teacher creation fields
      const isValid = await trigger([
        'teacher_username',
        'teacher_password',
        'teacher_confirmPassword',
        'teacher_email',
        'teacher_first_name',
        'teacher_last_name',
      ]);

      // Check password match
      const password = watch('teacher_password');
      const confirmPassword = watch('teacher_confirmPassword');
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }

      // Check username availability (basic check)
      const username = watch('teacher_username');
      if (!username || username.length < 3) {
        toast.error('Username must be at least 3 characters');
        return false;
      }

      return isValid;
    }
  };

  const validateStep2 = async () => {
    const mode = watch('classMode');

    if (mode === 'existing') {
      const existingClassId = watch('existingClassId');
      if (!existingClassId) {
        toast.error('Please select an existing class');
        return false;
      }
      return true;
    } else {
      // Validate class creation fields
      const isValid = await trigger([
        'class_program',
        'class_name',
        'class_semester',
        'class_year',
      ]);

      const program = watch('class_program');
      if (!program) {
        toast.error('Please select a program for the class');
        return false;
      }

      return isValid;
    }
  };

  const validateStep3 = async () => {
    const mode = watch('sectionMode');

    if (mode === 'existing') {
      const existingSectionId = watch('existingSectionId');
      if (!existingSectionId) {
        toast.error('Please select an existing section');
        return false;
      }
      return true;
    } else {
      // Validate section creation fields
      const isValid = await trigger(['section_name']);

      const sectionName = watch('section_name');
      if (!sectionName || sectionName.trim().length === 0) {
        toast.error('Please enter a section name');
        return false;
      }

      return isValid;
    }
  };

  const validateStep4 = async () => {
    const isValid = await trigger(['academic_session', 'assigned_from']);

    const academicSession = watch('academic_session');
    if (!academicSession) {
      toast.error('Please select an academic session');
      return false;
    }

    return isValid;
  };

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
      setCurrentStep((prev) => Math.min(prev + 1, 4) as StepType);
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

      let teacherId: string;
      let classId: number;
      let sectionId: number;
      const collegeId = data.college ?? getCurrentUserCollege(user as any);

      if (!collegeId) {
        throw new Error('College is required');
      }

      // Step 1: Handle Teacher (create or use existing)
      if (data.teacherMode === 'existing') {
        teacherId = data.existingTeacherId;
        toast.info('Using existing teacher...');
      } else {
        toast.info('Creating teacher account...');
        const userData: UserCreateInput = {
          username: data.teacher_username.toLowerCase().trim(),
          password: data.teacher_password,
          password_confirm: data.teacher_password,
          email: data.teacher_email,
          first_name: data.teacher_first_name,
          middle_name: data.teacher_middle_name || null,
          last_name: data.teacher_last_name,
          user_type: 'teacher',
          college: Number(collegeId),
          phone: data.teacher_phone,
          gender: data.teacher_gender,
          date_of_birth: data.teacher_date_of_birth || null,
          is_active: true,
        };

        const createdUser = await userApi.create(userData);
        if (!createdUser || !createdUser.id) {
          throw new Error('Failed to create teacher account');
        }
        teacherId = createdUser.id;
        toast.success('Teacher account created successfully');
      }

      // Step 2: Handle Class (create or use existing)
      if (data.classMode === 'existing') {
        classId = data.existingClassId!;
        toast.info('Using existing class...');
      } else {
        toast.info('Creating new class...');

        // Get the current academic session for class creation
        const currentSession = sessions.find(s => s.is_active);
        if (!currentSession) {
          throw new Error('No active academic session found. Please create an academic session first.');
        }

        const classData: ClassCreateInput = {
          college: Number(collegeId),
          program: Number(data.class_program),
          academic_session: currentSession.id,
          name: data.class_name,
          semester: Number(data.class_semester),
          year: Number(data.class_year),
          max_students: Number(data.class_max_students),
          is_active: true,
        };

        const createdClass = await classApi.create(classData);
        if (!createdClass || !createdClass.id) {
          throw new Error('Failed to create class');
        }
        classId = createdClass.id;
        toast.success('Class created successfully');
      }

      // Step 3: Handle Section (create or use existing)
      if (data.sectionMode === 'existing') {
        sectionId = data.existingSectionId!;
        toast.info('Using existing section...');
      } else {
        toast.info('Creating new section...');
        const sectionData: SectionCreateInput = {
          class_obj: classId,
          name: data.section_name,
          max_students: Number(data.section_max_students),
          is_active: true,
          college: Number(collegeId),
        };

        const createdSection = await sectionApi.create(sectionData);
        if (!createdSection || !createdSection.id) {
          throw new Error('Failed to create section');
        }
        sectionId = createdSection.id;
        toast.success('Section created successfully');
      }

      // Step 4: Create Class Teacher Assignment
      toast.info('Assigning class teacher...');
      const classTeacherData = {
        class_obj: classId,
        section: sectionId,
        teacher: teacherId,
        academic_session: Number(data.academic_session),
        assigned_from: data.assigned_from,
        assigned_to: data.assigned_to || null,
        is_active: data.is_active,
        college: Number(collegeId),
      };

      await classTeacherApi.create(classTeacherData);
      toast.success('Class teacher assigned successfully!');

      // Clear draft
      localStorage.removeItem('CLASS_TEACHER_CREATION_DRAFT');
      localStorage.removeItem('CLASS_TEACHER_CREATION_STEP');

      // Call parent onSubmit
      onSubmit(classTeacherData);
    } catch (err: any) {
      console.error('Error creating class teacher:', err);
      toast.error(err.message || 'Failed to assign class teacher');
    } finally {
      setIsSubmitting(false);
    }
  });

  const steps = [
    { number: 1, title: 'Teacher', icon: UserCircle, description: 'Select or create teacher' },
    { number: 2, title: 'Class', icon: BookOpen, description: 'Select or create class' },
    { number: 3, title: 'Section', icon: Layers, description: 'Select or create section' },
    { number: 4, title: 'Assignment', icon: Calendar, description: 'Review & assign' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header with progress */}
      <div className="border-b bg-muted/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Assign Class Teacher</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
            </p>
          </div>
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            return (
              <div key={step.number} className="flex items-center flex-1">
                <button
                  onClick={() => goToStep(step.number as StepType)}
                  className={`flex items-center gap-3 w-full transition-colors ${
                    isCurrent ? 'text-primary' : isCompleted ? 'text-primary/70' : 'text-muted-foreground'
                  }`}
                  disabled={isSubmitting}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      isCurrent
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isCompleted
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-muted-foreground/30 bg-background'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-medium">{step.title}</div>
                  </div>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-colors ${
                      isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    Teacher Selection
                  </CardTitle>
                  <CardDescription>
                    Choose an existing teacher or create a new teacher account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Teacher Mode Selection */}
                  <div className="space-y-3">
                    <Label>Teacher Account</Label>
                    <Controller
                      name="teacherMode"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div>
                            <RadioGroupItem
                              value="existing"
                              id="teacher-existing"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="teacher-existing"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <Users className="mb-3 h-6 w-6" />
                              <div className="text-center">
                                <div className="font-semibold">Existing Teacher</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Select from existing teachers
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="create"
                              id="teacher-create"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="teacher-create"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <User className="mb-3 h-6 w-6" />
                              <div className="text-center">
                                <div className="font-semibold">New Teacher</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Create a new teacher account
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>

                  <Separator />

                  {teacherMode === 'existing' ? (
                    // Existing Teacher Selection
                    <div className="space-y-2">
                      <Label htmlFor="existingTeacher">
                        Select Teacher <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="existingTeacherId"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id="existingTeacher">
                              <SelectValue
                                placeholder={
                                  loadingTeachers
                                    ? 'Loading teachers...'
                                    : existingTeachers.length === 0
                                    ? 'No teachers available - create a new one'
                                    : 'Select a teacher'
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {existingTeachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.full_name || teacher.username}
                                  {teacher.email && ` (${teacher.email})`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {existingTeachers.length === 0 && !loadingTeachers && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            No teachers found. Please switch to "New Teacher" mode to create one.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    // New Teacher Creation Form
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="teacher_first_name">
                            First Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="teacher_first_name"
                            {...register('teacher_first_name', { required: true })}
                            placeholder="John"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="teacher_last_name">
                            Last Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="teacher_last_name"
                            {...register('teacher_last_name', { required: true })}
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="teacher_username">
                          Username <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="teacher_username"
                          {...register('teacher_username', { required: true })}
                          placeholder="john.doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="teacher_email">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="teacher_email"
                          type="email"
                          {...register('teacher_email', { required: true })}
                          placeholder="john.doe@example.com"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="teacher_password">
                            Password <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="teacher_password"
                            type="password"
                            {...register('teacher_password', { required: true })}
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="teacher_confirmPassword">
                            Confirm Password <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="teacher_confirmPassword"
                            type="password"
                            {...register('teacher_confirmPassword', { required: true })}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="teacher_phone">Phone</Label>
                          <Input
                            id="teacher_phone"
                            {...register('teacher_phone')}
                            placeholder="+1234567890"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="teacher_gender">Gender</Label>
                          <Controller
                            name="teacher_gender"
                            control={control}
                            render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger id="teacher_gender">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {GENDERS.map((g) => (
                                    <SelectItem key={g.value} value={g.value}>
                                      {g.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="teacher_date_of_birth">Date of Birth</Label>
                        <Input
                          id="teacher_date_of_birth"
                          type="date"
                          {...register('teacher_date_of_birth')}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Class Selection
                  </CardTitle>
                  <CardDescription>
                    Choose an existing class or create a new one
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Class Mode Selection */}
                  <div className="space-y-3">
                    <Label>Class Option</Label>
                    <Controller
                      name="classMode"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div>
                            <RadioGroupItem
                              value="existing"
                              id="class-existing"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="class-existing"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <BookOpen className="mb-3 h-6 w-6" />
                              <div className="text-center">
                                <div className="font-semibold">Existing Class</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Select from existing classes
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="create"
                              id="class-create"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="class-create"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <GraduationCap className="mb-3 h-6 w-6" />
                              <div className="text-center">
                                <div className="font-semibold">New Class</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Create a new class
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>

                  <Separator />

                  {classMode === 'existing' ? (
                    // Existing Class Selection
                    <div className="space-y-2">
                      <Label htmlFor="existingClass">
                        Select Class <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="existingClassId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value?.toString() || ''}
                            onValueChange={(v) => field.onChange(parseInt(v))}
                          >
                            <SelectTrigger id="existingClass">
                              <SelectValue
                                placeholder={
                                  loadingClasses
                                    ? 'Loading classes...'
                                    : existingClasses.length === 0
                                    ? 'No classes available - create a new one'
                                    : 'Select a class'
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {existingClasses.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id.toString()}>
                                  {cls.name} - {cls.program_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {existingClasses.length === 0 && !loadingClasses && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            No classes found. Please switch to "New Class" mode to create one.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    // New Class Creation Form
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="class_program">
                          Program <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                          name="class_program"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value?.toString() || ''}
                              onValueChange={(v) => field.onChange(parseInt(v))}
                            >
                              <SelectTrigger id="class_program">
                                <SelectValue placeholder="Select program" />
                              </SelectTrigger>
                              <SelectContent>
                                {programs.map((prog) => (
                                  <SelectItem key={prog.id} value={prog.id.toString()}>
                                    {prog.name} ({prog.code})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {programs.length === 0 && (
                          <p className="text-xs text-amber-600">
                            ⚠️ No programs found. Please create a program first.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="class_name">
                          Class Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="class_name"
                          {...register('class_name', { required: true })}
                          placeholder="e.g., BCA 2024 Batch"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="class_semester">
                            Semester <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="class_semester"
                            type="number"
                            min="1"
                            max="12"
                            {...register('class_semester', { required: true, valueAsNumber: true })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="class_year">
                            Year <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="class_year"
                            type="number"
                            min="1"
                            max="6"
                            {...register('class_year', { required: true, valueAsNumber: true })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="class_max_students">Max Students</Label>
                          <Input
                            id="class_max_students"
                            type="number"
                            min="1"
                            {...register('class_max_students', { valueAsNumber: true })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Section Selection
                  </CardTitle>
                  <CardDescription>
                    Choose an existing section or create a new one for the selected class
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Section Mode Selection */}
                  <div className="space-y-3">
                    <Label>Section Option</Label>
                    <Controller
                      name="sectionMode"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div>
                            <RadioGroupItem
                              value="existing"
                              id="section-existing"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="section-existing"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <Layers className="mb-3 h-6 w-6" />
                              <div className="text-center">
                                <div className="font-semibold">Existing Section</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Select from existing sections
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="create"
                              id="section-create"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="section-create"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <Layers className="mb-3 h-6 w-6" />
                              <div className="text-center">
                                <div className="font-semibold">New Section</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Create a new section
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>

                  <Separator />

                  {sectionMode === 'existing' ? (
                    // Existing Section Selection
                    <div className="space-y-2">
                      <Label htmlFor="existingSection">
                        Select Section <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="existingSectionId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value?.toString() || ''}
                            onValueChange={(v) => field.onChange(parseInt(v))}
                          >
                            <SelectTrigger id="existingSection">
                              <SelectValue
                                placeholder={
                                  loadingSections
                                    ? 'Loading sections...'
                                    : !selectedClassId
                                    ? 'Please select a class first'
                                    : existingSections.length === 0
                                    ? 'No sections available - create a new one'
                                    : 'Select a section'
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {existingSections.map((sec) => (
                                <SelectItem key={sec.id} value={sec.id.toString()}>
                                  {sec.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {classMode === 'existing' && existingSections.length === 0 && !loadingSections && selectedClassId && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            No sections found for this class. Please switch to "New Section" mode to create one.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    // New Section Creation Form
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="section_name">
                          Section Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="section_name"
                          {...register('section_name', { required: true })}
                          placeholder="e.g., Section A, Morning Batch"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="section_max_students">Maximum Students</Label>
                        <Input
                          id="section_max_students"
                          type="number"
                          min="1"
                          {...register('section_max_students', { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Assignment Details & Review
                  </CardTitle>
                  <CardDescription>
                    Review your selections and set assignment details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Review Summary */}
                  <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                    <h4 className="font-semibold text-sm">Assignment Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Teacher:</span>{' '}
                        <span className="font-medium">
                          {teacherMode === 'existing'
                            ? existingTeachers.find((t) => t.id === watch('existingTeacherId'))?.full_name || 'Not selected'
                            : `${watch('teacher_first_name')} ${watch('teacher_last_name')}` || 'New teacher'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Class:</span>{' '}
                        <span className="font-medium">
                          {classMode === 'existing'
                            ? existingClasses.find((c) => c.id === watch('existingClassId'))?.name || 'Not selected'
                            : watch('class_name') || 'New class'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Section:</span>{' '}
                        <span className="font-medium">
                          {sectionMode === 'existing'
                            ? existingSections.find((s) => s.id === watch('existingSectionId'))?.name || 'Not selected'
                            : watch('section_name') || 'New section'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Assignment Details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="academic_session">
                        Academic Session <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="academic_session"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value?.toString() || ''}
                            onValueChange={(v) => field.onChange(parseInt(v))}
                          >
                            <SelectTrigger id="academic_session">
                              <SelectValue placeholder="Select academic session" />
                            </SelectTrigger>
                            <SelectContent>
                              {sessions.map((session) => (
                                <SelectItem key={session.id} value={session.id.toString()}>
                                  {session.name}
                                  {session.is_active && (
                                    <Badge variant="secondary" className="ml-2">
                                      Active
                                    </Badge>
                                  )}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="assigned_from">
                          Assignment Start Date <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="assigned_from"
                          type="date"
                          {...register('assigned_from', { required: true })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assigned_to">
                          Assignment End Date <span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Input
                          id="assigned_to"
                          type="date"
                          {...register('assigned_to')}
                          min={watch('assigned_from')}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
                      <div className="space-y-0.5">
                        <Label className="text-base">Active Status</Label>
                        <p className="text-xs text-muted-foreground">
                          Set whether this assignment is active
                        </p>
                      </div>
                      <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer with navigation */}
      <div className="border-t p-6 bg-muted/30">
        <div className="flex justify-between gap-4 max-w-3xl mx-auto">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            className="w-32"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < 4 ? (
            <Button type="button" onClick={handleNext} disabled={isSubmitting} className="w-32">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button type="button" onClick={handleFinalSubmit} disabled={isSubmitting} className="w-32">
              {isSubmitting ? 'Assigning...' : 'Assign Teacher'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
