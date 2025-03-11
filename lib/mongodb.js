import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI + '/uptime';

const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }

  return mongoose.connect(MONGODB_URI);
};

export default connectMongo;