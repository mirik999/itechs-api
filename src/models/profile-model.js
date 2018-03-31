import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	user: { type: String, unique: true },
	about: { type: String },
	portfolio: { type: String },
	contact: { type: String },
	github: { type: String },
	bgImg: { type: String, default: "http://res.cloudinary.com/developers/image/upload/v1513099538/ynufy8bwqn1qrwdxcinh.png" },
	smallImage: { type: String, default: "http://res.cloudinary.com/developers/image/upload/c_scale,w_300/v1513099538/ynufy8bwqn1qrwdxcinh.png" }
})

const Profile = mongoose.model('Profile', schema)

export default Profile;