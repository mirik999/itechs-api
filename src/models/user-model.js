import mongoose from 'mongoose';  
import jwt from 'jsonwebtoken';

const schema = new mongoose.Schema({
  username: String,
  email: String,
  facebookId: String,
  githubId: String,
	googleId: String,
  useravatar: String,
  accessToken: String
});

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign({
    username: this.username,
    email: this.email,
    useravatar: this.useravatar,
  }, 'thesecretisopened')
};

schema.methods.toAuth = function toAuth() {
  return {
    username: this.username,
    email: this.email,
    useravatar: this.useravatar,
    token: this.generateJWT()
  }
};

const User = mongoose.model('user', schema);

export default User;