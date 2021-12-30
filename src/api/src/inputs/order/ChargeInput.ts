import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class ChargeInput {
  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  productTitle: string;

  @Field(() => Int)
  amount: number;

  @Field()
  description: string;

  @Field(() => Int)
  productId: number;
}
