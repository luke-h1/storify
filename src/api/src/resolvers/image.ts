import {
  ObjectType,
  Field,
  Int,
  Resolver,
  Mutation,
  Authorized,
} from 'type-graphql';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudinary = require('cloudinary').v2;

@ObjectType()
class ImageSignature {
  @Field(() => String)
  signature!: string;

  @Field(() => Int)
  timestamp!: number;
}

@Resolver()
export class ImageResolver {
  @Authorized()
  @Mutation(() => ImageSignature)
  createImageSignature(): ImageSignature {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature: string = cloudinary.utils.api_sign_request(
      {
        timestamp,
      },
      process.env.CLOUDINARY_SECRET,
    );
    return { timestamp, signature };
  }
}
