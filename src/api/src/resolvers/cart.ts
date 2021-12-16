import { Arg, Ctx, Mutation, Resolver, Query } from 'type-graphql';
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
    // TODO: add validation. check product id
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

  @Query(() => Cart)
  async myCart(@Ctx() { req }: MyContext): Promise<Cart[]> {
    return Cart.find({ where: { creatorId: req.session.userId } });
  }
}
