/* eslint-disable no-console */
import mongoose from 'mongoose';

const connect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
      maxPoolSize: 50,
      family: 4,
    });
    console.log(`Connected to database ${conn.connection.host}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e.message);
    process.exit(1);
  }
};
export default connect;
