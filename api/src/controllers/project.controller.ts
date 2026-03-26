import { Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service';
import { createProjectSchema, updateProjectSchema } from '../schemas/project.schema';
import { AuthRequest } from '../middlewares/auth.middleware';

const projectService = new ProjectService();

export class ProjectController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsedData = createProjectSchema.parse(req.body);
      const result = await projectService.create(req.user!.id, parsedData);
      res.status(201).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await projectService.findAll(req.user!.id);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await projectService.findOne(req.user!.id, req.params.id as string);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsedData = updateProjectSchema.parse(req.body);
      const result = await projectService.update(req.user!.id, req.params.id as string, parsedData);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await projectService.delete(req.user!.id, req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
