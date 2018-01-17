import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
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
mongoose.connect(keys.mongoDB.db, { useMongoClient: true }, () => console.log('MongoDB started'))
// server settings
dotenv.config();
const app = express();
// set middleware
app.use(express.static(path.resolve(__dirname, 'build'))); // production
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
// routing
app.use('/auth', auth);
app.use('/article', article);
app.use('/feedback', feedback);
app.use('/comment', comment);
// app.use('/notify', notify); //socket-nen elemek lazimdi ay bala ))
app.use('/profile', profile);
// production
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
});
// dev
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
});
// server start
const server = app.listen(4000, () => console.log('Server started on port 4000'));