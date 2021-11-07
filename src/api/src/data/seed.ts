/* eslint-disable no-console */
import 'dotenv/config';
import connect from '../db/connect';
import Order from '../models/orderModel';
import Product from '../models/productModel';
import User from '../models/userModel';
import products from './products';
import users from './users';

connect()

const seedDatabase = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser }
    })

    await Product.insertMany(sampleProducts)

    console.log('Database seeded')
    process.exit(0)

    
  } catch (e) {
    console.error(e);
    process.exit(1)
  }
}

const clearDatabase = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    console.log('Database cleared')
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
if (process.argv[2] === '-d') {
  clearDatabase()
} else {
  seedDatabase()
}
