import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose';
import passport from 'passport';
import Promise from 'bluebird';
import dotenv from 'dotenv';
import cors from 'cors';
import keys from './config/keys';
//routes
import auth from './routes/authenticate';
// oAuth passport.js setup
import passportSetup from './config/passport-setup';
// connect to mongodb
mongoose.Promise = Promise;
mongoose.connect(keys.mongoDB.db, { useMongoClient: true }, () => console.log('MongoDB started'))
// server settings
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieSession({
	maxAge: 24 * 60 * 60 * 1000, //day
	keys: ['shd23njfh38'] //secret key
}))
//initialize passport
app.use(passport.initialize());
app.use(passport.session());
// routing
app.use('/auth', auth);
// default
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
});
// server start
const server = app.listen(4000, () => console.log('Server started on port 4000'));