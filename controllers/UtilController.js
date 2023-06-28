const { createHash } = require('crypto');
const { promises } = require('fs');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class UtilController {
  // Generates SHA1 hash for a given string.
  static SHA1(str) {
    return createHash('sha1').update(str).digest('hex');
  }

  // Reads a file from the given path.
  static async readFile(path) {
    return promises.readFile(path, 'utf8');
  }

  // Middleware function to handle authentication token.
  static async token(request, response, next) {
    let token = request.headers['x-token'];
    token = `auth_${token}`;
    const userId = await redisClient.get(token);
    const user = await dbClient.filterUser({ _id: userId });

    if (!user) {
      // Unauthorized user
      response.status(401).json({ error: 'Unauthorized' }).end();
    } else {
      request.user = user;
      request.token = token;
      next();
    }
  }
}

module.exports = UtilController;
