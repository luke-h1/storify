/* eslint-disable no-console */
import { MyContext } from 'src/types/MyContext';
import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Resolver,
  Int,
  ObjectType,
  Field,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Product } from '../entities/Product';
import { Review } from '../entities/Review';
import { isAuth } from '../middleware/isAuth';
import { FieldError } from '../shared/FieldError';

@ObjectType()
class ReviewResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Review, { nullable: true })
  review?: Review;
}

@Resolver(Review)
export class ReviewResolver {
  @Mutation(() => ReviewResponse)
  @Authorized(isAuth)
  async createReview(
    @Ctx() { req }: MyContext,
    @Arg('title') title: string,
    @Arg('rating', () => Int) rating: number,
    @Arg('comment') comment: string,
    @Arg('productId', () => Int) productId: number,
  ): Promise<ReviewResponse> {
    const product = await Product.findOne({ id: productId });

    if (!product) {
      return {
        errors: [
          {
            field: 'title',
            message: 'No product with that ID exists',
          },
        ],
      };
    }
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Review)
      .values({
        title,
        comment,
        rating,
        productId,
        creatorId: req.session.userId,
      })
      .returning('*')
      .execute();
    return result.raw[0];
  }

  @Mutation(() => ReviewResponse)
  @Authorized(isAuth)
  async updateReview(
    @Ctx() { req }: MyContext,
    @Arg('reviewId', () => Int) reviewId: number,
    @Arg('title') title: string,
    @Arg('rating', () => Int) rating: number,
    @Arg('comment') comment: string,
  ): Promise<ReviewResponse> {
    const review = await Review.findOne({ id: reviewId });

    if (!review) {
      return {
        errors: [
          {
            field: 'title',
            message: 'No review exists with this ID',
          },
        ],
      };
    }
    const result = await getConnection()
      .createQueryBuilder()
      .update(Review)
      .set({
        title,
        rating,
        comment,
      })
      .where('id = :id and "creatorId" = :creatorId', {
        id: reviewId,
        creatorId: req.session.userId,
      })
      .returning('*')
      .execute();
    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @Authorized(isAuth)
  async deleteReview(
    @Ctx() { req }: MyContext,
    @Arg('id', () => Int) id: number,
  ): Promise<Boolean> {
    try {
      await Review.delete({ id, creatorId: req.session.userId });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
