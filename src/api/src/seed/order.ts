/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import 'dotenv-safe/config';
import { randomInt } from 'crypto';
import faker from 'faker';
import { getManager } from 'typeorm';
import createConn from '../db/createConn';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { User } from '../entities/User';

(async () => {
  try {
    await createConn();
    const userRepository = getManager().getRepository(User);
    const orderRepository = getManager().getRepository(Order);
    const orderItemRepository = getManager().getRepository(OrderItem);

    for (let i = 0; i < 60; i += 1) {
      const user = await userRepository.findOne({
        where: { id: randomInt(2, 31) },
      });
      const order = await orderRepository.save({
        creatorId: randomInt(2, 31),
        creator: user,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        address: faker.address.city(),
        country: faker.address.country(),
        city: faker.address.city(),
        postCode: faker.address.zipCode(),
        email: faker.internet.email(),
      });
      console.log(`Order created: ${order.id}`);

      for (let j = 0; j < randomInt(1, 15); j += 1) {
        const orderItem = await orderItemRepository.save({
          order,
          productTitle: faker.lorem.words(2),
          price: randomInt(10, 1000),
          qty: randomInt(1, 5),
        });
        console.log(`Order item created: ${orderItem.id}`);
      }
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
