import { Request, Response } from 'express';
import { generate } from 'generate-password';

import { generateToken } from '../helpers';
import { googleVerify } from '../helpers';
import { User } from '../models';
import { UserModel } from '../models/user.model';

interface AuthRequestValues {
  email: string;
  password: string;
  name: string;
}

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, email, password }: AuthRequestValues = req.body;

  const newUser: UserModel = new User({ name, email, password });

  // Save in DB
  await newUser.save();

  return res
    .status(201)
    .json({ msg: 'Successfully registered user!', user: newUser });
};

export const signIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password }: AuthRequestValues = req.body;
  const user: UserModel = await User.findOne({ email });

  // Check password
  const matchPass: boolean = await user.comparePassword(password);
  if (!matchPass)
    return res.status(400).json({
      msg: 'There was a problem logging in. Check your email and password or create an account. (Incorrect Pass)',
    });

  // Generate JWT
  const token = `JWT ${generateToken(user)}`;

  return res.status(200).json({ msg: 'Successful login!', token });
};

export const googleSignIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id_token } = req.body;
    const { email } = await googleVerify(id_token);

    const user: UserModel = await User.findOne({ email });

    const token = generateToken(user.id);

    return res.status(200).json({ msg: 'Successful login!', user, token });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, msg: 'Invalid Token!' });
  }
};
