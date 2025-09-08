import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import apiRouter from './api/index.js';
import http from 'http';

const port = process.env.PORT || '3000';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public', { extensions: ['html'] }));
app.use('/api', apiRouter);
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
