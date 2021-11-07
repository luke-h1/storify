import express from 'express'

import {
  createProduct,
  createProductReview,
  deleteProduct,
  getProduct,
  getProducts,
  getTopProducts,
  updateProduct,
} from '../controllers/product'

import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);

router.route('/:id/reviews').post(protect, createProductReview);

router.get('/top', getTopProducts)

router.route('/:id')
  .get(getProduct)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct)

export default router;
