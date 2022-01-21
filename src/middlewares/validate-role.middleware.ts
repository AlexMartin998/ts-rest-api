import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ObjectId } from 'mongoose';

interface UserRole {
  role: string;
  name: string;
  _id: ObjectId;
}

// TODO: Esto mismo pero para productos - No va el uid en el param
export const isAdminOrSameUser: RequestHandler<{ id: string }> = (
  req,
  res,
  next
) => {
  if (!req.user) return res.status(401).json({ msg: 'Unathorized!!' });

  const { id } = req.params;
  const { role: authRole, name, _id: uid } = req.user as UserRole;

  if (id === uid.toString() || authRole === 'ADMIN_ROLE') return next();

  res.status(401).json({
    msg: `Unauthorized! - '${name}' is not an admin or the same user.`,
  });
};

export const hasValidRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    if (!req.user)
      return res.status(401).json({
        msg: 'Unathorized! - You want to verify the role without validating the token first',
      });

    const { role: authRole, name } = req.user as UserRole;
    if (!roles.includes(authRole))
      return res
        .status(401)
        .json({ msg: `Unauthorized! - '${name}' has no valid role!` });

    return next();
  };
};
