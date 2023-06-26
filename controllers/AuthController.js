const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');
const DBClient = require('../utils/db');
const RedisClient = require('../utils/redis');

class AuthController {
  static async getConnect(req, res) {
    // Get the "Authorization" header from the request
    const authorization = req.header('Authorization') || '';
    if (!authorization) return res.status(401).send({ error: 'Unauthorized' });

    // Decode the authorization header
    const decodedCredentials = Buffer.from(authorization.replace('Basic ', ''), 'base64');
    // Parse the decoded credentials into an object
    const credentials = {
      email: decodedCredentials.toString('utf-8').split(':')[0],
      password: decodedCredentials.toString('utf-8').split(':')[1],
    };
    if (!credentials.email || !credentials.password) return res.status(401).send({ error: 'Unauthorized' });

    // Hash the password using sha1
    credentials.password = sha1(credentials.password);

    // Find the user in the database
    const user = await DBClient.db
      .collection('users')
      .findOne(credentials);
    if (!user) return res.status(401).send({ error: 'Unauthorized' });

  
    const token = uuidv4();  // Generate a new token
    const key = `auth_${token}`; // Create a key in Redis for the token
    // Set the key in Redis with the user ID
    await RedisClient.set(key, user._id.toString(), 86400);

    return res.status(200).send({ token }); // Return the generated token as a response
  }

  // Disconnect the user
  static async getDisconnect(req, res) {
    // Get the token from the request header
    const token = req.header('X-Token') || '';
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    // Get the user ID from Redis
    const tokenId = await RedisClient.get(`auth_${token}`);
    if (!tokenId) return res.status(401).send({ error: 'Unauthorized' });

    // Delete the token from Redis
    await RedisClient.del(`auth_${token}`);

    // Return a 204 No Content response
    return res.status(204).send();
  }
}

// Export the AuthController class
module.exports = AuthController;
