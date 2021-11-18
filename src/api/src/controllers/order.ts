import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel';
import { IRequest } from '../types';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

const addOrderItems = asyncHandler(async (req: IRequest, res: Response) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
  } else {
    const order = new Order({
      orderItems,
      user: req?.user?._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private

const getOrder = asyncHandler(async (req: IRequest, res: Response) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email',
  );
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ message: 'No order found with that ID!' });
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private

const updateOrderToPaid = asyncHandler(async (req: IRequest, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found with that ID' });
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin

const updateOrderToDelivered = asyncHandler(
  async (req: IRequest, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'order not found' });
    }
  },
);

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private

const getMyOrders = asyncHandler(async (_: IRequest, res: Response) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.status(200).json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (_: IRequest, res: Response) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.status(200).json(orders);
});
export {
  addOrderItems,
  getOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
