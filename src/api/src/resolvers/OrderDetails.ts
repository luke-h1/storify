import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Order } from '../entities/Order';
import { OrderDetails } from '../entities/OrderDetails';
import { Product } from '../entities/Product';
import { MyContext } from '../types/MyContext';
import { FieldError } from './User';

@ObjectType()
class OrderDetailsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => OrderDetails, { nullable: true })
  orderDetails?: OrderDetails;
}

@Resolver(OrderDetails)
export class OrderDetailsResolver {
  @Query(() => OrderDetails, { nullable: true })
  async OrderDetail(
    @Arg('orderId', () => Int) orderId: number,
  ): Promise<OrderDetails | undefined> {
    return OrderDetails.findOne({
      where: { orderId },
      relations: ['product', 'order'],
    });
  }

  @Query(() => [OrderDetails])
  async OrderDetails(): Promise<OrderDetails[]> {
    return OrderDetails.find({
      relations: ['product', 'order'],
    });
  }

  @Mutation(() => OrderDetailsResponse)
  async createOrderDetails(
    @Arg('quantity', () => Int) quantity: number,
    @Arg('orderId', () => Int) orderId: number,
    @Arg('productId', () => Int) productId: number,
    @Ctx() { req }: MyContext,
  ): Promise<OrderDetailsResponse> {
    const order = await Order.findOne({ id: orderId });

    if (!order) {
      return {
        errors: [
          {
            field: 'orderId',
            message: 'No order with that ID',
          },
        ],
      };
    }
    const product = await Product.findOne({ id: productId });

    if (!product) {
      return {
        errors: [
          {
            field: 'productId',
            message: 'No product with that ID',
          },
        ],
      };
    }

    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(OrderDetails)
      .values({
        creatorId: req.session.userId,
        quantity,
        orderId,
        productId,
      })
      .returning('*')
      .execute();

    return {
      orderDetails: result.raw[0],
    };
  }
}
