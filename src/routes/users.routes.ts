import { Router } from 'express';
import { check } from 'express-validator';

import { userIDExist } from '../helpers';
import {
  hasValidRole,
  isAdminOrSameUser,
  protectWithJWT,
  validateFields,
} from '../middlewares';
import { deleteUser, getUserByID, getUsers, updateUser } from '../controllers';

const router: Router = Router();

router.route('/').get(getUsers);

router
  .route('/:id')
  .get(
    [
      check('id', 'Invalid ID!').isMongoId(),
      validateFields,
      check('id').custom(userIDExist),
      validateFields,
    ],

    getUserByID
  )
  .put(
    [
      protectWithJWT,
      check('id', 'Invalid ID!').isMongoId(),
      validateFields,
      check('id').custom(userIDExist),
      validateFields,

      // TODO: validateFields retorner una f(req, res, nex) Para q en el router no se repita tanto, sino q se llame en cada custom / middleware like isAdmin
      isAdminOrSameUser,
      validateFields,
    ],

    updateUser
  )
  .delete(
    [
      protectWithJWT,
      check('id', 'ID is not a valid MongoDB ID!').isMongoId(),
      validateFields,
      check('id').custom(userIDExist),
      validateFields,
      // isAdminOrSameUser,
      hasValidRole('ADMIN_ROLE', 'ANY_OTHER_ROLE'),
      validateFields,
    ],

    deleteUser
  );

export default router;
