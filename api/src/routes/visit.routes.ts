import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const visits = await prisma.visitCounter.upsert({
      where: { id: 1 },
      update: { count: { increment: 1 } },
      create: { id: 1, count: 1 },
    });
    res.json({ status: 'success', count: visits.count });
  } catch (error) {
    next(error);
  }
});

export default router;
