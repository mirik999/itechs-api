import mongoose from 'mongoose';  
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

const schema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
	passwordHash: { type: String },
  facebookId: { type: String },
  githubId: { type: String },
	googleId: { type: String },
  useravatar: { type: String, required: true },
	userip: { type: String, required: true },
  accessToken: { type: String },
	date: { type: Date, default: Date.now }
});

schema.methods.setPassword = function setPassword(password) {
	this.passwordHash = bcrypt.hashSync(password, 10)
};

schema.methods.isValidPassword = function isValidPassword(password) {
	return bcrypt.compareSync(password, this.passwordHash)
};

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

// schema plugins
schema.plugin(uniqueValidator, { message: "This data is already taken" });

const User = mongoose.model('User', schema);

export default User;