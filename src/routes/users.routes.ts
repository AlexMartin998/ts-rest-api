import { Router } from 'express';
import { check } from 'express-validator';

import { CACHE_TIME } from '../config';
import { doesItExist } from '../helpers';
import {
  cacheMiddleware,
  hasValidRole,
  isAdminOrSameUser,
  protectWithJWT,
  validateFields,
} from '../middlewares';
import { deleteUser, getUserByID, getUsers, updateUser } from '../controllers';

const router: Router = Router();

router.route('/').get(cacheMiddleware(CACHE_TIME.ONE_HOUR), getUsers);

router
  .route('/:id')
  .get(
    [
      check('id', 'Invalid ID!').isMongoId(),
      validateFields,
      check('id').custom((id: string) => doesItExist(id, 'user')),
      validateFields,
    ],

    getUserByID
  )
  .put(
    [
      protectWithJWT,
      check('id', 'Invalid ID!').isMongoId(),
      validateFields,
      check('id').custom((id: string) => doesItExist(id, 'user')),
      validateFields,

      // TODO: validateFields retorner una f(req, res, nex) Para q en el router no se repita tanto, sino q se llame en cada custom / middleware like isAdmin
      isAdminOrSameUser('user'),
      validateFields,
    ],

    updateUser
  )
  .delete(
    [
      protectWithJWT,
      check('id', 'ID is not a valid MongoDB ID!').isMongoId(),
      validateFields,
      check('id').custom((id: string) => doesItExist(id, 'user')),
      validateFields,
      // isAdminOrSameUser('user'),
      hasValidRole('ADMIN_ROLE', 'ANY_OTHER_ROLE'),
      validateFields,
    ],

    deleteUser
  );

export default router;
