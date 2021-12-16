import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CartCreateInput {
  @Field()
  name: string;

  @Field()
  image: string;

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  qty: number;
}
