import mongoose from 'mongoose';  
import jwt from 'jsonwebtoken';

const schema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
  email: { type: String, required: true },
  facebookId: { type: String },
  githubId: { type: String },
	googleId: { type: String },
  useravatar: { type: String, required: true },
	userip: { type: String, required: true },
  accessToken: { type: String },
	votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
});

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign({
    username: this.username,
    email: this.email,
    useravatar: this.useravatar
  }, 'thesecretisopened', { expiresIn: '6h' })
};

schema.methods.toAuth = function toAuth() {
  return {
    username: this.username,
    email: this.email,
    useravatar: this.useravatar,
    token: this.generateJWT()
  }
};

const User = mongoose.model('User', schema);

export default User;