import { Role, User } from '../models';
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
