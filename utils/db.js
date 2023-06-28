const { env } = require('process');
const { MongoClient, ObjectId } = require('mongodb');

class DBClient {
  constructor() {
    // Get MongoDB connection details from env variabless or use defaults
    const host = env.DB_PORT ? env.DB_PORT : '127.0.0.1';
    const port = env.DB_HOST ? env.DB_HOST : 27017;
    const database = env.DB_DATABASE ? env.DB_DATABASE : 'files_manager';

    // Initialize the MongoDB client and establish the connection
    this.myClient = MongoClient(`mongodb://${host}:${port}/${database}`);
    this.myClient.connect();
  }

  // Check if the database client is alive and connected
  isAlive() {
    return this.myClient.isConnected();
  }

  // Gets the number of documents in the 'users' collection
  async nbUsers() {
    const myDB = this.myClient.db();
    const myCollection = myDB.collection('users');
    return myCollection.countDocuments();
  }

  // Get the number of documents in the 'files' collection
  async nbFiles() {
    const myDB = this.myClient.db();
    const myCollection = myDB.collection('files');
    return myCollection.countDocuments();
  }

  // Check if a user with the given email exists
  async userExists(email) {
    const myDB = this.myClient.db();
    const myCollection = myDB.collection('users');
    return myCollection.findOne({ email });
  }

  // Create a new user with the given email and passwordHash
  async newUser(email, passwordHash) {
    const myDB = this.myClient.db();
    const myCollection = myDB.collection('users');
    return myCollection.insertOne({ email, passwordHash });
  }

  // Filter and find a user based on the provided filters
  async filterUser(filters) {
    const myDB = this.myClient.db();
    const myCollection = myDB.collection('users');

    if ('_id' in filters) {
      // Convert '_id' filter to ObjectId
      filters._id = ObjectId(filters._id);
    }

    return myCollection.findOne(filters);
  }

  // Filter and find files based on the provided filters
  async filterFiles(filters) {
    const myDB = this.myClient.db();
    const myCollection = myDB.collection('files');

    const idFilters = ['_id', 'userId', 'parentId'].filter((prop) => prop in filters && filters[prop] !== '0');

    idFilters.forEach((i) => {
      // Convert '_id', 'userId', and 'parentId' filters to ObjectId
      filters[i] = ObjectId(filters[i]);
    });

    return myCollection.findOne(filters);
  }
}

// Create an instance of DBClient
const dbClient = new DBClient();

// Export the DBClient instance as the module's default export
module.exports = dbClient;
