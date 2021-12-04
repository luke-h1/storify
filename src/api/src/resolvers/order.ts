import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Order } from '../entities/Order';
import { OrderCreateInput } from '../inputs/order/OrderCreateInput.ts';
import { MyContext } from '../types/MyContext';

@Resolver(Order)
export class OrderResolver {
  @Mutation(() => Order)
  @Authorized()
  async createOrder(
    @Arg('input') input: OrderCreateInput,
    @Ctx() { req }: MyContext,
  ): Promise<Order> {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Order)
      .values({
        ...input,
        creatorId: req.session.userId,
      })
      .returning('*')
      .execute();
    return result.raw[0];
  }
}
