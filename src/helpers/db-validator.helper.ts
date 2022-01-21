import { Category, Product, Role, User } from '../models';
import { UserModel } from '../models/user.model';

import { Types } from 'mongoose';
const { ObjectId } = Types;

interface CheckModel {
  state: boolean;
  name: string;
}

export const userExistByEmail = async (email: string): Promise<void> => {
  const user: UserModel = await User.findOne({ email });

  if (!user || !user.state)
    throw new Error(
      'There was a problem logging in. Check your email and password or create an account.'
    );
};

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
  query: string,
  collection: string
): Promise<void> => {
  const isValidMongoId: boolean = ObjectId.isValid(query);
  let model: CheckModel;

  const checkInCollection = () => {
    if (!model)
      throw new Error(`${collection} ID: '${query}' doesn't exist! - in Db`);
    if (!model.state)
      throw new Error(
        `${collection} ID: '${query}' doesn't exist! - State: False!`
      );
  };

  /* if (!isValidMongoId || query.includes('@')) {
    // Buscar por nombre / email / etc
    console.log('Buscar por nombre/email/etc');

    switch (collection) {
      case 'user':
        model = await User.findOne({ name: query });
        return checkInCollection();

      case 'category':
        model = await Category.findOne({ name: query });
        return checkInCollection();

      case 'product':
        model = await Product.findOne({ name: query });
        return checkInCollection();
    }
  } */

  // Buscar por id
  switch (collection) {
    case 'user':
      model = await User.findById(query);
      return checkInCollection();

    case 'category':
      model = await Category.findById(query);
      return checkInCollection();

    case 'product':
      model = await Product.findById(query);
      return checkInCollection();
  }
};

// // Other f(x)
// 5 * (3 - 1) = 10 <- Salta    <-- Inicia   1, 6, 11
export const genSkips = (perPage: number, pageNum: number): number =>
  perPage * (pageNum - 1);
