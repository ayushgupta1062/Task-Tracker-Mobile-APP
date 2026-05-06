import { Response, NextFunction } from 'express';
import { Task } from '../models/Task';
import { sendResponse } from '../utils/response';
import { AuthRequest, CreateTaskBody, UpdateTaskBody } from '../types';

export const getAll = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tasks = await Task.find({ userId: req.user!.id })
      .lean()
      .sort({ createdAt: -1 });
    sendResponse(res, 200, true, 'Tasks retrieved successfully', tasks);
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description } = req.body as CreateTaskBody;
    const task = new Task({ title, description, userId: req.user!.id });
    await task.save();
    sendResponse(res, 201, true, 'Task created successfully', task);
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const body = req.body as UpdateTaskBody;

    const task = await Task.findById(id);
    if (!task) {
      sendResponse(res, 404, false, 'Task not found');
      return;
    }

    if (task.userId.toString() !== req.user!.id) {
      sendResponse(res, 403, false, 'You do not have permission to update this task');
      return;
    }

    const updated = await Task.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    sendResponse(res, 200, true, 'Task updated successfully', updated);
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      sendResponse(res, 404, false, 'Task not found');
      return;
    }

    if (task.userId.toString() !== req.user!.id) {
      sendResponse(res, 403, false, 'You do not have permission to delete this task');
      return;
    }

    await task.deleteOne();
    sendResponse(res, 200, true, 'Task deleted successfully');
  } catch (err) {
    next(err);
  }
};
