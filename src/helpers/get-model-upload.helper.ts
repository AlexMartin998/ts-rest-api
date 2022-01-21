import { Product, User } from '../models';

export const getModel = async (collection: string, id: string) => {
  let model = {
    img: '',
  };

  if (collection === 'user') model = await User.findById(id);
  if (collection === 'product') model = await Product.findById(id);

  return model;
};
