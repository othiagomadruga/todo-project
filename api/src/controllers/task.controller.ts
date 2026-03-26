import { Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';
import { AuthRequest } from '../middlewares/auth.middleware';

const taskService = new TaskService();

export class TaskController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsedData = createTaskSchema.parse(req.body);
      const result = await taskService.create(req.user!.id, parsedData);
      res.status(201).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const projectId = req.query.projectId as string | undefined;
      const result = await taskService.findAll(req.user!.id, projectId);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await taskService.findOne(req.user!.id, req.params.id as string);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsedData = updateTaskSchema.parse(req.body);
      const result = await taskService.update(req.user!.id, req.params.id as string, parsedData);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await taskService.delete(req.user!.id, req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
