import { Router } from 'express';
import { check } from 'express-validator';

import {
  idExistUpload,
  isAdminOrSameUser,
  protectWithJWT,
  validateFields,
  validateFile,
  validateFileExts,
} from '../middlewares';
import {
  serveImg,
  updateImgCloudinary,
  uploadFileController,
} from '../controllers';
import { allowedCollections } from '../helpers';

const router: Router = Router();

router.route('/').post(
  [
    protectWithJWT,
    validateFile,
    validateFileExts(['png', 'jpg', 'jpeg', 'gif']),
    // validateFileExts(['txt', 'md', 'pdf']),
    validateFields,
  ],

  uploadFileController
);

router
  .route('/:collection/:id')
  .get(
    [
      check('id', 'It is not a valid Mongo ID!').isMongoId(),
      validateFields,
      check('collection').custom(c =>
        allowedCollections(c, ['user', 'product'])
      ),
      validateFields,
      idExistUpload,
    ],

    serveImg
  )
  .put(
    [
      protectWithJWT,
      validateFile,
      check('id', 'It is not a valid Mongo ID').isMongoId(),
      validateFields,
      check('collection').custom(c =>
        allowedCollections(c, ['user', 'product'])
      ),
      validateFields,
      validateFileExts(['png', 'jpg', 'jpeg', 'gif']),
      idExistUpload,
      isAdminOrSameUser('user'),
    ],
    // updateImg // Upload images to our server
    updateImgCloudinary
  );

export default router;
