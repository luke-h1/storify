/* eslint-disable no-console */
import mongoose from 'mongoose';

const connect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        autoIndex: true,
        maxPoolSize: 50, 
        serverSelectionTimeoutMS: 5000, 
        socketTimeoutMS: 45000, 
        family: 4 
    });
    console.log(`Connected to database ${conn.connection.host}`)

  } catch (e) {
    console.error(e.message);
    process.exit(1)
  }
};
export default connect;
