import express from 'express'

import {
  addOrderItems,
  getMyOrders,
  getOrder,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid
} from '../controllers/order';
import { protect, admin } from '../middleware/auth';

const router = express.Router()

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);

router.route('/myOrders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrder)

router.route('/:id/pay').put(protect, updateOrderToPaid)

router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)

export default router;
