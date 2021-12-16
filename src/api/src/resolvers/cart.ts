import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Cart } from '../entities/Cart';
import { CartCreateInput } from '../inputs/cart/CartCreateInput';
import { MyContext } from '../types/MyContext';

@Resolver()
export class CartResolver {
  @Mutation(() => Boolean)
  async createCart(
    @Arg('input') input: CartCreateInput,
    @Ctx() { req }: MyContext,
  ): Promise<Boolean> {
    // check product id
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Cart)
      .values({
        ...input,
        creatorId: req.session.userId,
      })
      .returning('*')
      .execute();
    return true;
  }
}
