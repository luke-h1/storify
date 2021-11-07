import express from 'express'
const router = express.Router()

import {
  addOrderItems,
  getMyOrders,
  getOrder,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid
} from '../controllers/order'