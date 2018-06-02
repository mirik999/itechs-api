import mongoose from 'mongoose';
import Promise from 'bluebird';
import keys from './config/keys';

class Db {

  constructor() {
    this.mongoClient = mongodb.MongoClient;
    this.ObjectID = mongodb.ObjectID;
  }

  onConnect() {
    const mongoURL = process.env.PORT === 4000 ? keys.mongoDB.Dev : keys.mongoDB.Prod;

    return new Promise((resolve, reject) => {
      this.mongoClient.connect(mongoURL, (err, db) => {
        if (err) {
          reject(err);
        } else {
          resolve([db, this.ObjectID])
        }
      })
    })
  }

}

export default new Db();