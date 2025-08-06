const mongoose = require('mongoose');
const redis = require('redis');

let redisClient;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    await redisClient.connect();
    console.log('Redis connected successfully');
    return redisClient;
  } catch (error) {
    console.error('Redis connection error:', error);
    console.log('Continuing without Redis cache');
    return null;
  }
};

module.exports = {
  connectMongoDB,
  connectRedis,
  getRedisClient: () => redisClient
};