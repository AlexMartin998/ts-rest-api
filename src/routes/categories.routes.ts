import { Router } from 'express';
import { check } from 'express-validator';

import { CACHE_TIME } from '../config';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '../controllers';
import {
  cacheMiddleware,
  categoryIDNameExist,
  isAdminOrSameUser,
  protectWithJWT,
  validateFields,
} from '../middlewares';

const router: Router = Router();

router
  .route('/')
  .get(cacheMiddleware(CACHE_TIME.ONE_HOUR), getCategories)
  .post(
    [
      protectWithJWT,
      check('name', 'Category name is required!').exists(),
      validateFields,
    ],

    createCategory
  );

router
  .route('/:id')
  .get(
    [
      check('id', 'Invalid MongoDB ID!').isMongoId(),
      validateFields,
      categoryIDNameExist,
      validateFields,
    ],

    getCategory
  )
  .put(
    [
      protectWithJWT,
      isAdminOrSameUser,
      check('id', 'Invalid ID!').isMongoId(),
      check('newName', 'New name is required!').not().isEmpty(),
      validateFields,
      categoryIDNameExist,
      validateFields,
    ],

    updateCategory
  )
  .delete(
    [
      protectWithJWT,
      isAdminOrSameUser,
      check('id', 'Invalid ID!').isMongoId(),
      validateFields,
      categoryIDNameExist,
      validateFields,
    ],

    deleteCategory
  );

export default router;
