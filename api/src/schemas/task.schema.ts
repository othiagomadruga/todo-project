import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'O título da tarefa é obrigatório'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
  projectId: z.string().uuid('ID do projeto inválido'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  projectId: z.string().uuid().optional(),
});
