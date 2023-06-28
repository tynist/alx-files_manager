const { env } = require('process');
const { MongoClient, ObjectId } = require('mongodb');

class DBClient {
  constructor() {
    // Set up the connection from env variable or use the default value
    const host = env.DB_PORT ? env.DB_PORT : '127.0.0.1';
    const port = env.DB_HOST ? env.DB_HOST : 27017;
    const database = env.DB_DATABASE ? env.DB_DATABASE : 'files_manager';
    this.myClient = new MongoClient(`mongodb://${host}:${port}/${database}`);
    this.myClient.connect();
  }

  // Check if the MongoDB client is connected to the server
  isAlive() {
    return this.myClient.isConnected();
  }

  async nbUsers() {
    // Returns the number of documents in the 'users' collection
    const myDB = this.myClient.db();
    const myCollection = myDB.collection('users');
    return myCollection.countDocuments();
  }

  async nbFiles() {
    // Returns the number of documents in the 'files' collection
    const myDB = this.myClient.db();
    const myCollection = myDB.collection('files');
    return myCollection.countDocuments();
  }

  async userExists(email) {
    // Returns true if a user with the given email exists
    const myDB = this.myClient.db();
    const myCollection = myDB.collection('users');
    return myCollection.findOne({ email });
  }

  async newUser(email, passwordHash) {
    // Creates a new user with the given email and passwordHash
    const myDB = this.myClient.db();
    const myCollection = myDB.collection('users');
    return myCollection.insertOne({ email, passwordHash });
  }

  async filterUser(filters) {
    const myDB = this.myClient.db();
    const myCollection = myDB.collection('users');
    const updatedFilters = { ...filters };

    if ('_id' in updatedFilters) {
      // Convert the '_id' filter to ObjectId format
      updatedFilters._id = ObjectId(updatedFilters._id);
    }

    return myCollection.findOne(updatedFilters);
  }

  async filterFiles(filters) {
    const myDB = this.myClient.db();
    const myCollection = myDB.collection('files');
    const updatedFilters = { ...filters };
    const idFilters = ['_id', 'userId', 'parentId'].filter((prop) => prop in updatedFilters && updatedFilters[prop] !== '0');

    idFilters.forEach((i) => {
      // Convert id filters to ObjectId format
      updatedFilters[i] = ObjectId(updatedFilters[i]);
    });

    return myCollection.findOne(updatedFilters);
  }
}

// Create an instance of the DBClient class
const dbClient = new DBClient();

// Export the DBClient instance as a module
module.exports = dbClient;
