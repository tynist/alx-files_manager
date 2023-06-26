const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    // initializes the `databaseName` value to null
    this.databaseName = null;

    // Get MongoDB connection details from env variabless or use defaults
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/`;

    // connects to the MongoDB database
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
      if (error) throw (error);

      // Store the database ref in the databaseName variable
      this.databaseName = client.db(database);
    });
  }

  // Check if `databaseName` has a database reference
  isAlive() {
    return !!this.databaseName;
  }

  // Gets the number of documents in the `users` collection
  async nbUsers() {
    const nbusers = await this.databaseName.collection('users').countDocuments();
    return nbusers;
  }

  // Gets the number of documents in the `files` collection
  async nbFiles() {
    const nbfiles = await this.databaseName.collection('files').countDocuments();
    return nbfiles;
  }
}

// Create an instance of DBClient
const dbClient = new DBClient();

// Export the DBClient instance as the module's default export
module.exports = dbClient;
