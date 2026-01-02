import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { studentApi } from '@/services/students.service';
import type { Student } from '@/types/students.types';

export const useCurrentStudent = () => {
  const { user } = useAuth();
  const studentId = user?.student_id ? Number(user.student_id) : null;

  const query = useQuery<Student>({
    queryKey: ['current-student', studentId],
    queryFn: () => studentApi.get(studentId!),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    studentId,
  };
};

