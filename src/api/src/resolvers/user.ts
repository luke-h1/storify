import bcrypt from 'bcryptjs';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { User } from '../entities/User';
import { FORGET_PASSWORD_PREFIX } from '../shared/constants';
import { MyContext } from '../types/MyContext';

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    if (req.session.userId === user.id) {
      return user.email;
    }
    return '';
  }

  @FieldResolver(() => String)
  fullName(@Root() user: User) {
    return `${user.firstName} ${user.lastName}`;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req }: MyContext,
  ): Promise<UserResponse> {
    if (newPassword.length <= 7) {
      return {
        errors: [
          {
            field: 'newPassword',
            message: 'New password length must be greater than 7 characters',
          },
        ],
      };
    }
    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);

    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'token expired',
          },
        ],
      };
    }
    const userIdNum = parseInt(userId, 10);
    const user = await User.findOne(userIdNum);
    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'User no longer exists',
          },
        ],
      };
    }
    const decodedPassword = await bcrypt.compare(newPassword, user.password);

    // user is trying to set their password to their old password
    if (decodedPassword) {
      return {
        errors: [
          {
            field: 'newPassword',
            message:
              'You must enter a password that is different from your old password',
          },
        ],
      };
    }
    await User.update(
      { id: userIdNum },
      { password: await bcrypt.hash(newPassword, 12) },
    );
    await redis.del(key);

    // login the user after password change
    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    return User.findOne(req.session.userId);
  }
}
