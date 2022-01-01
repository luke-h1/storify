import { stripe } from 'src/utils/stripe';
import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Order, OrderStatus } from '../entities/Order';
import { Payment } from '../entities/Payment';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types/MyContext';

@Resolver(Payment)
export class PaymentResolver {
  @Mutation(() => Int)
  @Authorized(isAuth)
  async createPayment(
    @Arg('token') token: string,
    @Arg('orderId', () => Int) orderId: number,
    @Ctx() { req }: MyContext,
  ): Promise<number> {
    const order = await Order.findOne({ id: orderId });

    if (!order) {
      throw new Error('no order');
    }

    if (order.creatorId !== req.session.userId) {
      throw new Error('not authorized');
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new Error(
        'cannot pay for a cancelled order, please add this item to the cart again',
      );
    }

    const charge = await stripe.charges.create({
      currency: 'gbp',
      amount: order.total * 100,
      source: token,
    });

    const payment = await Payment.create({
      stripeId: charge.id,
      creatorId: req.session.userId,
      orderId,
    });

    // at this point the user has paid for the product,
    // update the status of the order to completed

    await getConnection()
      .createQueryBuilder()
      .update(Order)
      .set({
        status: OrderStatus.Completed,
      })
      .where({
        creatorId: req.session.userId,
        id: orderId,
      })
      .returning('*')
      .execute();
    return payment.id;
  }
}
