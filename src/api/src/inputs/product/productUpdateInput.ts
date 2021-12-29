import { Field, InputType } from 'type-graphql';
import { ProductCreateInput } from './ProductCreateInput';

@InputType()
export class ProductUpdateInput extends ProductCreateInput {
  @Field()
  stripeProductId: string;
}
