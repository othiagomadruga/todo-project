import { prisma } from '../prisma';
import { AppError } from '../utils/AppError';
import { z } from 'zod';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';

export class TaskService {
  async create(userId: string, data: z.infer<typeof createTaskSchema>) {
    // Verificar se o projeto pertence ao usuário
    const project = await prisma.project.findFirst({
      where: { id: data.projectId, userId }
    });

    if (!project) {
      throw new AppError('Projeto não encontrado ou acesso negado', 404);
    }

    return prisma.task.create({
      data,
    });
  }

  async findAll(userId: string, projectId?: string) {
    return prisma.task.findMany({
      where: {
        project: {
          userId,
        },
        ...(projectId ? { projectId } : {})
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(userId: string, id: string) {
    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
          userId
        }
      },
      include: {
        project: true
      }
    });

    if (!task) {
      throw new AppError('Tarefa não encontrada', 404);
    }

    return task;
  }

  async update(userId: string, id: string, data: z.infer<typeof updateTaskSchema>) {
    const task = await prisma.task.findFirst({
      where: {
        id,
        project: { userId }
      }
    });

    if (!task) {
      throw new AppError('Tarefa não encontrada', 404);
    }

    if (data.projectId) {
      const newProject = await prisma.project.findFirst({
        where: { id: data.projectId, userId }
      });
      if (!newProject) {
        throw new AppError('Projeto destino não encontrado', 404);
      }
    }

    const payload: any = { ...data };
    if (data.status === 'DONE' && task.status !== 'DONE') {
      payload.completedAt = new Date();
    } else if (data.status !== 'DONE' && task.status === 'DONE') {
      payload.completedAt = null;
    }

    return prisma.task.update({
      where: { id },
      data: payload,
    });
  }

  async delete(userId: string, id: string) {
    const task = await prisma.task.findFirst({
      where: {
        id,
        project: { userId }
      }
    });

    if (!task) {
      throw new AppError('Tarefa não encontrada', 404);
    }

    return prisma.task.delete({
      where: { id },
    });
  }
}
