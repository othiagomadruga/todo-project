import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const projectController = new ProjectController();

router.use(authMiddleware);

router.post('/', projectController.create);
router.get('/', projectController.findAll);
router.get('/:id', projectController.findOne);
router.patch('/:id', projectController.update);
router.delete('/:id', projectController.delete);

export default router;
