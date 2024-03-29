/* eslint-disable consistent-return */
/* eslint-disable no-console */
import bcrypt from 'bcryptjs';
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { v4 } from 'uuid';
import { User } from '../entities/User';
import { UserRegisterInput } from '../inputs/user/UserRegisterInput';
import { isAdmin } from '../middleware/isAdmin';
import { isAuth } from '../middleware/isAuth';
import emailService from '../services/emailService';
import { FieldError } from '../shared/FieldError';
import { FORGET_PASSWORD_PREFIX, COOKIE_NAME } from '../shared/constants';
import { MyContext } from '../types/MyContext';
import { validateRegister } from '../validations/register';

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
            message:
              'New password length must be greater than or equal to 7 characters',
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

  @Query(() => [User], { nullable: true })
  @Authorized(isAdmin)
  async users() {
    const users = await User.find({
      order: {
        createdAt: 'DESC',
      },
    });
    return users;
  }

  @Query(() => User, { nullable: true })
  @Authorized(isAdmin)
  user(@Arg('id', () => Int) id: number) {
    return User.findOne({
      where: { id },
    });
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    // not logged in
    if (!req.session.userId) {
      return null;
    }
    return User.findOne(req.session.userId);
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext,
  ) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return false;
    }
    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 * 3, // 3 days to reset pwd
    );

    await emailService.sendEmail(
      'noreply@storify.com',
      email,
      'Storify | Forgot password',
      `<div><h1>Change password | Storify</h1><a href="${process.env.FRONTEND_URL}/change-password/${token}">Reset password</a>
    </div>
    `,
      `Reset your storify password at ${process.env.FRONTEND_URL}/change-password/${token}`,
    );
    return true;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UserRegisterInput,
    @Ctx() { req }: MyContext,
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await bcrypt.hash(options.password, 12);
    let user;

    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          firstName: options.firstName,
          lastName: options.lastName,
          email: options.email,
          password: hashedPassword,
        })
        .returning('*')
        .execute();

      // eslint-disable-next-line prefer-destructuring
      user = result.raw[0];
    } catch (e) {
      if (e.code === '23505') {
        return {
          errors: [
            {
              field: 'email',
              message: 'email already taken',
            },
          ],
        };
      }
    }
    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext,
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Email not found',
          },
        ],
      };
    }
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Invalid email / password combination',
          },
        ],
      };
    }
    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise(resolve =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      req.session.destroy((e: never) => {
        res.clearCookie(COOKIE_NAME);
        if (e) {
          resolve(false);
          return {
            errors: [
              {
                message: `Problem logging out ${e}`,
              },
            ],
          };
        }
        resolve(true);
      }),
    );
  }

  @Mutation(() => Boolean)
  @Authorized(isAuth)
  async deleteMyAccount(@Ctx() { req }: MyContext): Promise<Boolean> {
    const user = await User.findOne({ id: req.session.userId });

    if (!user) {
      return false;
    }

    await User.delete({ id: req.session.userId });
    return true;
  }

  @Mutation(() => Boolean)
  @Authorized(isAdmin)
  async makeUserAdmin(@Arg('id', () => Int) id: number): Promise<Boolean> {
    const user = await User.find({ id });

    if (!user) {
      return false;
    }
    await User.update(
      { id },
      {
        isAdmin: true,
      },
    );

    return true;
  }

  @Mutation(() => Boolean)
  @Authorized(isAdmin)
  async makeUserRegularUser(
    @Arg('id', () => Int) id: number,
  ): Promise<Boolean> {
    const user = await User.find({ id });

    if (!user) {
      return false;
    }

    await User.update(
      { id },
      {
        isAdmin: false,
      },
    );
    return true;
  }

  @Mutation(() => Boolean)
  @Authorized(isAdmin)
  async deleteUserAsAdmin(@Arg('id', () => Int) id: number): Promise<Boolean> {
    const user = await User.find({ id });

    if (!user) {
      return false;
    }

    await User.delete({ id });
    return true;
  }
}
