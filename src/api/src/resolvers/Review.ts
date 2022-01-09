/* eslint-disable no-console */
import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Resolver,
  Int,
  ObjectType,
  Field,
  Query,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Product } from '../entities/Product';
import { Review } from '../entities/Review';
import { ReviewCreateInput } from '../inputs/review/ReviewCreateInput';
import { ReviewUpdateInput } from '../inputs/review/ReviewUpdateInput';
import { isAuth } from '../middleware/isAuth';
import { FieldError } from '../shared/FieldError';
import { MyContext } from '../types/MyContext';
import { validateReviewCreate } from '../validations/reviewCreate';
import { validateReviewUpdate } from '../validations/reviewUpdate';

@ObjectType()
class ReviewResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Review, { nullable: true })
  review?: Review;
}

@Resolver(Review)
export class ReviewResolver {
  @Query(() => [Review], { nullable: true })
  @Authorized(isAuth)
  async reviews(
    @Arg('productId', () => Int) productId: number,
  ): Promise<Review[]> {
    return Review.find({
      order: {
        createdAt: 'DESC',
      },
      where: {
        productId,
      },
    });
  }

  @Query(() => Review, { nullable: true })
  @Authorized(isAuth)
  async review(@Arg('id', () => Int) id: number): Promise<Review | undefined> {
    const review = Review.findOne({ id });

    if (!review) {
      return undefined;
    }
    return review;
  }

  @Mutation(() => ReviewResponse)
  @Authorized(isAuth)
  async createReview(
    @Ctx() { req }: MyContext,
    @Arg('input') input: ReviewCreateInput,
  ): Promise<ReviewResponse> {
    const product = await Product.findOne({ id: input.productId });

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

    const errors = validateReviewCreate(input);

    if (errors) {
      return {
        errors,
      };
    }

    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Review)
      .values({
        ...input,
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
    @Arg('input') input: ReviewUpdateInput,
  ): Promise<ReviewResponse> {
    const review = await Review.findOne({ id: input.reviewId });

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
    const errors = validateReviewUpdate(input);

    if (errors) {
      return {
        errors,
      };
    }

    const result = await getConnection()
      .createQueryBuilder()
      .update(Review)
      .set({
        title: input.title,
        rating: input.rating,
        comment: input.comment,
      })
      .where('id = :id and "creatorId" = :creatorId', {
        id: input.reviewId,
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
