import { InputType, Field, Int, InterfaceType, ObjectType } from 'type-graphql';

@ObjectType()
abstract class ProductArrType {
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

  @Field(() => [ProductArrType])
  products: ProductArrType[];
}
