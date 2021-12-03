import { Field, InputType } from 'type-graphql';

@InputType()
export class ProductCreateInput {
  @Field()
  name: string;

  @Field()
  image: string;

  @Field()
  brand: string;

  @Field(() => [String])
  categories: string[];

  @Field()
  description: string;

  @Field()
  price: number;
}
