/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
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
import { MyContext } from '../types/MyContext';
import { stripe } from '../utils/stripe';

@Resolver(Order)
export class OrderResolver {
  @Mutation(() => Order)
  @Authorized()
  async charge(
    @Arg('options') options: ChargeInput,
    @Ctx() { req }: MyContext,
  ): Promise<Order | null> {
    try {
      const product = await Product.findOne({
        where: { id: options.productId },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Order)
        .values({
          creatorId: req.session.userId,
          email: options.email,
          firstName: options.firstName,
          lastName: options.lastName,
          price: options.amount,
          qty: 1,
          productTitle: options.productTitle,
          completed: false,
        })
        .returning('*')
        .execute();

      const source = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        cancel_url:
          'http://localhost:3000/checkout/success?source={CHECKOUT_SESSION_ID}',
        success_url: 'http://localhost:3000/checkout/success',
        mode: 'payment',
        line_items: [
          {
            price: product?.stripePriceId as string,
            quantity: 1,
          },
        ],
      });

      const { id } = result.raw[0];

      await Order.findOne({ where: { id } });

      const updatedOrder = await getConnection()
        .createQueryBuilder()
        .update(Order)
        .set({
          transactionId: source.id,
          completed: true,
        })
        .where('id = :id', {
          id,
        })
        .returning('*')
        .execute();
      return updatedOrder.raw[0];
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  @Query(() => Order)
  @Authorized()
  async order(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext,
  ): Promise<Order | undefined> {
    return Order.findOne({
      where: { id, creatorId: req.session.userId },
      loadEagerRelations: true,
      transaction: true,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  @Query(() => [Order])
  @Authorized()
  async orders(@Ctx() { req }: MyContext) {
    const orders = Order.find({
      where: { creatorId: req.session.userId },
      loadEagerRelations: true,
      transaction: true,
      order: {
        createdAt: 'DESC',
      },
    });
    return orders;
  }
}
