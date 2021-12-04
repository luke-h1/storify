import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Order } from '../entities/Order';
import { CreateOrderInput } from '../inputs/order/CreateOrderInput';

@Resolver(Order)
export class OrderResolver {
  @Query(() => [Order])
  async orders(): Promise<Order[]> {
    const orders = await getConnection().query(
      `
        SELECT o.* FROM "orders" o 
        ORDER BY o."createdAt" DESC
      `,
    );
    return orders;
  }

  // @Mutation(() => Order)
  // @Authorized()
  // async createOrder(@Arg('input') input: CreateOrderInput): Promise<Order[]> {
  //   // user..
  // }
}
