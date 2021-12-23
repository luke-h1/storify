/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import 'dotenv-safe/config';
import { randomInt } from 'crypto';
import faker from 'faker';
import { getManager } from 'typeorm';
import createConn from '../db/createConn';
import { Order } from '../entities/Order';
import { Product } from '../entities/Product';
import { User } from '../entities/User';

(async () => {
  try {
    await createConn();
    const userRepository = getManager().getRepository(User);
    const productRepository = getManager().getRepository(Product);
    const orderRepository = getManager().getRepository(Order);

    for (let i = 0; i < 60; i += 1) {
      const user = await userRepository.findOne({
        where: { id: randomInt(2, 31) },
      });
      if (!user) {
        throw new Error('user not found');
      }

      const orders = await orderRepository.find({
        where: { id: randomInt(2, 31) },
      });
      if (!orders) {
        throw new Error('order not found');
      }

      const product = await productRepository.save({
        creator: user,
        creatorId: user.id,
        brand: faker.commerce.product(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        categories: [
          faker.commerce.department(),
          faker.commerce.productAdjective(),
        ],
        orders,
        price: randomInt(10, 3000),
        publicId: '',
        image: faker.image.animals(),
      });
      console.log(`Product created ${product.id}`);
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
