import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel';
import { IRequest } from '../types';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req: IRequest, res: Response) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  let count;
  if (req.query.keyword) {
    count = await Product.countDocuments({
      $regex: req.query.keyword,
      $options: 'i',
    });
  } else {
    count = await Product.countDocuments({});
  }

  let products;

  if (req.query.keyword) {
    products = await Product.find({
      $regex: req.query.keyword,
      $options: 'i',
    })
      .limit(pageSize)
      .skip(pageSize * page - 1);
  } else {
    products = Product.find({})
      .limit(pageSize)
      .skip(pageSize * page - 1);
  }

  res.status(200).json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public

const getProduct = asyncHandler(async (req: IRequest, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'product not found' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req: IRequest, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.status(200).json({ message: 'product removed' });
  } else {
    res.status(404).json({ message: 'product not found' });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req: IRequest, res: Response) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req?.user?._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin

const updateProduct = asyncHandler(async (req: IRequest, res: Response) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404).json({ message: 'no product found with that ID' });
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(
  async (req: IRequest, res: Response) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product?.reviews?.find(
        r => r.user.toString() === req.user?._id.toString(),
      );
      if (alreadyReviewed) {
        res.status(400).json({ message: 'Product already reviewed' });
      }
      const review = {
        name: req.user?.name as string,
        rating: Number(rating),
        comment,
        user: req?.user?._id as string,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product?.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  },
);

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (_: IRequest, res: Response) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.status(200).json(products);
});
export {
  getProducts,
  getProduct,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
