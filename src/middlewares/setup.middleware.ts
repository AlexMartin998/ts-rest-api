import { Application } from 'express';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import fileUpload from 'express-fileupload';

import { initializePassport, passportInit } from './auth.middleware';

export const setupMiddlewares = (app: Application): void => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, './../public')));
  app.use(compression()).use(helmet());
  app.use(morgan('dev'));

  // Passport
  app.use(initializePassport());
  passportInit();

  // Upload file
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
      createParentPath: true,
    })
  );
};
