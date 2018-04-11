import mongoose from 'mongoose';
import User from './user-model';

const schema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: { type: String, required: true },
	content: { type: String, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	added: { type: Date, default: Date.now },
	pageview: { type: Number, default: 0 },
	disableComment: { type: Boolean },
	tags: { type: String, default: "" },
	thumbnail: { type: Array, default: "" },
	like: [
		{
			likedBy: { type: String }
		}
	],
	comments: [
		{
			handleID: { type: Number },
			text: { type: String },
			author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			date: { type: Date, default: Date.now }
		}
	]
});

const Article = mongoose.model('Article', schema)

export default Article;