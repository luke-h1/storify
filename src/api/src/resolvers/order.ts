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
import { ChargeInput } from '../inputs/order/ChargeInput';
import { MyContext } from '../types/MyContext';
import { stripe } from '../utils/stripe';

@Resolver(Order)
export class OrderResolver {
  @Mutation(() => Boolean)
  @Authorized()
  async charge(
    @Arg('options') options: ChargeInput,
    @Ctx() { req }: MyContext,
  ): Promise<boolean> {
    try {
      const payment = await stripe.paymentIntents.create({
        amount: options.amount * 100, // send to stripe in pence
        currency: 'GBP',
        description: options.description,
        payment_method: options.id,
        confirm: true, // charge the card right away
      });
      console.log(payment);

      await getConnection()
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
          completed: true,
        })
        .returning('*')
        .execute();

      return true;
    } catch (e) {
      console.error(e);
      return false;
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
