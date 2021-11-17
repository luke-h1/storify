import { InputType, Field } from 'type-graphql';
import { UsernamePasswordInput } from "./UsernamePasswordInput";


@InputType()
export class UserRegisterInput extends UsernamePasswordInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;
  
  @Field()
  bio: string;
}
