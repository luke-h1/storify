/* eslint-disable no-console */
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  ObjectType,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Order } from '../entities/Order';
import { OrderDetails } from '../entities/OrderDetails';
import { Product } from '../entities/Product';
import { User } from '../entities/User';
import { ProductCreateInput } from '../inputs/product/ProductCreateInput';
import { ProductUpdateInput } from '../inputs/product/ProductUpdateInput';
import { isAdmin } from '../middleware/isAdmin';
import { isAuth } from '../middleware/isAuth';
import { FieldError } from '../shared/FieldError';
import { MyContext } from '../types/MyContext';
import { stripe } from '../utils/stripe';
import { validateProductCreate } from '../validations/productCreate';
import { validateProductUpdate } from '../validations/productUpdate';

@ObjectType()
class ProductResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Product, { nullable: true })
  product?: Product;
}

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
  async products(@Ctx() { req }: MyContext): Promise<Product[]> {
    return Product.find({
      order: {
        createdAt: 'DESC',
      },
      where: {
        creatorId: req.session.userId,
      },
    });
  }

  @Query(() => Product, { nullable: true })
  @Authorized(isAuth)
  product(
    @Ctx() { req }: MyContext,
    @Arg('id', () => Int) id: number,
  ): Promise<Product | undefined> {
    return Product.findOne({ id, creatorId: req.session.userId });
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

  @Mutation(() => ProductResponse)
  @Authorized(isAuth)
  async createProduct(
    @Arg('input') input: ProductCreateInput,
    @Ctx() { req }: MyContext,
  ): Promise<ProductResponse> {
    const errors = validateProductCreate(input);

    if (errors) {
      return {
        errors,
      };
    }

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

  @Mutation(() => ProductResponse, { nullable: true })
  @Authorized(isAuth)
  async updateProduct(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: ProductUpdateInput,
    @Ctx() { req }: MyContext,
  ): Promise<ProductResponse> {
    const product = await Product.findOne({
      where: { id, creatorId: req.session.userId },
    });

    if (!product) {
      return {
        errors: [
          {
            field: 'name',
            message: 'No product exists with that ID',
          },
        ],
      };
    }
    const errors = validateProductUpdate(input);

    if (errors) {
      return {
        errors,
      };
    }

    const stripeProduct = await stripe.products.update(input.stripeProductId, {
      name: input.name,
      active: true,
      description: input.description,
      images: [input.image],
      caption: input.brand,
    });

    // cannot delete prices in stripe, only archive them
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
    const product = await Product.findOne({
      id,
      creatorId: req.session.userId,
    });
    if (!product) {
      return false;
    }

    await stripe.prices.update(product.stripePriceId, {
      active: false,
    });

    await stripe.products.update(stripeProductId, {
      active: false,
    });

    const orderDetails = await OrderDetails.findOne({ productId: id });

    if (orderDetails) {
      await Order.delete({ id: orderDetails.orderId });
    }

    await Product.delete({ id });

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

    const order = await OrderDetails.findOne({ productId: id });

    if (!order) {
      throw new Error('no order');
    }

    await Order.delete({ id: order.orderId });

    await OrderDetails.delete({ productId: id });

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
