import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class ReviewUpdateInput {
  @Field(() => Int)
  reviewId: number;

  @Field()
  title: string;

  @Field(() => Int)
  rating: number;

  @Field()
  comment: string;
}
