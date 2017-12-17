import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: { type: String, required: true },
	image: { type: String, required: true },
	content: { type: String, required: true },
	email: { type: String, required: true },
	author: { type: String, required: true, index: true },
	avatar: { type: String, required: true },
	added: { type: Date, default: Date.now },
	pageview: { type: Number, default: 0 },
	like: [
		{
			count: { type: Number, required: false },
			likedBy: { type: String, required: true }
		}
	],
	dislike: [
		{
			count: { type: Number, required: false },
			dislikedBy: { type: String, required: true }
		}
	],
	comments: [
		{
			_id: mongoose.Schema.Types.ObjectId,
			text: { type: String, required: true },
			author: {
				name: String,
				avatar: String
			},
			date: { type: Date, default: Date.now }
		}
	]
});

const Article = mongoose.model('Article', schema)

export default Article;