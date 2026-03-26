import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const taskController = new TaskController();

router.use(authMiddleware);

router.post('/', taskController.create);
router.get('/', taskController.findAll);
router.get('/:id', taskController.findOne);
router.patch('/:id', taskController.update);
router.delete('/:id', taskController.delete);

export default router;
