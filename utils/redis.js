// Import the redis and util modules
const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    // Create a Redis client
    this.client = redis.createClient();

    // Set up an error handler
    this.client.on('error', (error) => {
      console.log('Redis client connection error:', error);
    });

    // Promisify Redis client methods
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.expireAsync = promisify(this.client.expire).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  // Check if Redis client is connected to the server
  isAlive() {
    return this.client.connected;
  }

  // Get a key asynchronously from Redis
  async get(key) {
    const value = await this.getAsync(key);
    return value;
  }

  // Set a key asynchronously from Redis
  async set(key, value, duratiion) {
    this.setAsync(key, value);
    // Set an expiration time
    this.expireAsync(key, duratiion);
  }

  // Delete a key asynchronously from Redis
  async del(key) {
    this.delAsync(key);
  }
}

// Create a new Redis client instance
const redisClient = new RedisClient();

// Export the Redis client instance
module.exports = redisClient;
