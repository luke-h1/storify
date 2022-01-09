/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import 'dotenv-safe/config';
import bcrypt from 'bcryptjs';
import { getManager } from 'typeorm';
import createConn from '../db/createConn';
import { User } from '../entities/User';

(async () => {
  try {
    await createConn();

    const userRepository = await getManager().getRepository(User);
    const hashedPassword = await bcrypt.hash('storify12345', 12);

    for (let i = 0; i < 24; i += 1) {
      const result = await userRepository.save({
        firstName: `test ${i}`,
        lastName: `test ${i}`,
        email: `test${i}@test.com`,
        password: hashedPassword,
      });
      console.log(`User created: ${result.id}`);
    }
    const adminUser = await userRepository.save({
      firstName: 'admin',
      lastName: 'admin',
      email: 'admin@test.com',
      password: hashedPassword,
      isAdmin: true,
    });
    console.log(`Admin user created: ${adminUser.email}`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
