import { Router } from 'express';
import { z } from 'zod';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { getAll, create, update, remove } from '../controllers/task.controller';

const router = Router();

const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must not exceed 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),
});

const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must not exceed 200 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),
  isCompleted: z.boolean().optional(),
});

router.use(auth);

router.get('/', getAll);
router.post('/', validate(createTaskSchema), create);
router.patch('/:id', validate(updateTaskSchema), update);
router.delete('/:id', remove);

export default router;
