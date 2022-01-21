import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ObjectId } from 'mongoose';
import { Category, Product, User } from '../models';
import { CategoryModel } from '../models/category.model';

interface UserRole {
  role: string;
  name: string;
  _id: ObjectId;
}

interface CheckModel {
  state: boolean;
  _id: string;
  user: ObjectId;
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

export const isAdminOrSameUserM = (collection: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ msg: 'Unathorized!!' });

    const { id: documentID } = req.params;
    let model: CheckModel;
    const { role: authRole, name, _id: authUid } = req.user as UserRole;

    const checkInCollection = () => {
      const { _id: uid } = model.user as unknown as CategoryModel;

      if (uid.toString() === authUid.toString() || authRole === 'ADMIN_ROLE')
        return next();

      return res.status(401).json({
        msg: `Unauthorized! - '${name}' is not an admin or the same user.`,
      });
    };

    switch (collection) {
      case 'category':
        model = await Category.findById(documentID);
        return checkInCollection();

      case 'product':
        model = await Product.findById(documentID);
        return checkInCollection();

      case 'user':
        model = await User.findById(documentID);
        return checkInCollection();
    }
  };
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
