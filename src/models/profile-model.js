import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	user: { type: String, unique: true },
	about: { type: String, default: "" },
	portfolio: { type: String, default: "" },
	contact: { type: String, default: "" }
})

const Profile = mongoose.model('Profile', schema)

export default Profile;