import { RequestHandler } from 'express';

import { Category } from '../models';
import { genSkips } from '../helpers';
import { CategoryModel } from '../models/category.model';

interface CategoryController {
  _id: string;
  newName: string;
}

export const getCategories: RequestHandler = async (req, res) => {
  const { perPage = 5, pageNum = 1 } = req.query;
  const activeCategories = { state: true };

  const skips: number = genSkips(+perPage, +pageNum);

  const [allCategories, total] = await Promise.all([
    Category.find(activeCategories)
      .skip(skips)
      .limit(+perPage),

    Category.countDocuments(activeCategories),
  ]);

  res.status(200).json({
    msg: 'All categories',
    total,
    allCategories,
  });
};

export const getCategory: RequestHandler<{ id: string }> = async (req, res) => {
  const { id } = req.params;

  const category: CategoryModel = await Category.findById(id);

  res.status(200).json({ msg: 'Category', category });
};

export const createCategory: RequestHandler = async (req, res) => {
  const name: string = req.body.name.toUpperCase();
  const { _id: authUid } = req.user as CategoryController;

  const data = {
    name,
    user: authUid.toString(),
  };

  const newCategory: CategoryModel = new Category(data);
  await newCategory.save();

  res.status(201).json({
    msg: 'Category Created!',
    newCategory,
  });
};

export const updateCategory: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  const { id } = req.params;
  const { newName }: CategoryController = req.body;

  const renamed: CategoryModel = await Category.findByIdAndUpdate(
    id,
    { name: newName.toUpperCase() },
    { new: true }
  );

  res.json({
    msg: 'Category updated!',
    categoryID: id,
    renamed,
  });
};

export const deleteCategory: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  const { id } = req.params;

  const categoryDeleted: CategoryModel = await Category.findByIdAndUpdate(
    id,
    {
      state: false,
    },
    { new: true }
  );

  res.status(200).json({
    msg: `The Category '${categoryDeleted.name}' has been successfully deleted!`,
  });
};
