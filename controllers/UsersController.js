// Import the sha1, ObjectId, DBClient and RedisClient modules
const sha1 = require('sha1');
const { ObjectId } = require('mongodb');
const DBClient = require('../utils/db');
const RedisClient = require('../utils/redis');

class UsersController {
  // Create a new user
  static async postNew(req, res) {
    // Get the email and password from the request body
    const { email, password } = req.body;
    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!password) return res.status(400).send({ error: 'Missing password' });

    // Check if email already exists
    const userExists = await DBClient.db
      .collection('users')
      .findOne({ email });
    if (userExists) return res.status(400).send({ error: 'Already exist' });

    // Hash the password using SHA1
    const hashedPasswrd = sha1(password);

    // Insert the user into the database
    const newUser = await DBClient.db
      .collection('users')
      .insertOne({ email, password: hashedPasswrd });

    return res // Send the new user's ID and email back to the client
      .status(201)
      .send({ id: newUser.insertedId, email });
  }

  // Get the current user
  static async getMe(req, res) {
    // Get the user token from the request header
    const userToken = req.header('X-Token') || null;
    if (!userToken) return res.status(401).send({ error: 'Unauthorized' });

    // Retrieve the user ID from Redis using the token
    const userId = await RedisClient.get(`auth_${userToken}`);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });

    // Retrieve the user from the database using the ID
    const user = await DBClient.users.findOne({ _id: ObjectId(userId) });
    if (!user) return res.status(401).send({ error: 'Unauthorized' });

    // Remove the password field from the user object(response)
    delete user.password;

    // Send the user object back to the client
    return res.status(200).send({ id: user._id, email: user.email });
  }
}

// Export the UsersController class
module.exports = UsersController;
