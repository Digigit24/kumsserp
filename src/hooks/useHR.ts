/**
 * HR Module React Query Hooks
 * Custom hooks for HR module data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deductionsApi,
  leaveTypesApi,
  leaveApplicationsApi,
  leaveApprovalsApi,
  leaveBalancesApi,
  salaryStructuresApi,
  salaryComponentsApi,
  payrollsApi,
  payrollItemsApi,
  payslipsApi,
} from '../services/hr.service';

// ============================================================================
// DEDUCTIONS
// ============================================================================

/**
 * Fetch deductions with optional filters
 */
export const useDeductions = (filters?: any) => {
  return useQuery({
    queryKey: ['hr-deductions', filters],
    queryFn: () => deductionsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new deduction
 */
export const useCreateDeduction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');
      const collegeId = localStorage.getItem('kumss_college_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
      }

      if (collegeId) {
        submitData.college = parseInt(collegeId);
      }

      return deductionsApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-deductions'] });
    },
  });
};

/**
 * Update a deduction
 */
export const useUpdateDeduction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.updated_by = userId;
      }

      return deductionsApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-deductions'] });
    },
  });
};

/**
 * Delete a deduction
 */
export const useDeleteDeduction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deductionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-deductions'] });
    },
  });
};

// ============================================================================
// LEAVE TYPES
// ============================================================================

/**
 * Fetch leave types with optional filters
 */
export const useLeaveTypes = (filters?: any) => {
  return useQuery({
    queryKey: ['hr-leave-types', filters],
    queryFn: () => leaveTypesApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new leave type
 */
export const useCreateLeaveType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');
      const collegeId = localStorage.getItem('kumss_college_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
      }

      if (collegeId) {
        submitData.college = parseInt(collegeId);
      }

      return leaveTypesApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-leave-types'] });
    },
  });
};

/**
 * Update a leave type
 */
export const useUpdateLeaveType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.updated_by = userId;
      }

      return leaveTypesApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-leave-types'] });
    },
  });
};

/**
 * Delete a leave type
 */
export const useDeleteLeaveType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => leaveTypesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-leave-types'] });
    },
  });
};

// ============================================================================
// LEAVE APPLICATIONS
// ============================================================================

/**
 * Fetch leave applications with optional filters
 */
export const useLeaveApplications = (filters?: any) => {
  return useQuery({
    queryKey: ['hr-leave-applications', filters],
    queryFn: () => leaveApplicationsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new leave application
 */
export const useCreateLeaveApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
        status: data.status || 'pending',
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
        if (!data.teacher) {
          submitData.teacher = parseInt(userId);
        }
      }

      return leaveApplicationsApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-leave-applications'] });
    },
  });
};

/**
 * Update a leave application
 */
export const useUpdateLeaveApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.updated_by = userId;
      }

      return leaveApplicationsApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-leave-applications'] });
    },
  });
};

/**
 * Delete a leave application
 */
export const useDeleteLeaveApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => leaveApplicationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-leave-applications'] });
    },
  });
};

// ============================================================================
// LEAVE APPROVALS
// ============================================================================

/**
 * Fetch leave approvals with optional filters
 */
export const useLeaveApprovals = (filters?: any) => {
  return useQuery({
    queryKey: ['hr-leave-approvals', filters],
    queryFn: () => leaveApprovalsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new leave approval
 */
export const useCreateLeaveApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
        if (!data.approved_by) {
          submitData.approved_by = userId;
        }
      }

      return leaveApprovalsApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-leave-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['hr-leave-applications'] });
    },
  });
};

/**
 * Update a leave approval
 */
export const useUpdateLeaveApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.updated_by = userId;
      }

      return leaveApprovalsApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-leave-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['hr-leave-applications'] });
    },
  });
};

/**
 * Delete a leave approval
 */
export const useDeleteLeaveApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => leaveApprovalsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-leave-approvals'] });
    },
  });
};

// ============================================================================
// LEAVE BALANCES
// ============================================================================

/**
 * Fetch leave balances with optional filters
 */
export const useLeaveBalances = (filters?: any) => {
  return useQuery({
    queryKey: ['hr-leave-balances', filters],
    queryFn: () => leaveBalancesApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new leave balance
 */
export const useCreateLeaveBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
        if (!data.teacher) {
          submitData.teacher = parseInt(userId);
        }
      }

      return leaveBalancesApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-leave-balances'] });
    },
  });
};

