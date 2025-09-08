import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

let database;
let client;

// Check if MongoDB URL is provided via environment variable
const mongoUrl = process.env.MONGODB_URL;

if (mongoUrl) {
  // Use external MongoDB connection
  console.log('Connecting to external MongoDB at:', mongoUrl.replace(/\/\/[^:]*:[^@]*@/, '//***:***@')); // Hide credentials in logs
  client = new MongoClient(mongoUrl);
  await client.connect();
  database = client.db(); // Use database from connection string
} else {
  // Fall back to in-memory MongoDB
  console.log('No MONGODB_URL found, using in-memory MongoDB');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  console.log('MongoDB In-Memory Server started on uri:', uri);
  
  client = new MongoClient(uri);
  await client.connect();
  database = client.db('testdb');
}

export default database;