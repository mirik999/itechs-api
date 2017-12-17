import express from 'express';
import Article from '../models/article-model';

const router = express.Router();

router.post('/add-comment', (req, res) => {
	const { id, content, author, avatar } = req.body.data;
	Article.findByIdAndUpdate({ _id: id }, {
			$push: {
				comments: {
					text: content, author: {
						name: author,
						avatar: avatar
					}
				}
			}
		}, (err, comment) => {
		if (err) return res.status(400).json({ AddCommentError: "Something went wrong, try again" })
		res.json({ comment })
	})
})

export default router;