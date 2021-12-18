import { Router } from 'express';
import { check } from 'express-validator';

import { validateFields } from '../middlewares';
import { isAlreadyRegistered, userExistByEmail } from '../helpers';
import { signUp, signIn } from '../controllers/auth.controller';

const router: Router = Router();

router.route('/signup').post(
  [
    check('name', 'Name is required!').exists(),
    check('email', 'Invalid email!').isEmail(),
    check('password', 'Password must be longer than 6 characters.').isLength({
      min: 6,
    }),
    validateFields,
    check('email').custom(isAlreadyRegistered),
    validateFields,
  ],

  signUp
);

router.route('/login').post(
  [
    check('email', 'Invalid email!').isEmail(),
    check('password', 'Password is required!').exists(),
    validateFields,
    check('email').custom(userExistByEmail),
    validateFields,
  ],

  signIn
);

router.route('/social/google').post(
  [check('id_token', 'id_token is required!').exists(), validateFields]

  // googleSignIn
);

export default router;
