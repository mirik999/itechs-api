import mongoose from 'mongoose';  
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

const schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
	passwordHash: { type: String },
  facebookId: { type: String },
  githubId: { type: String },
	googleId: { type: String },
	useravatar: { type: String, required: true },
	userSavatar: { type: String, required: true }, 
	userip: { type: String, required: true },
  accessToken: { type: String },
  date: { type: Date, default: Date.now },
  about: { type: String, default: "" },
	portfolio: { type: String, default: "" },
	contact: { type: String, default: "" },
	github: { type: String, default: "" },
	followedUsers: [
		{ 
			user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
		}
	],
	myFollows: [
		{ 
			user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
		}
	],
	online: { type: Boolean, default: false },
	socketID: { type: String }
});


schema.methods.setPassword = function setPassword(password) {
	this.passwordHash = bcrypt.hashSync(password, 10)
};

schema.methods.isValidPassword = function isValidPassword(password) {
	return bcrypt.compareSync(password, this.passwordHash)
};

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign({
    email: this.email,
  }, 'thesecretisopened', { expiresIn: '6h' })
};

schema.methods.toAuth = function toAuth() {
  return {
		email: this.email,
    token: this.generateJWT()
  }
};

// schema plugins
schema.plugin(uniqueValidator, { message: "This data is already taken" });

const User = mongoose.model('User', schema);

export default User;