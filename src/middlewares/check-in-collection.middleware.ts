// import { Types } from 'mongoose';

import { RequestHandler } from 'express';

import { Category, Product } from './../models';
import { CategoryModel } from '../models/category.model';
import { ProductModel } from '../models/product.model';

// const { ObjectId } = Types;

// // Categories
export const categoryIDNameExist: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
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

export const checkNewNameProduct: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  const { id } = req.params;
  const newName: string = req.body.newName.toLowerCase();

  const productName: ProductModel = await Product.findOne({ name: newName });
  const product: ProductModel = await Product.findById(id);

  if (product.name === newName)
    return res.status(400).json({ msg: 'New name must not be the same!' });

  if (productName)
    return res
      .status(400)
      .json({ msg: `The Product '${newName}' is already registered!` });

  next();
};
