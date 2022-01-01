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
import { Order } from '../entities/Order';
import { Product } from '../entities/Product';
import { ChargeInput } from '../inputs/order/ChargeInput';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types/MyContext';

@Resolver(Order)
export class OrderResolver {
  @Mutation(() => Order, { nullable: true })
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
      relations: ['user', 'order_details'],
      where: { creatorId: req.session.userId },
    });
    return orders;
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
