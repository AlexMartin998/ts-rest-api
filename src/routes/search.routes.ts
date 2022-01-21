import { Router } from 'express';
import { check } from 'express-validator';

import { allowedCollections } from '../helpers';
import { idExistSearch, validateFields } from '../middlewares';
import { searchQuery } from '../controllers';

const router: Router = Router();

router.route('/:collection/:query').get(
  [
    check('collection').custom(c =>
      allowedCollections(c, ['user', 'category', 'product'])
    ),
    validateFields,
    idExistSearch,
    validateFields,
  ],

  searchQuery
);

export default router;
