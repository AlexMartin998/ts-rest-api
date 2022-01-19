import { Router } from 'express';
import { check } from 'express-validator';

import {
  checkNewNameProduct,
  isAdminOrSameUser,
  protectWithJWT,
  validateFields,
} from '../middlewares';
import {
  categoryIDExist,
  productAlreadyRegis,
  productIDExist,
} from '../helpers';
import {
  createProduct,
  delteProduct,
  getProduct,
  getProducts,
  updateProdutc,
} from '../controllers';

const router = Router();

router
  .route('/')
  .get(getProducts)
  .post(
    [
      protectWithJWT,
      check('name', 'Product name is required!').exists(),
      check('category', 'Invalid Category ID!').isMongoId(),
      validateFields,
      check('category').custom(categoryIDExist),
      validateFields,
      check('name').custom(productAlreadyRegis),
      validateFields,
    ],

    createProduct
  );

router
  .route('/:id')
  .get(
    [
      check('id', 'It is not a valid Mongo ID').isMongoId(),
      validateFields,
      check('id').custom(productIDExist),
      validateFields,
    ],

    getProduct
  )
  .put(
    [
      protectWithJWT,
      check('id', 'Invalid ID!').isMongoId(),
      check('newName', 'New name is required!').not().isEmpty(),
      validateFields,
      check('id').custom(productIDExist),
      validateFields,
      checkNewNameProduct,
    ],

    updateProdutc
  )
  .delete(
    [
      protectWithJWT,
      isAdminOrSameUser,
      check('id', 'Invalid product ID!').isMongoId(),
      validateFields,
      check('id').custom(productIDExist),
      validateFields,
    ],

    delteProduct
  );

export default router;