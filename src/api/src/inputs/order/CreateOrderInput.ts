import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateOrderInput {
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
  zip: string;
}
