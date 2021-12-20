import { Router } from 'express';
import { check } from 'express-validator';

import { googleSignUp, validateFields } from '../middlewares';
import { isAlreadyRegistered, isValidRole, userExistByEmail } from '../helpers';
import { signUp, signIn, googleSignIn } from '../controllers';

const router: Router = Router();

router.route('/signup').post(
  [
    check('name', 'Name is required!').exists(),
    check('email', 'Invalid email!').isEmail(),
    check('password', 'Password must be longer than 6 characters.').isLength({
      min: 6,
    }),
    check('role', 'Role is required!').exists(),
    validateFields,
    check('email').custom(isAlreadyRegistered),
    check('role').custom(isValidRole),
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
  [
    check('id_token', 'id_token is required!').exists(),
    validateFields,
    googleSignUp,
  ],

  googleSignIn
);

export default router;
