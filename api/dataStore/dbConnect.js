import { MongoClient } from 'mongodb';
import 'dotenv/config';
import getMockDatabase from './mockDatabase.js';


let database;
let client;

if(process.env.USE_MOCK_DB === 'true') {
  console.log('Using Mock MongoDB');
  database = getMockDatabase();

} else if (process.env.USE_IN_MEMORY_DB === 'true') {
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  console.log('Using in-memory MongoDB');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  client = new MongoClient(uri);
  await client.connect();
  database = client.db('testdb');

} else {  // use real database
  console.log('Using real MongoDB');
  client = new MongoClient(process.env.MONGODB_URL);
  await client.connect();
  database = client.db(); // Use database from connection string
}

export default database;