import { Product, User } from '../models';

export const getModel = async (collection: string, id: string) => {
  let model = {
    img: '',
  };

  if (collection === 'users') model = await User.findById(id);
  if (collection === 'products') model = await Product.findById(id);

  return model;
};
