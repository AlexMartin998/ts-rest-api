import { Router } from 'express';
import { check } from 'express-validator';

import {
  cacheMiddleware,
  checkNewName,
  isAdminOrSameUser,
  protectWithJWT,
  validateFields,
} from '../middlewares';
import { CACHE_TIME } from '../config';
import { alreadyRegistered, doesItExist } from '../helpers';
import {
  createProduct,
  delteProduct,
  getProduct,
  getProducts,
  updateProdutc,
} from '../controllers';

const router: Router = Router();

router
  .route('/')
  .get(cacheMiddleware(CACHE_TIME.ONE_HOUR), getProducts)
  .post(
    [
      protectWithJWT,
      check('name', 'Product name is required!').exists(),
      check('category', 'Invalid Category ID!').isMongoId(),
      validateFields,
      check('category').custom(id => doesItExist(id, 'category')),
      validateFields,
      check('name').custom(name => alreadyRegistered(name, 'product')),
      validateFields,
    ],

    createProduct
  );

router
  .route('/:id')
  .get(
    [
      cacheMiddleware(CACHE_TIME.ONE_HOUR),
      check('id', 'It is not a valid Mongo ID').isMongoId(),
      validateFields,
      check('id').custom(id => doesItExist(id, 'product')),
      validateFields,
    ],

    getProduct
  )
  .put(
    [
      protectWithJWT,
      check('id', 'Invalid ID!').isMongoId(),
      check('newName', 'New name is required!').exists(),
      validateFields,
      check('id').custom(id => doesItExist(id, 'product')),
      isAdminOrSameUser('product'),
      validateFields,
      checkNewName('product'),
    ],

    updateProdutc
  )
  .delete(
    [
      protectWithJWT,
      check('id', 'Invalid product ID!').isMongoId(),
      validateFields,
      check('id').custom(id => doesItExist(id, 'product')),
      validateFields,
      isAdminOrSameUser('product'),
      validateFields,
    ],

    delteProduct
  );

export default router;
