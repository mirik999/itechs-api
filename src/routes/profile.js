import express from 'express';
import mongoose from 'mongoose';
import Profile from '../models/profile-model';

const router = express.Router();

router.get('/get-profile/:email', (req, res) => {
	const { email } = req.params;
	Profile.findOne({ user: email }, (err, profile) => {
		if (err) res.status(400).json({ WentWrong: "Something went wrong when getting profile" })
		res.json({ profile })
	})
})

router.put('/editing/:id', (req, res) => {
	const { data } = req.body;
		Profile.findOneAndUpdate({ user: data.email }, { $set: {
			"about": data.data.about,
			"portfolio": data.data.portfolio,
			"contact": data.data.contact
		} }, (err, profile) => {
			if (err) return res.status(400).json({ WentWrong: "Wrong edit profile" })
			res.json({ edited: true })
		})
})

router.put('/change-cover/:id', (req, res) => {
	const { bgImg, smallImage, email } = req.body.data;
	Profile.findOneAndUpdate({ user: email }, { $set: { bgImg, smallImage } }, (err, profile) => {
		if (err) res.status(400).json({ WentWrong: "Something went wrong when changing profile cover image" })
		res.json({ profile })
	})
})


export default router;