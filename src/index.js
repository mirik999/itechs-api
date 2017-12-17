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
// connect to mongodb
mongoose.Promise = Promise;
mongoose.connect(keys.mongoDB.db, { useMongoClient: true }, () => console.log('MongoDB started'))
// server settings
dotenv.config();
const app = express();
// set middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
// routing
app.use('/auth', auth);
app.use('/article', article);
app.use('/feedback', feedback);
app.use('/comment', comment);
// default
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
});
// server start
const server = app.listen(4000, () => console.log('Server started on port 4000'));