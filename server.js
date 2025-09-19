import http from 'http';
import createApp from './createApp.js';
import 'dotenv/config';


const port = process.env.PORT || 3000;

const server = http.createServer(createApp());
server.listen(port);
