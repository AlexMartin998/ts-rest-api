import { Category, Product, Role, User } from '../models';

interface CheckModel {
  state: boolean;
  name: string;
}

// User:
export const isValidRole = async (role: string): Promise<void> => {
  const roleExist = await Role.findOne({ role });
  if (!roleExist)
    throw new Error(`The role: '${role}' is not valid in this app.`);
};

// Allowed collections
export const allowedCollections = (
  collection: string,
  collections: string[]
): boolean => {
  const isIncluded: boolean = collections.includes(collection);
  if (!isIncluded)
    throw new Error(`Collection '${collection}' is not allowed!`);

  return true;
};

// TODO: Enviar el Model propiamente para no tener un Switch
// Try 1
export const alreadyRegistered = async (
  query: string,
  collection: string
): Promise<void> => {
  let model: CheckModel;

  const checkInCollection = (): void => {
    if (model)
      throw new Error(
        `The ${collection}${
          query.includes('@') ? "'s email" : ' name'
        } is already registered!`
      );
  };

  switch (collection) {
    case 'user':
      // model = await User.findOne({
      //   [query.includes('@') ? 'email' : 'name']: query,
      // });
      model = await User.findOne({ email: query });
      return checkInCollection();

    case 'category':
      model = await Category.findOne({ name: query.toUpperCase() });
      return checkInCollection();

    case 'product':
      model = await Product.findOne({ name: query.toLowerCase() });
      return checkInCollection();
  }
};

export const doesItExist = async (
  id: string,
  collection: string
): Promise<void> => {
  let model: CheckModel;

  const checkInCollection = (): void => {
    if (!model)
      throw new Error(`${collection} ID: '${id}' doesn't exist! - in Db`);
    if (!model.state)
      throw new Error(
        `${collection} ID: '${id}' doesn't exist! - State: False`
      );
  };

  // Search by ID
  switch (collection) {
    case 'user':
      model = await User.findById(id);
      return checkInCollection();

    case 'category':
      model = await Category.findById(id);
      return checkInCollection();

    case 'product':
      model = await Product.findById(id);
      return checkInCollection();
  }
};

// // Other f(x)
// 5 * (3 - 1) = 10 <- Salta    <-- Inicia   1, 6, 11
export const genSkips = (perPage: number, pageNum: number): number =>
  perPage * (pageNum - 1);
