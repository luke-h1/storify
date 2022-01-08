import Stripe from 'stripe';
import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Order, OrderStatus } from '../entities/Order';
import { Payment } from '../entities/Payment';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types/MyContext';
import { stripe } from '../utils/stripe';

@Resolver(Payment)
export class PaymentResolver {
  @Mutation(() => Payment)
  @Authorized(isAuth)
  async createPayment(
    @Arg('orderId', () => Int) orderId: number,
    @Ctx() { req }: MyContext,
  ): Promise<Payment> {
    const order = await Order.findOne({
      relations: ['orderDetails', 'orderDetails.product'],
      where: {
        id: orderId,
      },
    });

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

    // eslint-disable-next-line camelcase
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (let i = 0; i < order.orderDetails.length; i += 1) {
      // eslint-disable-next-line camelcase
      line_items.push({
        name: order.orderDetails[i].product.name,
        currency: 'gbp',
        description: order.orderDetails[i].product.description,
        images: [order.orderDetails[i].product.image],
        quantity: order.orderDetails[i].quantity,
        amount: order.total * 100,
      });
    }

    const source = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      cancel_url: 'http://localhost:3000/checkout/error',
      success_url:
        'http://localhost:3000/checkout/success?source={CHECKOUT_SESSION_ID}',
      mode: 'payment',
      // eslint-disable-next-line camelcase
      line_items,
    });

    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Payment)
      .values({
        stripeTransactionId: source.id,
        creatorId: req.session.userId,
        orderId: order.id,
      })
      .returning('*')
      .execute();

    await getConnection()
      .createQueryBuilder()
      .update(Order)
      .set({
        status: source.status as string,
        creatorId: req.session.userId,
        paymentId: source.id,
      })
      .where({
        creatorId: req.session.userId,
        id: orderId,
      })
      .returning('*')
      .execute();

    return result.raw[0];
  }
}
