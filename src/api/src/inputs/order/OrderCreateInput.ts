import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class OrderCreateInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  qty: number;
}
