/* eslint-disable no-console */
import bcrypt from 'bcryptjs';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
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
import { getConnection } from 'typeorm';
import { v4 } from 'uuid';
import { User } from '../entities/User';
import { UserRegisterInput } from '../inputs/user/UserRegisterInput';
import { FORGET_PASSWORD_PREFIX, COOKIE_NAME } from '../shared/constants';
import { MyContext } from '../types/MyContext';
import { upload } from '../utils/s3';
import { validateRegister } from '../validations/register';

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

    // user has 3 days to get a token to reset their password

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 * 3,
    );

    // todo: setup SES email service here
    // todo: send email here
    return true;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UserRegisterInput,
    @Arg('image', () => GraphQLUpload, { nullable: true }) image: FileUpload,
    @Ctx() { req, res }: MyContext,
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await bcrypt.hash(options.password, 12);
    let user;
    const singleUpload = upload.single('image');

    try {
      const s3img = singleUpload(req, res, function (e) {
        if (e) {
          return {
            errors: [
              {
                field: 'image',
                message: `Problem uploading image ${e}`,
              },
            ],
          };
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const uploadedImage = req?.file?.location;
        console.log(uploadedImage);
      });

      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          firstName: options.firstName,
          lastName: options.lastName,
          bio: options.bio,
          email: options.email,
          password: hashedPassword,
          image: '',
          s3ImageFileName: '',
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
      console.error(e);
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
            field: 'password',
            message: 'Incorrect credentials',
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
    // eslint-disable-next-line consistent-return
    return new Promise((resolve) => req.session.destroy((e: unknown) => {
      res.clearCookie(COOKIE_NAME);
      if (e) {
        resolve(false);
        return {
          errors: [
            {
              field: '',
              message: `Problem logging out ${e}`
            }
          ]
        }
      }
      resolve(true);
    }));
  }
}
