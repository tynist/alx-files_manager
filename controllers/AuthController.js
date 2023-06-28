const { Buffer } = require('buffer');
const { v4 } = require('uuid');
const redisClient = require('../utils/redis');
const UtilController = require('./UtilController');
const dbClient = require('../utils/db');

class AuthController {
  // Handle connection and authentication
  static async getConnect(request, response) {
    try {
      const encodeAuthPair = request.headers.authorization.split(' ')[1];
      const decodeAuthPair = Buffer.from(encodeAuthPair, 'base64').toString().split(':');
      const _email = decodeAuthPair[0];
      const pwd = UtilController.SHA1(decodeAuthPair[1]);
      const user = await dbClient.filterUser({ email: _email });
      if (user.password !== pwd) {
        // Return 401 Unauthorized error if password does not match
        response.status(401).json({ error: 'Unauthorized' }).end();
      } else {
        const _token = v4();
        await redisClient.set(`auth_${_token}`, user._id.toString(), 86400);
        response.status(200).json({ token: _token }).end();
      }
    } catch (e) {
      // Return 401 Unauthorized error if any exception occurs
      response.status(401).json({ error: 'Unauthorized' }).end();
    }
  }

  // Handle disconnection
  static async getDisconnect(request, response) {
    const { token } = request;
    await redisClient.del(token);
    response.status(204).end();
  }
}

module.exports = AuthController;
