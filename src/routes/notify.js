import express from 'express';
import Notify from '../models/notify-model';

const router = express.Router();

router.post('/get-my-nots', (req, res) => {
	const userEmail = req.body.data;
	Notify.find({ 'author': userEmail }, (err, notify) => {
		if (err) return res.status(400).json({ WentWrong: "Something went wrong when getting all notifyes" })
		res.json({ notify })
	})
})

router.post('/del-my-not', (req, res) => {
	Notify.remove({ "_id": req.body.data }, (err) => {
		if (err) return res.status(400).json({ WentWrong: "Something went wrong when deleting the notify" })
	})
})

export default router;