import { prisma } from '../prisma';
import { AppError } from '../utils/AppError';
import { z } from 'zod';
import { createProjectSchema, updateProjectSchema } from '../schemas/project.schema';

export class ProjectService {
  async create(userId: string, data: z.infer<typeof createProjectSchema>) {
    return prisma.project.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    });
  }

  async findOne(userId: string, id: string) {
    const project = await prisma.project.findFirst({
      where: { id, userId },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) {
      throw new AppError('Projeto não encontrado', 404);
    }

    return project;
  }

  async update(userId: string, id: string, data: z.infer<typeof updateProjectSchema>) {
    const project = await prisma.project.findFirst({ where: { id, userId } });

    if (!project) {
      throw new AppError('Projeto não encontrado', 404);
    }

    return prisma.project.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string, id: string) {
    const project = await prisma.project.findFirst({ where: { id, userId } });

    if (!project) {
      throw new AppError('Projeto não encontrado', 404);
    }

    // Excluir todas as tarefas associadas ao projeto primeiro (Cascade Delete manual)
    await prisma.task.deleteMany({
      where: { projectId: id },
    });

    return prisma.project.delete({
      where: { id },
    });
  }
}
