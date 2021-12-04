import { InputType, Field } from 'type-graphql';

@InputType()
export class OrderCreateInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  country: string;

  @Field(() => String)
  postalCode: string;
}
