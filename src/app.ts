// Remove it:
import { Application } from 'express';
import express from 'express';

import './db/db';
import { setupMiddlewares } from './middlewares/setup.middleware';
import { notFoundMiddleware } from './middlewares';
import { authRoutes, userRoutes } from './routes';

// Initializations:
const app: Application = express();

// Middlewares
setupMiddlewares(app);

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.use(notFoundMiddleware);

export default app;
