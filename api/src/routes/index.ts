import { Router } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './projects.routes';
import taskRoutes from './tasks.routes';
import visitRoutes from './visit.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/visits', visitRoutes);

export default router;
