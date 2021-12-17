// Remove it:
import { Application, Request, Response } from 'express';

import express from 'express';

import './db/db';
import { setupMiddlewares } from './middlewares/setup.middleware';
import { notFoundMiddleware } from './middlewares';
import { authRoutes } from './routes';

// Initializations:
const app: Application = express();

// Middlewares
setupMiddlewares(app);

// Routes
app.use('/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ msg: 'GET' });
});

app.use(notFoundMiddleware);

export default app;
