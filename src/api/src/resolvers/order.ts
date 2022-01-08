/* eslint-disable no-console */

import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Cart } from '../entities/Cart';
import { Order, OrderStatus } from '../entities/Order';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types/MyContext';
import { stripe } from '../utils/stripe';

@Resolver(Order)
export class OrderResolver {
  @Mutation(() => Order)
  @Authorized(isAuth)
  async createOrder(
    @Arg('total', () => Int) total: number,
    @Ctx() { req }: MyContext,
  ): Promise<Order> {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Order)
      .values({
        creatorId: req.session.userId,
        status: OrderStatus.AwaitingPayment,
        total,
      })
      .returning('*')
      .execute();

    // remove products from cart when user has ordered them
    await Cart.delete({
      creatorId: req.session.userId,
    });

    return result.raw[0];
  }

  @Query(() => [Order])
  @Authorized(isAuth)
  async orders(@Ctx() { req }: MyContext): Promise<Order[]> {
    const orders = await Order.find({
      relations: ['orderDetails', 'orderDetails.product'],
      loadEagerRelations: true,
      where: { creatorId: req.session.userId },
    });
    return orders;
  }

  @Query(() => Order)
  @Authorized(isAuth)
  async order(
    @Ctx() { req }: MyContext,
    @Arg('paymentId') paymentId: string,
  ): Promise<Order | null> {
    const order = await Order.findOne({
      paymentId,
      creatorId: req.session.userId,
    });

    if (!order) {
      return null;
    }
    return order;
  }

  @Mutation(() => Order)
  @Authorized(isAuth)
  async updateOrderStatus(
    @Ctx() { req }: MyContext,
    @Arg('paymentId', () => String) paymentId: string,
  ): Promise<Order> {
    const order = await Order.findOne({
      where: {
        creatorId: req.session.userId,
        paymentId,
      },
    });

    if (!order) {
      throw new Error('no order with that payment ID');
    }

    const session = await stripe.checkout.sessions.retrieve(paymentId);

    if (!session) {
      throw new Error('not valid session');
    }

    // update order status
    const updatedOrder = await getConnection()
      .createQueryBuilder()
      .update(Order)
      .set({
        status: OrderStatus.Completed,
      })
      .where('paymentId = :paymentId and "creatorId" = :creatorId', {
        paymentId,
        creatorId: req.session.userId,
      })
      .returning('*')
      .execute();

    return updatedOrder.raw[0];
  }
}
