import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class ReviewCreateInput {
  @Field()
  title: string;

  @Field(() => Int)
  rating: number;

  @Field()
  comment: string;

  @Field(() => Int)
  productId: number;
}
