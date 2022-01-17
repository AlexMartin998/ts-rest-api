// import { RequestHandler } from 'express';
// import { Types } from 'mongoose';

import { RequestHandler } from 'express';

import { Category } from './../models';
import { CategoryModel } from '../models/category.model';

// const { ObjectId } = Types;

// // Categories
export const categoryIDNameExist: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { newName } = req.body;

  const category: CategoryModel = await Category.findById(id);
  if (!category || !category.state)
    return res.status(400).json({ msg: `Ctegory ID '${id}' doesn't exist!` });

  // newName is only necessary to update/delete
  if (!newName) return next();

  const categoryByName: CategoryModel = await Category.findOne({
    name: newName.toUpperCase(),
  });

  if (newName.toUpperCase() === category.name)
    return res.status(400).json({ msg: 'New name must not be the same!' });

  if (categoryByName)
    return res
      .status(400)
      .json({ msg: `Category '${newName}' already exists!` });

  return next();
};