/**
 * Update a leave balance
 */
export const useUpdateLeaveBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.updated_by = userId;
      }

      return leaveBalancesApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-leave-balances'] });
    },
  });
};

/**
 * Delete a leave balance
 */
export const useDeleteLeaveBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => leaveBalancesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-leave-balances'] });
    },
  });
};

// ============================================================================
// SALARY STRUCTURES
// ============================================================================

/**
 * Fetch salary structures with optional filters
 */
export const useSalaryStructures = (filters?: any) => {
  return useQuery({
    queryKey: ['hr-salary-structures', filters],
    queryFn: () => salaryStructuresApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new salary structure
 */
export const useCreateSalaryStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
        if (!data.teacher) {
          submitData.teacher = parseInt(userId);
        }
      }

      return salaryStructuresApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-salary-structures'] });
    },
  });
};

/**
 * Update a salary structure
 */
export const useUpdateSalaryStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.updated_by = userId;
      }

      return salaryStructuresApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-salary-structures'] });
    },
  });
};

/**
 * Delete a salary structure
 */
export const useDeleteSalaryStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => salaryStructuresApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-salary-structures'] });
    },
  });
};

// ============================================================================
// SALARY COMPONENTS
// ============================================================================

/**
 * Fetch salary components with optional filters
 */
export const useSalaryComponents = (filters?: any) => {
  return useQuery({
    queryKey: ['hr-salary-components', filters],
    queryFn: () => salaryComponentsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new salary component
 */
export const useCreateSalaryComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
      }

      return salaryComponentsApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-salary-components'] });
    },
  });
};

/**
 * Update a salary component
 */
export const useUpdateSalaryComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.updated_by = userId;
      }

      return salaryComponentsApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-salary-components'] });
    },
  });
};

/**
 * Delete a salary component
 */
export const useDeleteSalaryComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => salaryComponentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-salary-components'] });
    },
  });
};

// ============================================================================
// PAYROLLS
// ============================================================================

/**
 * Fetch payrolls with optional filters
 */
export const usePayrolls = (filters?: any) => {
  return useQuery({
    queryKey: ['hr-payrolls', filters],
    queryFn: () => payrollsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new payroll
 */
export const useCreatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
        if (!data.teacher) {
          submitData.teacher = parseInt(userId);
        }
      }

      return payrollsApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-payrolls'] });
    },
  });
};

/**
 * Update a payroll
 */
export const useUpdatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.updated_by = userId;
      }

      return payrollsApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-payrolls'] });
    },
  });
};

/**
 * Delete a payroll
 */
export const useDeletePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => payrollsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-payrolls'] });
    },
  });
};

// ============================================================================
// PAYROLL ITEMS
// ============================================================================

/**
 * Fetch payroll items with optional filters
 */
export const usePayrollItems = (filters?: any) => {
  return useQuery({
    queryKey: ['hr-payroll-items', filters],
    queryFn: () => payrollItemsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new payroll item
 */
export const useCreatePayrollItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
      }

      return payrollItemsApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-payroll-items'] });
    },
  });
};

/**
 * Update a payroll item
 */
export const useUpdatePayrollItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.updated_by = userId;
      }

      return payrollItemsApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-payroll-items'] });
    },
  });
};

/**
 * Delete a payroll item
 */
export const useDeletePayrollItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => payrollItemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-payroll-items'] });
    },
  });
};

// ============================================================================
// PAYSLIPS
// ============================================================================

/**
 * Fetch payslips with optional filters
 */
export const usePayslips = (filters?: any) => {
  return useQuery({
    queryKey: ['hr-payslips', filters],
    queryFn: () => payslipsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new payslip
 */
export const useCreatePayslip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
      }

      return payslipsApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-payslips'] });
    },
  });
};

/**
 * Update a payslip
 */
export const useUpdatePayslip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.updated_by = userId;
      }

      return payslipsApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-payslips'] });
    },
  });
};

/**
 * Delete a payslip
 */
export const useDeletePayslip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => payslipsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-payslips'] });
    },
  });
};
