import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  ObjectType,
  Field,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Cart } from '../entities/Cart';
import { Product } from '../entities/Product';
import { User } from '../entities/User';
import { MyContext } from '../types/MyContext';
import { FieldError } from './user';

@ObjectType()
class CartResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Cart, { nullable: true })
  cart?: Cart;
}

@Resolver(Cart)
export class CartResolver {
  @FieldResolver(() => User)
  creator(@Root() cart: Cart, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(cart.creatorId);
  }

  @Query(() => [Cart])
  async carts(): Promise<Cart[]> {
    return Cart.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['product'],
    });
  }

  @Mutation(() => Boolean)
  async createCart(
    @Arg('productId', () => Int) productId: number,
    @Arg('quantity', () => Int) quantity: number,
    @Ctx() { req }: MyContext,
  ): Promise<Boolean> {
    const product = await Product.findOne({ id: productId });

    if (!product) {
      throw new Error('no product');
    }
    // if a product already exists, update the qty by 1
    const existingCart = await Cart.findOne({
      where: {
        productId,
        creatorId: req.session.userId,
      },
    });

    if (existingCart) {
      await getConnection()
        .createQueryBuilder()
        .update(Cart)
        .set({
          quantity: quantity + 1,
        })
        .where({ productId, creatorId: req.session.userId })
        .returning('*')
        .execute();
    } else {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Cart)
        .values({
          productId,
          creatorId: req.session.userId,
          quantity,
        })
        .returning('*')
        .execute();
    }

    return true;
  }

  @Mutation(() => CartResponse)
  async updateCartQuantity(
    @Arg('id', () => Int) id: number,
    @Arg('quantity', () => Int) quantity: number,
    @Ctx() { req }: MyContext,
  ): Promise<CartResponse> {
    const cart = await Cart.findOne({
      where: { id, creatorId: req.session.userId },
    });

    if (!cart) {
      return {
        errors: [
          {
            field: 'quantity',
            message: 'no cart with that ID',
          },
        ],
      };
    }

    const result = await getConnection()
      .createQueryBuilder()
      .update(Cart)
      .set({
        quantity,
      })
      .where({ id, creatorId: req.session.userId })
      .returning('*')
      .execute();

    const updatedCart = result.raw[0];

    return {
      cart: updatedCart,
    };
  }

  @Mutation(() => Boolean)
  async deleteCart(@Ctx() { req }: MyContext): Promise<Boolean> {
    await Cart.delete({ creatorId: req.session.userId });
    return true;
  }
}
