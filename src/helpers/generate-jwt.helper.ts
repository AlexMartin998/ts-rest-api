import jwt from 'jsonwebtoken';

import { UserModel } from '../models/user.model';
import { SECRETORKEY } from '../config';

export const generateToken = (user: UserModel): string =>
  jwt.sign({ id: user.id }, SECRETORKEY, { expiresIn: '12h' });
