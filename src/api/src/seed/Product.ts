/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import 'dotenv-safe/config';
import { randomInt } from 'crypto';
import { getManager } from 'typeorm';
import createConn from '../db/createConn';
import { Product } from '../entities/Product';
import { User } from '../entities/User';
import { stripe } from '../utils/stripe';
import { productData } from './data/products';

(async () => {
  try {
    await createConn();

    const userRepository = getManager().getRepository(User);
    const productRepository = getManager().getRepository(Product);

    for (let i = 0; i < 24; i += 1) {
      const user = await userRepository.findOne({
        where: { id: randomInt(2, 25) },
      });
      if (!user) {
        throw new Error(`user ${i} not found `);
      }

      // create the product in stripe
      const stripeProduct = await stripe.products.create({
        name: productData[i].name,
        active: true,
        description: productData[i].description,
        images: [productData[i].image],
        type: 'good',
        caption: productData[i].description,
      });

      // create the price in stripe
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        currency: 'GBP',
        active: true,
        billing_scheme: 'per_unit',
        unit_amount: productData[i].price * 100,
      });

      const product = await productRepository.save({
        creator: user,
        creatorId: user.id,
        brand: productData[i].brand,
        name: productData[i].name,
        description: productData[i].description,
        price: productData[i].price,
        publicId: '',
        image: productData[i].image,
        liked: false,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
      });
      console.log(`Product created ${product.id}`);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
