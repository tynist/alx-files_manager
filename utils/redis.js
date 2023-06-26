// Import the redis and util modules
const redis = require('redis');
const { promisify } = require('util');

// Create a class for the Redis client
class RedisClient {
  constructor() {
    // Create a Redis client
    this._client = redis.createClient();

    // Set up an error handler
    this._client.on('error', (error) => {
      console.error('Redis connection error:', error);
    });
  }

  // Check if the client is connected
  isAlive() {
    return this._client.connected;
  }

  // Get a key asynchronously
  getAsync = promisify((key, callback) => {
    // Get the key from Redis
    this._client.get(key, callback);
  });

  // Set a key asynchronously
  setAsync = promisify((key, value, duration, callback) => {
    // Set the key in Redis
    this._client.setex(key, duration, value, callback);
  });

  // Delete a key asynchronously
  delAsync = promisify((key, callback) => {
    // Delete the key from Redis
    this._client.del(key, callback);
  });
}

// Create a new Redis client instance
const redisClient = new RedisClient();

// Export the Redis client instance
module.exports = redisClient;
