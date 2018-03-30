import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	user: { type: String, unique: true },
	about: { type: String },
	portfolio: { type: String },
	contact: { type: String },
	github: { type: String },
	bgImg: { type: String },
	smallImage: { type: String }
})

const Profile = mongoose.model('Profile', schema)

export default Profile;