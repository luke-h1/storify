import { Order, OrderResponse, PaymentResult } from "../../types";
import storifyApi from './Client';


const orderService = {
  create: async (order: Order): Promise<OrderResponse> => {
    const { data } = await storifyApi.post('/api/orders', order);
    return data;
  },

  getDetails: async (id: string): Promise<OrderResponse> => {
    const { data } = await storifyApi.get(`/api/orders/${id}`)
    return data;
  },

  pay: async (orderId: string, paymentResult: PaymentResult): Promise<OrderResponse> => {
    const { data } = await storifyApi.put(`/api/orders/${orderId}/pay`, paymentResult);
    return data;
  },

  deliver: async (order: Order): Promise<OrderResponse> => {
    const { data } = await storifyApi.put(`/api/orders/${order._id}/deliver`, {});
    return data;
  },

  listMyOrders: async (): Promise<Order | Order[]> => {
    const { data } = await storifyApi.get('/api/orders/myOrders');
    return data;
  },

  listOrders: async (): Promise<Order[]> => {
    const { data } = await storifyApi.get(`/api/orders`);
    return data;
  },
}

export default orderService;