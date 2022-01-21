import { RequestHandler } from 'express';
import { ObjectId } from 'mongoose';

import { Product } from '../models';
import { genSkips } from '../helpers';
import { ProductModel } from '../models/product.model';

interface ProductController {
  name: string;
  category: string;
  _id: ObjectId;
  description: string;
  newName: string;
}

export const getProducts: RequestHandler = async (req, res) => {
  const { perPage = 5, pageNum = 1 } = req.query;
  const activeProducts = { state: true };

  const skips: number = genSkips(+perPage, +pageNum);

  const [products, total] = await Promise.all([
    Product.find(activeProducts)
      .skip(skips)
      .limit(+perPage),

    Product.countDocuments(activeProducts),
  ]);

  res.status(200).json({
    msg: 'All products',
    total,
    products,
  });
};

export const getProduct: RequestHandler<{ id: string }> = async (req, res) => {
  const { id } = req.params;

  const product: ProductModel = await Product.findById(id);

  res.status(200).json({ msg: 'GET product', product });
};

export const createProduct: RequestHandler = async (req, res) => {
  const { name, category, description }: ProductController = req.body;
  const { _id: authUid } = req.user as ProductController;

  const data = {
    name: name.toLowerCase(),
    user: authUid.toString(),
    category,
    description,
  };

  const product = new Product(data);
  await product.save();

  res.status(201).json({
    msg: 'New Product registered',
    product,
  });
};

export const updateProdutc: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  const { id } = req.params;
  const { newName }: ProductController = req.body;

  const renamed: ProductModel = await Product.findByIdAndUpdate(
    id,
    { name: newName },
    { new: true }
  );

  res.json({
    msg: 'Product updated!',
    renamed,
  });
};

export const delteProduct: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  const { id } = req.params;

  const productDeleted: ProductModel = await Product.findByIdAndUpdate(
    id,
    {
      state: false,
    },
    { new: true }
  );

  res.json({
    msg: 'Product deleted!',
    productDeleted,
  });
};
