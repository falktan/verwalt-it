import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

let database;
let client;

if (process.env.USE_IN_MEMORY_DB) {
  console.log('Using in-memory MongoDB');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  client = new MongoClient(uri);
  await client.connect();
  database = client.db('testdb');
} else {
  client = new MongoClient(process.env.MONGODB_URL);
  await client.connect();
  database = client.db(); // Use database from connection string
}

export default database;