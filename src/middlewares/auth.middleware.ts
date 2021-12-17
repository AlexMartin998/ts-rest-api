import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Handler, NextFunction, Request, Response } from 'express';

import { SECRETORKEY } from '../config';
import { User } from '../models';

export const initializePassport = (): Handler => passport.initialize();

export const passportInit = (): void => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: SECRETORKEY,
  };

  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (!user) return done(null, false);

        // req.user: 2nd parameter
        return done(null, user);
      } catch (error) {
        console.log(error);
      }
    })
  );
};

export const protectWithJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.path === '/auth/login' || req.path === '/auth/signup') return next();

  return passport.authenticate('jwt', { session: false })(req, res, next);
};
