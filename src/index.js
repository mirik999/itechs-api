import express from 'express';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';
import EventEmitter from 'events';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import dotenv from 'dotenv';
import cors from 'cors';
import keys from './config/keys';
//routes
import auth from './routes/authenticate';
import article from './routes/article';
import feedback from './routes/feedback';
import comment from './routes/comment';
// import notify from './routes/notify';
import profile from './routes/profile';
// connect to mongodb
mongoose.Promise = Promise;
mongoose.connect(keys.mongoDB.db, { useMongoClient: true }, () => console.log('Mongo started'))
// server settings
dotenv.config();
const app = express();
app.server = http.createServer(app)
const emitter = new EventEmitter()
emitter.setMaxListeners(20)
// set middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//app.use(express.static(path.join(__dirname, 'build'))); // production
// routing
app.use('/auth', auth);
app.use('/article', article);
app.use('/feedback', feedback);
app.use('/comment', comment);
app.use('/profile', profile);
//app.use('/notify', notify); //socket-nen elemek lazimdi ay bala ))
// production
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'))
// });
// dev
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
});
// server start
app.server.listen(process.env.PORT || 4000, () =>
	console.log(`listening on ${app.server.address().port}`)
);