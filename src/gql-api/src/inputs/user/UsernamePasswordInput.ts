import { Field, InputType } from 'type-graphql';

@InputType()
export class UsernamePasswordInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
