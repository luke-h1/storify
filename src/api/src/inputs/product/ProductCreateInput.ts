import { Field, InputType } from 'type-graphql';

@InputType()
export class ProductCreateInput {
  @Field()
  name: string;

  @Field()
  image: string;

  @Field()
  brand: string;

  @Field()
  category: string;

  @Field()
  description: string;

  @Field()
  price: number;
}
