import express from 'express';
import Article from '../models/article-model';
import parseErrors from '../utils/parseErrors';
import mongoose from 'mongoose';
import _ from 'lodash';

const router = express.Router();

router.post('/new-article', (req, res) => {
	const { content, avatar, author, email, title, image, tags, disableComment } = req.body.data;
	const articles = new Article({ _id: new mongoose.Types.ObjectId(),
		content, avatar, email, author, title, image, tags, disableComment
	})
		articles
		.save()
		.then(article => {
			res.json({ article })
		})
		.catch(err => res.status(400).json({ errors: { global: parseErrors(err.errors) }}))
})

router.get('/get-all-articles', (req, res) => {
	Article.find({})
		.sort('-added')
		.exec((err, articles) => {
			if (err) return res.status(400).json({ WentWrong: "Something Went Wrong When System Getting all articles" })
			res.json({ articles })
		})
})

router.get('/get-one-article/:id', (req, res) => {
	const { id } = req.body;
	Article.findByIdAndUpdate({ _id: id }, { $inc: { "pageview": 0.3 } }, (err, oneArticle) => {
			if (err) return res.status(400).json({ NotFound: "Article Not Found" })
			res.json({ oneArticle })
		})
})

// like system
router.post('/like', (req, res, next) => {
	const { name, id } = req.body.data;

	Article.findById({ _id: id }, (err, article) => {

		const check = article.like.filter(like => like.likedBy.includes(name))

		if (!_.isEmpty(check)) {
			Article.findByIdAndUpdate(article.id, {$pull: { like: { likedBy: name } }}, {safe: true}, (err, art) => {
				if(err)	return res.status(400).json({ disLike: "Something went wrong" }); 
				else return res.json({ like: false });
			});
		} else {
			Article.findByIdAndUpdate(article.id, {$push: { like: { likedBy: name } }}, {safe: true}, (err, art) => {
				if(err)	return res.status(400).json({ addLike: "Something went wrong" }); 
				else return res.json({ like: true });
			});
		}
	})
})

export default router;