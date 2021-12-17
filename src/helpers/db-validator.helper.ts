import { User } from '../models';
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

// User
