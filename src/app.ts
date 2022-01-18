// Remove it:
import { Application } from 'express';
import express from 'express';

import './db/db';
import { setupMiddlewares } from './middlewares/setup.middleware';
import { notFoundMiddleware } from './middlewares';
import {
  authRoutes,
  categoryRoutes,
  productRoutes,
  searchRoutes,
  userRoutes,
} from './routes';

// Initializations:
const app: Application = express();

// Middlewares
setupMiddlewares(app);

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/search', searchRoutes);

app.use(notFoundMiddleware);

export default app;
