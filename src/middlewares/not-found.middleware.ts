import { Request, Response } from 'express';

export default (req: Request, res: Response): Response =>
  res.status(404).send({ status: 404, message: 'Resource not found!' });