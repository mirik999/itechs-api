import express from 'express';
import Article from '../models/article-model';
import User from '../models/user-model';
import parseErrors from '../utils/parseErrors';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/new-article', (req, res) => {
	const { content, avatar, author, email, title, image } = req.body.data;
	const articles = new Article({ _id: new mongoose.Types.ObjectId(), content, avatar, email, author, title, image })
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

router.post('/get-one-article', (req, res) => {
	const { id } = req.body;
	Article.findByIdAndUpdate({ _id: id }, { $inc: { "pageview": 1 } }, (err, oneArticle) => {
			if (err) return res.status(400).json({ NotFound: "Article Not Found" })
			res.json({ oneArticle })
		})
})

// middleware for checking name in votes. One person can vote only one time for each vote
router.post('/like', (req, res, next) => {
	const { id, name } = req.body.data;
	// creating empty array
	let allNames = [];
	Article.findById({ _id: id }, (err, article) => {
		// if zero votes -> next() else checking name
		if (article.like.length !== 0) {
				// checking all data with filter and pushing datas to the array
				article.like.filter((element) => allNames.push(element.likedBy))
			// checking if in array includes session name -> reject else resolve
			if (allNames.includes(name)) {
				res.status(400).json({ likeCount: "Limited" })
			} else {
				next();
			}
		} else {
			next();
		}
	})
}, (req, res) => {
	const { id, name } = req.body.data;
	Article.findByIdAndUpdate({ _id: id }, { $push: { "like": { "count": 1, "likedBy": name } } })
		.exec((err, likedArticle) => {
			if(err) return res.status(400).json({ WentWrong: "Something Went Wrong When u r clicking like" })
		})
})

router.post('/dislike', (req, res, next) => {
	const { id, name } = req.body.data;
	let allNames = [];
	Article.findById({ _id: id }, (err, article) => {
		if (article.dislike.length !== 0) {
			article.dislike.filter((element) => allNames.push(element.dislikedBy))
			if (allNames.includes(name)) {
				res.status(400).json({ dislikeCount: "Limited" })
			} else {
				next();
			}
		} else {
			next();
		}
	})
}, (req, res) => {
	const { id, name } = req.body.data;
	Article.findByIdAndUpdate({ _id: id }, { $push: { "dislike": { "count": 1, "dislikedBy": name } } })
		.exec((err, dislikedArticle) => {
			if(err) return res.status(400).json({ WentWrong: "Something Went Wrong When u r clicking dislike" })
		})
})


export default router;