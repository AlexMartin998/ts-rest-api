import { Category, Product, Role, User } from '../models';
import { UserModel } from '../models/user.model';

// Auth
export const isAlreadyRegistered = async (email: string): Promise<void> => {
  const emailExist: UserModel = await User.findOne({ email });
  if (emailExist)
    throw new Error(`The email '${email}' is already registered!`);
};

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

// User
export const userIDExist = async (id: string): Promise<void> => {
  const user = await User.findById(id);

  if (!user) throw new Error(`User ID: '${id}' doesn't exist! - in Db`);
  if (!user.state)
    throw new Error(`User ID: '${id}' doesn't exist! - state: false`);
};

// Categories
export const categoryIDExist = async (id: string): Promise<void> => {
  const category = await Category.findById(id);
  if (!category || !category.state)
    throw new Error(`Ctegory ID '${id}' doesn't exist!`);
};

// Products
export const productIDExist = async (id: string): Promise<void> => {
  const product = await Product.findById(id);
  if (!product || !product.state)
    throw new Error(`Product ID '${id}' doesn't exist!`);
};

export const productAlreadyRegis = async (name: string): Promise<void> => {
  const product = await Product.findOne({ name: name.toLocaleLowerCase() });

  if (product) throw new Error(`The Product '${name}' is already registered!`);
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

// // Other f(x)
// 5 * (3 - 1) = 10 <- Salta    <-- Inicia   1, 6, 11
export const genSkips = (perPage: number, pageNum: number): number =>
  perPage * (pageNum - 1);
