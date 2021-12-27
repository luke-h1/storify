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
import { OrderItem } from '../entities/OrderItem';
import { Product } from '../entities/Product';
import { OrderCreateInput } from '../inputs/order/OrderCreateInput';
import { MyContext } from '../types/MyContext';

@Resolver(Order)
export class OrderResolver {
  @Query(() => Order)
  @Authorized()
  async order(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext,
  ): Promise<Order | undefined> {
    return Order.findOne({
      relations: ['orderItems'],
      where: { creatorId: req.session.userId, id },
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
      relations: ['orderItems'],
      where: { creatorId: req.session.userId },
      loadEagerRelations: true,
      transaction: true,
      order: {
        createdAt: 'DESC',
      },
    });
    return orders;
  }

  @Mutation(() => Boolean)
  @Authorized()
  async createOrder(
    @Arg('input') input: OrderCreateInput,
    @Ctx() { req }: MyContext,
  ): Promise<boolean> {
    try {
      const orderResult = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Order)
        .values({
          ...input,
          creatorId: req.session.userId,
        })
        .returning('*')
        .execute();

      const product = await Product.findOne({ id: input.productId });

      // todo: better error handling here

      if (!product) {
        throw new Error('No product!');
      }

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(OrderItem)
        .values({
          order: orderResult.raw[0],
          productTitle: product.name,
          price: product.price,
          qty: input.qty,
        })
        .returning('*')
        .execute();

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  @Mutation(() => Boolean)
  @Authorized()
  async updateOrder(
    @Arg('input') input: OrderCreateInput,
    @Arg('id') id: number,
    @Ctx() { req }: MyContext,
  ): Promise<Order | null> {
    try {
      const orderResult = await getConnection()
        .createQueryBuilder()
        .update(Order)
        .set({
          ...input,
          creatorId: req.session.userId,
        })
        .where('id = :id and "creatorId" = :creatorId', {
          id,
          creatorId: req.session.userId,
        })
        .returning('*')
        .execute();

      const product = await Product.findOne({ id: input.productId });

      if (!product) {
        throw new Error('No product!');
      }

      await getConnection()
        .createQueryBuilder()
        .update(OrderItem)
        .set({
          order: orderResult.raw[0],
          productTitle: product.name,
          price: product.price,
          qty: input.qty,
        })
        .returning('*')
        .execute();

      return orderResult.raw[0];
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  @Mutation(() => Boolean)
  @Authorized()
  async deleteOrder(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext,
  ): Promise<boolean> {
    const order = await Order.findOne(id);

    if (order) {
      await Order.delete({ id, creatorId: req.session.id });
    }
    return true;
  }
}
