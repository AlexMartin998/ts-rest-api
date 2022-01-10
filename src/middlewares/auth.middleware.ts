import passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';
import { Handler, RequestHandler } from 'express';

import { SECRETORKEY } from '../config';
import { User } from '../models';
import { UserModel } from '../models/user.model';

export const initializePassport = (): Handler => passport.initialize();

export const passportInit = (): void => {
  const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: SECRETORKEY,
  };

  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const user: UserModel | null = await User.findById(payload.id);
        if (!user || !user.state) return done(null, false);

        // req.user: 2nd parameter
        return done(null, user);
      } catch (error) {
        console.log(error);
      }
    })
  );
};

export default passport.authenticate('jwt', { session: false });

// // Si son permitidas/libres, NO tienen req.user, no puedo usar middleware para saber si es the same user or admin xq TODOS los Verbos http quedan libres si la Route/Path esta libre
// Podria ver q tipo de verbo es y solo limitar los q me interesa, pero seria + trabajoso
export const protectWithJWT_Bettatech: RequestHandler = (req, res, next): void => {
  let id: string | undefined;
  if (req.path.includes('/user/')) id = req.path.split('/').at(-1);

  // TODO: allowedArr | genAllPaths <- .push() | extract id
  // const arrAllowed = ['user', 'product'];
  // const extrackID = () => req.path.split('/').at(-1);

  console.log(req.path === `/user/${id}`);

  if (
    req.path === '/' ||
    req.path === '/auth/login' ||
    req.path === '/auth/signup' ||
    req.path === '/auth/social/google' ||
    req.path === '/user' ||
    req.path === `/user/${id}`
  )
    return next();

  return passport.authenticate('jwt', { session: false })(req, res, next);
};
