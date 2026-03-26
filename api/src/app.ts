import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app: Express = express();

// Middlewares globais
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

import apiRoutes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';

// Rotas principais
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running smoothly!' });
});

// Registrar rotas da API
app.use('/api', apiRoutes);

// Registrar middleware de erro como a última etapa
app.use(errorMiddleware);

export default app;
