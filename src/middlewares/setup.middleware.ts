import { Application } from 'express';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';

import {
  initializePassport,
  passportInit,
  protectWithJWT,
} from './auth.middleware';

export const setupMiddlewares = (app: Application): void => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, './../public')));
  app.use(compression()).use(helmet());

  // Passport
  app.use(initializePassport());
  passportInit();
  app.use(protectWithJWT);
};
