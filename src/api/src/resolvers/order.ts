/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { Product } from '../entities/Product';
import { OrderCreateInput } from '../inputs/order/OrderCreateInput';
import { MyContext } from '../types/MyContext';

@Resolver(Order)
export class OrderResolver {
  @Query(() => [Order])
  async orders(@Ctx() { req }: MyContext) {
    const orders = await getConnection().query(
      `
      SELECT o.* FROM "orders" o 
      ORDER BY o."createdAt" DESC
      `,
    );
    return orders;
  }

  // This is broken
  @Mutation(() => Order)
  // @Authorized()
  async createOrder(
    @Arg('input') input: OrderCreateInput,
    @Ctx() { req }: MyContext,
  ) {
    try {
      const orderResult = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Order)
        .values({
          ...input,
          creatorId: 1,
        })
        .returning('*')
        .execute();

      const product = await Product.findOne({ id: input.productId });

      if (!product) {
        throw new Error('No product!');
      }

      const orderItems = await getConnection()
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

      return {
        orders: orderResult.raw[0],
        orderItems: orderItems.raw[0],
      };
    } catch (e) {
      console.error(e);
    }
    return false;
  }
}
