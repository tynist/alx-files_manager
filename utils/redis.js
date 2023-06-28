// Import the redis and util modules
const { createClient } = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    // Create a Redis client
    this.myClient = createClient();

    // Set up an error handler
    this.myClient.on('error', (error) => console.log(error));
  }

  // Check if Redis client is connected to the server
  isAlive() {
    return this.myClient.connected;
  }

  // Get the value associated with the given key from Redis
  async get(key) {
    // Convert the `GET` command to a promise-based function using `promisify`
    const getAsync = promisify(this.myClient.GET).bind(this.myClient);
    return getAsync(key);
  }

  // Set the value associated with the given key in Redis
  async set(key, val, time) {
    // Convert the `SET` command to a promise-based function using `promisify`
    const setAsync = promisify(this.myClient.SET).bind(this.myClient);
    return setAsync(key, val, 'EX', time);
  }

  // Delete the key-value pair associated with the given key from Redis
  async del(key) {
    // Convert the `DEL` command to a promise-based function using `promisify`
    const delAsync = promisify(this.myClient.DEL).bind(this.myClient);
    return delAsync(key);
  }
}

// Create a new Redis client instance
const redisClient = new RedisClient();

// Export the Redis client instance
module.exports = redisClient;
