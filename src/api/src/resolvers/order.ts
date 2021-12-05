/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import Stripe from 'stripe';
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { Product } from '../entities/Product';
import { OrderCreateInput } from '../inputs/order/OrderCreateInput';
import { MyContext } from '../types/MyContext';

@Resolver(Order)
export class OrderResolver {
  @Mutation(() => Order)
  @Authorized()
  async createOrder(
    @Arg('input') input: OrderCreateInput,
    @Ctx() { req }: MyContext,
  ): Promise<boolean> {
    const queryRunner = getConnection().createQueryRunner();

    try {
      const o = new Order();

      o.creatorId = req.session.userId;
      o.firstName = input.firstName;
      o.lastName = input.lastName;
      o.email = input.email;
      o.address = input.address;
      o.country = input.country;
      o.city = input.city;
      o.postCode = input.postCode;

      const order = await queryRunner.manager.save(o);

      const lineItems = [];

      for (const i of input.products) {
        const product = await Product.findOne({ id: i.productId });

        if (!product) {
          console.log('no product');
        }

        const orderItem = new OrderItem();

        orderItem.order = order;
        orderItem.productTitle = product?.name as string;
        orderItem.price = product?.price as number;
        orderItem.qty = i.qty;

        await queryRunner.manager.save(orderItem);

        lineItems.push({
          name: product?.name,
          description: product?.description,
          image: product?.image,
          amount: 100 * (product?.price as number),
          currency: 'gbp',
          quantity: i.qty,
        });
      }

      // stripe
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2020-08-27',
        maxNetworkRetries: 5,
      });
      const source = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: `http://localhost:3000/checkout/success?source={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/checkout/error`,
      });
      order.transactionId = source.id;

      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return true;
  }
}
