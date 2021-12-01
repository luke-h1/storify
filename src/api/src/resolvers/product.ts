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
import { MyContext } from '../types/MyContext';

@Resolver(Product)
export class productResolver {
  @FieldResolver(() => String)
  descriptionSnippet(@Root() product: Product) {
    return product.description.slice(0, 50);
  }

  @FieldResolver(() => User)
  creator(@Root() product: Product, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(product.creatorId);
  }

  @Query(() => [Product])
  async products(): Promise<Product[]> {
    const products = await getConnection().query(
      `
      SELECT p.* FROM "products" p
      ORDER BY p."createdAt" DESC
      `,
    );
    return products;
  }

  @Query(() => Product, { nullable: true })
  product(@Arg('id', () => Int) id: number): Promise<Product | undefined> {
    return Product.findOne(id);
  }

  @Mutation(() => Product)
  @Authorized()
  async createProduct(
    @Arg('input') input: ProductCreateInput,
    @Ctx() { req }: MyContext,
  ): Promise<Product> {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values({
        ...input,
        creatorId: req.session.userId,
      })
      .returning('*')
      .execute();
    return result.raw[0];
  }

  @Mutation(() => Product, { nullable: true })
  @Authorized()
  async updateProduct(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: ProductCreateInput,
    @Ctx() { req }: MyContext,
  ): Promise<Product | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Product)
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
    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @Authorized()
  async deleteProduct(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext,
  ): Promise<boolean> {
    const product = await Product.findOne(id);
    if (product) {
      await Product.delete({ id, creatorId: req.session.userId });
    }
    return true;
  }
}
