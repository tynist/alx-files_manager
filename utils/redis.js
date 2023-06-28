const { createClient } = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    // Create a Redis client
    this.myClient = createClient();
    // Handle error events from the Redis client
    this.myClient.on('error', (error) => console.log(error));
  }

  isAlive() {
    // Check if the Redis client is connected
    return this.myClient.connected;
  }

  async get(key) {
    // Promisify the Redis GET method
    const getAsync = promisify(this.myClient.get).bind(this.myClient);
    return getAsync(key); // Retrieve the value associated with the key
  }

  async set(key, val, time) {
    // Promisify the Redis SET method
    const setAsync = promisify(this.myClient.set).bind(this.myClient);
    // Set the value associated with the key and specify the expiration time
    return setAsync(key, val, 'EX', time);
  }

  async del(key) {
    // Promisify the Redis DEL method
    const delAsync = promisify(this.myClient.del).bind(this.myClient);
    return delAsync(key); // Delete the value associated with the key
  }
}

// Create an instance of the RedisClient class
const redisClient = new RedisClient();

// Export the Redis client as a module
module.exports = redisClient;
