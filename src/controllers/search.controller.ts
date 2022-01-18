import { RequestHandler, Response } from 'express';

import { Category, Product, User } from '../models';

const genRegex = (query: string): RegExp => new RegExp(query, 'i');

const searchUsers = async (query: string, res: Response): Promise<Response> => {
  const users = await User.find({
    $or: [{ name: genRegex(query) }, { email: genRegex(query) }],
    $and: [{ state: true }],
  });

  return res.json({
    results: users,
  });
};

const searchCategories = async (
  query: string,
  res: Response
): Promise<Response> => {
  const category = await Category.find({
    name: genRegex(query),
    state: true,
  });

  return res.json({ results: category });
};

const searchProducts = async (
  query: string,
  res: Response
): Promise<Response> => {
  const product = await Product.find({
    name: genRegex(query),
    state: true,
  });

  return res.json({ results: product });
};

export const searchQuery: RequestHandler<{
  collection: string;
  query: string;
}> = (req, res) => {
  const { collection, query } = req.params;

  switch (collection) {
    case 'users':
      searchUsers(query, res);
      break;
    case 'categories':
      searchCategories(query, res);
      break;
    case 'products':
      searchProducts(query, res);
      break;
    case 'roles':
      break;
    default:
      res.status(500).json({ msg: 'Something went wrong!' });
  }
};
