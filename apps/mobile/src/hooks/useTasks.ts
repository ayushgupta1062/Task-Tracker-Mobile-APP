import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks.api';
import { QUERY_KEYS } from '../constants/queryKeys';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../types';

export const useTasks = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TASKS],
    queryFn: getTasks,
    select: (data) => data.data,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) =>
      updateTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.TASKS] });
      const previousTasks = queryClient.getQueryData<{ data: Task[] }>([QUERY_KEYS.TASKS]);
      queryClient.setQueryData<{ data: Task[] }>([QUERY_KEYS.TASKS], (old) => {
        if (!old) return old;
        return { ...old, data: old.data.filter((t) => t._id !== id) };
      });
      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData([QUERY_KEYS.TASKS], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
    },
  });
};
