import { Router } from 'express';
import { check } from 'express-validator';
import { searchQuery } from '../controllers';

import { allowedCollections } from '../helpers';
import { idExistSearch, validateFields } from '../middlewares';

const router = Router();

// TODO: Asi buscar si existe algo. 1 sola f(x) donde pase c y una bandera con la collection
// pasar como c el analizado, pasar como banderilla lo q evalueare en el switch
router.route('/:collection/:query').get(
  [
    check('collection').custom(c =>
      allowedCollections(c, ['users', 'categories', 'products'])
    ),
    validateFields,
    idExistSearch,
    validateFields,
  ],

  searchQuery
);

export default router;
