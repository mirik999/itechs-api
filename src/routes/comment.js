import express from 'express';
import Article from '../models/article-model';
import Notify from '../models/notify-model';

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
			res.json({ added: "Added" }) // this json for a promise, nothing else =)
			// Notifys will be with sockets
			// new Notify({
			// 			_id: new mongoose.Types.ObjectId(),
			// 			articleId: id,
			// 			author: comment.email,
			// 			comment: `${author} commented your `
			// 		}).save()
			// 			.then((notify) => res.status(200).json({ notify }))
			// 			.catch(err => res.status(400).json({ WentWrong: "Something Went Wrong" }))
	})
})

router.post('/del-comment', (req, res) => {
	const { commentid, articleid } = req.body.data;
	Article.findOneAndUpdate({ _id: articleid }, {
		$pull: {
			comments: { _id: commentid }
		}
	}, (err, comment) => {
		if (err) return res.status(400).json({ DelCommentError: "Something went wrong, try again" })
		res.json({ deleted: "Deleted" }) // this json for a promise, nothing else =)
	})
})

router.post('/edit-comment', (req, res) => { 
	const { commentid, articleid, content } = req.body.data;
	Article.findOneAndUpdate({ _id: articleid, "comments._id": commentid },{
		$set: { "comments.$.text" : content }
		}, (err, comment) => {
		if (err) return res.status(400).json({ DelCommentError: "Something went wrong, try again" })
		res.json({ edited: "Edited"  })
	})
})

export default router;