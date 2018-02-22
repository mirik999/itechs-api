import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	user: { type: String, unique: true },
	about: { type: String, default: "" },
	portfolio: { type: String, default: "" },
	contact: { type: String, default: "" },
	bgImg: { type: String, default: "https://res.cloudinary.com/developers/image/upload/v1515360029/bg-img_kbpmjl.png" }
})

const Profile = mongoose.model('Profile', schema)

export default Profile;