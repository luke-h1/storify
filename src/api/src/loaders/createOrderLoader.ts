import DataLoader from 'dataloader';
import { Order } from '../entities/Order';

export const createOrderLoader = () =>
  new DataLoader<number, Order>(async orderIds => {
    const orders = await Order.findByIds(orderIds as number[]);
    const orderIdToOrder: Record<number, Order> = {};
    orders.forEach(o => {
      orderIdToOrder[o.id] = o;
    });
    const sortedOrders = orderIds.map(orderId => orderIdToOrder[orderId]);
    return sortedOrders;
  });
