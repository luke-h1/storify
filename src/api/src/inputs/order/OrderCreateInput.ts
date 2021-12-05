import { InputType, Field, Int, InterfaceType } from 'type-graphql';

@InterfaceType()
abstract class OrderProducts {
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

  @Field(() => [OrderProducts])
  products: {
    productId: number;
    qty: number;
  }[];
}
