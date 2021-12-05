import { InputType, Field, Int } from 'type-graphql';

@InputType()
class IdQty {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  qty: number;
}

@InputType()
export class OrderCreateInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  address: string;

  @Field()
  country: string;

  @Field()
  city: string;

  @Field()
  postCode: string;

  @Field(() => [IdQty])
  products: IdQty[];
}
