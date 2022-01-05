/* eslint-disable no-console */
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Product } from '../entities/Product';
import { User } from '../entities/User';
import { ProductCreateInput } from '../inputs/product/ProductCreateInput';
import { ProductUpdateInput } from '../inputs/product/productUpdateInput';
import { isAdmin } from '../middleware/isAdmin';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types/MyContext';
import { stripe } from '../utils/stripe';

@Resolver(Product)
export class ProductResolver {
  @FieldResolver(() => String)
  descriptionSnippet(@Root() product: Product) {
    return product.description.slice(0, 50);
  }

  @FieldResolver(() => User)
  creator(@Root() product: Product, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(product.creatorId);
  }

  @Query(() => [Product], { nullable: true })
  async products(): Promise<Product[]> {
    return Product.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  @Query(() => Product, { nullable: true })
  product(@Arg('id', () => Int) id: number): Promise<Product | undefined> {
    return Product.findOne(id);
  }

  @Mutation(() => Boolean)
  @Authorized(isAuth)
  async likeProduct(
    @Arg('id', () => Int) id: number,
    @Arg('value') value: boolean,
    @Ctx() { req }: MyContext,
  ): Promise<Boolean> {
    try {
      await getConnection()
        .createQueryBuilder()
        .update(Product)
        .set({
          liked: value,
        })
        .where('id = :id and "creatorId" = :creatorId', {
          id,
          creatorId: req.session.userId,
        })
        .returning('*')
        .execute();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  @Mutation(() => Product)
  @Authorized(isAuth)
  async createProduct(
    @Arg('input') input: ProductCreateInput,
    @Ctx() { req }: MyContext,
  ): Promise<Product> {
    // create the product in stripe
    const stripeProduct = await stripe.products.create({
      name: input.name,
      active: true,
      description: input.description,
      images: [input.image],
      type: 'good',
      caption: input.brand,
    });

    // create the price in stripe
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      currency: 'GBP',
      active: true,
      billing_scheme: 'per_unit',
      unit_amount: input.price * 100,
    });

    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values({
        ...input,
        liked: false,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
        creatorId: req.session.userId,
      })
      .returning('*')
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Product, { nullable: true })
  @Authorized(isAuth)
  async updateProduct(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: ProductUpdateInput,
    @Ctx() { req }: MyContext,
  ): Promise<Product | null> {
    const product = await Product.findOne({
      where: { id, creatorId: req.session.userId },
    });

    if (!product) {
      throw new Error('no product');
    }

    const stripeProduct = await stripe.products.update(input.stripeProductId, {
      name: input.name,
      active: true,
      description: input.description,
      images: [input.image],
      caption: input.brand,
    });

    await stripe.prices.update(input.stripePriceId, {
      active: false,
    });

    const newPrice = await stripe.prices.create({
      product: stripeProduct.id,
      currency: 'GBP',
      active: true,
      billing_scheme: 'per_unit',
      unit_amount: input.price * 100,
    });
    // todo: update price in stripe

    const result = await getConnection()
      .createQueryBuilder()
      .update(Product)
      .set({
        ...input,
        creatorId: req.session.userId,
        stripePriceId: newPrice.id,
      })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning('*')
      .execute();
    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @Authorized(isAuth)
  async deleteProduct(
    @Arg('id', () => Int) id: number,
    @Arg('stripeProductId') stripeProductId: string,
    @Ctx() { req }: MyContext,
  ): Promise<boolean> {
    const product = await Product.findOne(id);

    if (product) {
      await stripe.prices.update(product.stripePriceId, {
        active: false,
      });
      await stripe.products.update(stripeProductId, {
        active: false,
      });
      await Product.delete({ id, creatorId: req.session.userId });
    }
    return true;
  }

  @Mutation(() => Boolean)
  @Authorized(isAdmin)
  async deleteProductAsAdmin(
    @Arg('id', () => Int) id: number,
    @Arg('stripeProductId') stripeProductId: string,
  ): Promise<Boolean> {
    const product = await Product.findOne(id);

    if (!product) {
      return false;
    }

    await stripe.prices.update(product.stripePriceId, {
      active: false,
    });

    await stripe.products.update(stripeProductId, {
      active: false,
    });

    await Product.delete({ id });

    return true;
  }

  @Mutation(() => Boolean)
  @Authorized(isAdmin)
  async deleteAllProducts(): Promise<boolean> {
    await Product.delete({});
    return true;
  }
}
