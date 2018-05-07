import express from 'express';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';
import EventEmitter from 'events';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import dotenv from 'dotenv';
import cors from 'cors';
import _ from 'lodash';
import socket from 'socket.io';
import helmet from 'helmet';
// mySettings
import keys from './config/keys';
// routes
import auth from './routes/authenticate';
import article from './routes/article';
import feedback from './routes/feedback';
import profile from './routes/profile';
import Article from './models/article-model';
// sockets
import sockets from './sockets/sockets';
// bluebird
mongoose.Promise = Promise;
// server settings
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socket(server);
const emitter = new EventEmitter();
emitter.setMaxListeners(20);
// sockets calling
sockets(server, io);
// set middleware
app.use(cors({
  'allowedHeaders': ['Accept', 'Content-Type', 'Origin', 'X-Requested-With'],
  'origin': '*',
}));
app.use(helmet());
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// routing
app.use('/api/auth', auth);
app.use('/api/article', article);
app.use('/api/feedback', feedback);
app.use('/api/profile', profile);
// prod and dev mode
if (process.env.NODE_ENV == 'production') {
  mongoose.connect(keys.mongoDB.Prod, { useMongoClient: true }, () => console.log('Mongo started prod-mode'));
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  });
} else if (process.env.NODE_ENV == 'development') {
  mongoose.connect(keys.mongoDB.Dev, { useMongoClient: true }, () => console.log('Mongo started dev-mode'));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
  });
}
// server port and start
server.listen(process.env.PORT || 4000, () =>
	console.log(`listening on ${server.address().port}`)
);
  