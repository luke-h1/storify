import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Wishlist } from '../entities/Wishlist';
import { MyContext } from '../types/MyContext';

@Resolver(Wishlist)
export class WishlistResolver {
  @Mutation(() => Boolean)
  async createWishlist(
    @Arg('productId', () => Int) productId: number,
    @Ctx() { req }: MyContext,
  ): Promise<Boolean> {
    const wishlist = await Wishlist.findOne({
      productId,
      creatorId: req.session.userId,
    });

    if (wishlist) {
      // user wants to remove product from their wishlist
      await Wishlist.delete({ productId, creatorId: req.session.userId });
      return true;
    }
    // user wants to add product to their wishlist
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Wishlist)
      .values({
        productId,
        creatorId: req.session.userId,
      })
      .returning('*')
      .execute();
    return true;
  }

  @Query(() => [Wishlist])
  async wishlists(@Ctx() { req }: MyContext): Promise<Wishlist[]> {
    return Wishlist.find({
      where: { creatorId: req.session.userId },
      relations: ['product'],
    });
  }

  @Query(() => Wishlist)
  async wishlist(
    @Ctx() { req }: MyContext,
    @Arg('productId', () => Int) productId: number,
  ): Promise<Wishlist> {
    return Wishlist.findOne({
      relations: ['product'],
      where: { productId, creatorId: req.session.userId },
    }) as unknown as Wishlist;
  }
}
