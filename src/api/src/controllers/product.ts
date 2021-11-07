import { Response } from 'express'
import asyncHandler from 'express-async-handler'
import Product from '../models/productModel'
import { IRequest } from '../types'


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
    count = await Product.countDocuments({})
  }

  let products;

  if(req.query.keyword) {
    products = await Product.find({
      $regex: req.query.keyword,
      $options: 'i'
    }).limit(pageSize).skip(pageSize * page -1)
  } else {
    products = Product.find({}).limit(pageSize).skip(pageSize * page -1)
  }

  res.status(200).json({ products, page, pages: Math.ceil(count / pageSize) })
})