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

  @Mutation(() => Order)
  @Authorized(isAuth)
  async cancelOrder(
    @Arg('orderId', () => Int) orderId: number,
    @Ctx() { req }: MyContext,
  ): Promise<Order> {
    return Order.findOne({
      where: { creatorId: req.session.userId, id: orderId },
    }) as unknown as Order;
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
      throw new Error('not valid session ');
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

  // @Mutation(() => Order)
  // @Authorized(isAuth)
  // async charge(
  //   @Arg('options') options: ChargeInput,
  //   @Ctx() { req }: MyContext,
  // ): Promise<Order | null> {
  //   try {
  //     const product = await Product.findOne({
  //       where: { id: options.productId },
  //     });

  //     const result = await getConnection()
  //       .createQueryBuilder()
  //       .insert()
  //       .into(Order)
  //       .values({
  //         creatorId: req.session.userId,
  //         email: options.email,
  //         firstName: options.firstName,
  //         lastName: options.lastName,
  //         price: options.amount,
  //         qty: 1,
  //         productTitle: options.productTitle,
  //         completed: false,
  //       })
  //       .returning('*')
  //       .execute();

  //     const source = await stripe.checkout.sessions.create({
  //       payment_method_types: ['card'],
  //       cancel_url:
  //         'http://localhost:3000/checkout/success?source={CHECKOUT_SESSION_ID}',
  //       success_url: 'http://localhost:3000/checkout/success',
  //       mode: 'payment',
  //       line_items: [
  //         {
  //           price: product?.stripePriceId as string,
  //           quantity: 1,
  //         },
  //       ],
  //     });

  //     const { id } = result.raw[0];

  //     await Order.findOne({ where: { id } });

  //     const updatedOrder = await getConnection()
  //       .createQueryBuilder()
  //       .update(Order)
  //       .set({
  //         transactionId: source.id,
  //         completed: true,
  //       })
  //       .where('id = :id', {
  //         id,
  //       })
  //       .returning('*')
  //       .execute();
  //     return updatedOrder.raw[0];
  //   } catch (e) {
  //     console.error(e);
  //     return null;
  //   }
  // }

  // @Query(() => Order)
  // @Authorized(isAuth)
  // async order(
  //   @Arg('id', () => Int) id: number,
  //   @Ctx() { req }: MyContext,
  // ): Promise<Order | undefined> {
  //   return Order.findOne({
  //     where: { id, creatorId: req.session.userId },
  //     loadEagerRelations: true,
  //     transaction: true,
  //     order: {
  //       createdAt: 'DESC',
  //     },
  //   });
  // }

  // @Query(() => [Order])
  // @Authorized(isAuth)
  // async orders(@Ctx() { req }: MyContext) {
  //   const orders = Order.find({
  //     where: { creatorId: req.session.userId },
  //     loadEagerRelations: true,
  //     transaction: true,
  //     order: {
  //       createdAt: 'DESC',
  //     },
  //   });
  //   return orders;
  // }
}
