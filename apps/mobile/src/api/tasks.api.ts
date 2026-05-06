import client from './client';
import { ApiResponse, Task, CreateTaskPayload, UpdateTaskPayload } from '../types';

export const getTasks = async (): Promise<ApiResponse<Task[]>> => {
  const response = await client.get<ApiResponse<Task[]>>('/tasks');
  return response.data;
};

export const createTask = async (
  payload: CreateTaskPayload
): Promise<ApiResponse<Task>> => {
  const response = await client.post<ApiResponse<Task>>('/tasks', payload);
  return response.data;
};

export const updateTask = async (
  id: string,
  payload: UpdateTaskPayload
): Promise<ApiResponse<Task>> => {
  const response = await client.patch<ApiResponse<Task>>(`/tasks/${id}`, payload);
  return response.data;
};

export const deleteTask = async (id: string): Promise<ApiResponse<undefined>> => {
  const response = await client.delete<ApiResponse<undefined>>(`/tasks/${id}`);
  return response.data;
};
