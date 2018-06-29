import express from 'express';
import Article from '../models/article-model';
import User from '../models/user-model';
import parseErrors from '../utils/parseErrors';
import mongoose from 'mongoose';
import _ from 'lodash';

const router = express.Router();

router.post('/new-article', (req, res) => {
	const { articleImages, thumbnail, content, settings, me } = req.body.data;
	
	const articles = new Article({
		_id: new mongoose.Types.ObjectId(),
		author: me,
		content: content,
		title: settings.title,
		disableComment: settings.disableComment,
		articleImages: articleImages,
		thumbnail: settings.thumbnail || "https://res.cloudinary.com/developers/image/upload/v1523722896/tgjxvrfzp15umewwcbtj.jpg",
		thumbnailSmall: settings.thumbnailSmall || "https://res.cloudinary.com/developers/image/upload/w_50,h_50/v1523722896/tgjxvrfzp15umewwcbtj.jpg"
	})
	articles
		.save()
		.then(article => {
			res.json({ article })
		})
		.catch(err => {
			console.log(err)	
			return res.status(400).json({ errors: { global: parseErrors(err.errors) }})
		})
})

router.get('/get-all-articles', (req, res) => {
	Article.find({})
		.populate('author', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
		.populate('comments.author', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
		.sort('-added')
		.exec((err, articles) => {
			if (err) return res.status(400).json({ WentWrong: "Something Went Wrong When Getting all articles" })
			res.json({ articles })
		})
})

router.get('/get-one-article/:id', (req, res) => {
	const { id } = req.params;
	Article.findByIdAndUpdate({ _id: id }, { $inc: { "pageview": 0.5 } })
		.populate('author', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
		.populate('comments.author', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
		.exec((err, oneArticle) => {
			if (err) return res.status(400).json({ NotFound: "Article Not Found" })
			res.json({ oneArticle })
		})
})


router.put('/edit-article/:id', (req, res) => {
	const { id } = req.params;
	const { data } = req.body;

	Article.findByIdAndUpdate({ _id: id }, { 
		$inc: { "pageview": 0.5 },
		content: data.editorState,
		articleImages: data.articleImages 
	})
		.populate('author', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
		.populate('comments.author', 'email useravatar username about contact portfolio github bgImg smallImage socketID')
		.exec((err, editedArticle) => {
			if (err) return res.status(400).json({ NotFound: "Article Not Found" })
			res.json({ editedArticle })
		})
})

router.delete('/delete-article/:id', (req, res) => {
	const { id } = req.params;

	Article.findByIdAndRemove({ _id: id }, (err, articles) => {
		if (err) return res.status(400).json({ NotFound: "Article Not Found" })
		res.json({ articles })
	})
})

// like system
router.post('/like', (req, res, next) => {
	const { name, id } = req.body.data;

	Article.findById({ _id: id }, (err, article) => {

		const check = article.like.filter(like => like.likedBy === name)

		if (!_.isEmpty(check)) {
			Article.findByIdAndUpdate(article.id, {$pull: { like: { "likedBy": name } }}, {safe: true}, (err, art) => {
				if(err)	return res.status(400).json({ disLike: "Something went wrong" }); 
				else return res.json({ like: false });
			});
		} else {
			Article.findByIdAndUpdate(article.id, {$push: { like: { "likedBy": name } }}, {safe: true}, (err, art) => {
				if(err)	return res.status(400).json({ addLike: "Something went wrong" }); 
				else return res.json({ like: true });
			});
		}
	})
})

export default router;