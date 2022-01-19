import { Router } from 'express';

import { validateFields, validateFile, validateFileExts } from '../middlewares';
import { uploadFileController } from '../controllers';

const router = Router();

router.route('/').post(
  [
    validateFile,
    // validateFileExts(['png', 'jpg', 'jpeg', 'gif']),
    validateFileExts(['txt', 'md', 'pdf']),
    validateFields,
  ],

  uploadFileController
);

export default router;
