import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

const mongod = await MongoMemoryServer.create();
const uri = mongod.getUri();

console.log('MongoDB In-Memory Server started on uri:', uri);

const client = new MongoClient(uri);
await client.connect();
const database = client.db('testdb');

export default database;