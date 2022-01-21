import { NextFunction, Request, Response } from 'express';
import { generate } from 'generate-password';

import { generateToken, googleVerify } from '../helpers';
import { User } from '../models';
import { UserModel } from '../models/user.model';

export const googleSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { id_token } = req.body;
    const { email, img, name } = await googleVerify(id_token);

    let user: UserModel = await User.findOne({ email });

    // Login
    if (user) return next();

    // Sign Up
    const data = {
      name,
      email,
      password: generate({
        length: 24,
        numbers: true,
      }),
      img,
      google: true,
    };

    user = new User(data);
    await user.save();

    // User exists, but state = false
    if (!user.state)
      return res.status(401).json({ msg: 'User blocked, talk to admin.' });

    const token = generateToken(user.id);

    return res
      .status(201)
      .json({ msg: 'Successfully registered user!', user, token });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, msg: 'Invalid Token!' });
  }
};
