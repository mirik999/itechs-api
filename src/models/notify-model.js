import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	articleId: { type: String, required: true },
	author: { type: String, required: true },
	comment: { type: String },
	date: { type: Date, default: Date.now }
});

const Notify = mongoose.model('Notify', schema)

export default Notify;

// muveqqeti cixartmisham projectden