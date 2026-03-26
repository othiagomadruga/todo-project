import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'O nome do projeto é obrigatório'),
  description: z.string().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, 'O nome do projeto não pode ser vazio').optional(),
  description: z.string().optional(),
});
