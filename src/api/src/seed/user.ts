/* eslint-disable no-console */
import 'dotenv-safe/config';
import bcrypt from 'bcryptjs';
import faker from 'faker';
import { getManager } from 'typeorm';
import createConn from '../db/createConn';
import { User } from '../entities/User';

(async () => {
  try {
    await createConn();
    const userRepository = getManager().getRepository(User);
    const hashedPassword = await bcrypt.hash('storify12345', 12);

    for (let i = 0; i < 60; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const result = await userRepository.save({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: hashedPassword,
      });

      console.log(`User created: ${result.id}`);
    }
    const admin = await userRepository.save({
      firstName: 'admin',
      lastName: 'admin',
      email: 'admin@test.com',
      password: hashedPassword,
      isAdmin: true,
    });
    console.log(`Admin created: ${admin.email}`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
