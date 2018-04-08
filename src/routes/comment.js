import express from 'express';
import Article from '../models/article-model';

const router = express.Router();

router.post('/add-comment', (req, res) => {
	const { id, content, userID } = req.body.data;
	Article.findByIdAndUpdate({ _id: id }, {
			$push: {
				comments: {
						text: content, 
						author: userID
				}
			}
		}, (err, comment) => {
		if (err) return res.status(400).json({ AddCommentError: "Something went wrong, try again" })
			res.json({ added: "Added" }) // this json for a promise, nothing else =)
	})
})

router.delete('/del-comment/:id', (req, res) => {
	const { commentid, articleid } = req.body;
	Article.findOneAndUpdate({ _id: articleid }, {
		$pull: {
			comments: { _id: commentid }
		}
	}, (err, comment) => {
		if (err) return res.status(400).json({ DelCommentError: "Something went wrong, try again" })
		res.json({ deleted: "Deleted" }) // this json for a promise, nothing else =)
	})
})

router.put('/edit-comment/:id', (req, res) => { 
	const { commentid, articleid, content } = req.body.data;
	Article.findOneAndUpdate({ _id: articleid, "comments._id": commentid },{
		$set: { "comments.$.text" : content }
		}, (err, comment) => {
		if (err) return res.status(400).json({ DelCommentError: "Something went wrong, try again" })
		res.json({ edited: "Edited"  })
	})
})

export default router;